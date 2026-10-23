import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RentalContract, Camera, ContractStatus, BankConfig, ContractTemplate, Customer } from '../types';
import MoneyInput from './MoneyInput';
import { 
  Search, Plus, Filter, Calendar, FileText, Check, AlertCircle, RefreshCw, X, 
  ShieldAlert, Phone, Briefcase, Trash2, CreditCard, Settings, Download, 
  Image as ImageIcon, ChevronLeft, ChevronRight, FileSpreadsheet, Copy, Edit2, 
  Save, Clock, DollarSign, User, AlertTriangle, CheckCircle2, Zap, Printer 
} from 'lucide-react';
import { getCameraRateForDuration, checkBookingConflict, getPrintPrice } from '../utils/pricing';
import { loadStoredData, saveStoredData, cleanSystemNote } from '../utils/mockData';
import { isSupabaseConfigured, syncToSupabase, fetchFromSupabase } from '../utils/supabase';
import { formatDMY } from '../utils/dateUtils';
import { generateVietQrString, generateQrSvg } from '../utils/vietqr';
import { toPng } from 'html-to-image';
import { matchContract } from '../utils/searchUtils';
import { useScrollLock } from '../utils/useScrollLock';
import { generateNextContractCode } from '../utils/contractUtils';

interface ContractManagerProps {
  contracts: RentalContract[];
  cameras: Camera[];
  customers?: Customer[];
  onAddContract: (contract: RentalContract) => void;
  onUpdateContractStatus: (id: string, status: ContractStatus, note?: string, paidAmount?: number) => void;
  onDeleteContract?: (id: string) => void;
  onUpdateContractNote?: (id: string, note: string) => void;
  onUpdateContractCustomer?: (id: string, customerName: string, customerPhone: string, customerDocType: RentalContract['customerDocType'], customerDocNote: string) => void;
  onUpdateContractSurcharge?: (id: string, surchargeAmount: number, surchargeReason: string) => void;
  initialSearchQuery?: string;
  systemDate: string;
  isAdmin?: boolean;
  onFixDuplicateContracts?: () => void;
}

export const VIET_BANKS = [
  { id: 'MB', name: 'MB Bank (Quân Đội)' },
  { id: 'VCB', name: 'Vietcombank (Ngoại Thương)' },
  { id: 'TCB', name: 'Techcombank (Kỹ Thương)' },
  { id: 'ACB', name: 'ACB (Á Châu)' },
  { id: 'BIDV', name: 'BIDV (Đầu tư & Phát triển)' },
  { id: 'ICB', name: 'Vietinbank (Công Thương)' },
  { id: 'VBA', name: 'Agribank (Nông nghiệp)' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)' },
  { id: 'VPB', name: 'VPBank (Thịnh Vượng)' },
  { id: 'VIB', name: 'VIB (Quốc Tế)' },
  { id: 'STB', name: 'Sacombank' },
];

export const renderDocTypeLabel = (docType: string) => {
  switch (docType) {
    case 'CCCD': return 'Giữ CCCD gốc';
    case 'CCCD_And_1M': return 'Giữ CCCD + 1 triệu';
    case 'GPLX': return 'Giữ bằng lái (GPLX)';
    case 'Passport': return 'Giữ hộ chiếu (Passport)';
    case 'CashDeposit': return 'Đặt cọc tiền mặt';
    case 'Other': return 'Thế chấp tài sản khác';
    default: return docType;
  }
};

export const getBankBin = (id: string): string => {
  const bins: Record<string, string> = {
    'MB': '970422',
    'VCB': '970436',
    'TCB': '970407',
    'ACB': '970416',
    'BIDV': '970418',
    'ICB': '970415',
    'VBA': '970405',
    'TPB': '970423',
    'VPB': '970432',
    'VIB': '970441',
    'STB': '970403'
  };
  return bins[id] || id;
};

export function QrDisplay({ 
  customImage,
  bin,
  accountNo,
  className 
}: { 
  customImage?: string;
  bin: string;
  accountNo: string;
  className?: string; 
}) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    if (customImage) return;
    let active = true;
    const cleanAccount = (accountNo || '').trim();
    if (!bin || !cleanAccount) return;
    const qrString = generateVietQrString(bin, cleanAccount);
    generateQrSvg(qrString).then(svg => {
      if (active && svg) {
        setSvgContent(svg);
      }
    });
    return () => { active = false; };
  }, [customImage, bin, accountNo]);

  if (customImage) {
    return (
      <img
        src={customImage}
        alt="Mã QR thanh toán"
        className={className || "w-full h-full object-contain rounded"}
      />
    );
  }

  if (svgContent) {
    return (
      <div
        className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain rounded"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-mono">
      Đang tải QR...
    </div>
  );
}

export const QrCanvas = QrDisplay;

export const DEFAULT_RENTAL_TERMS = `• Kiểm tra khi nhận: Quý khách vui lòng kiểm tra kỹ trang phục và phụ kiện đi kèm (khóa kéo, đường may, vết bẩn, khuy áo) trước khi nhận rời khỏi cửa hàng.
• Bảo quản trang phục: Không tự ý cắt may, bóp nới, là/ủi ở nhiệt độ cao hoặc sử dụng hóa chất tẩy rửa mạnh làm hỏng form dáng và chất liệu vải.
• Thời gian trả đồ: Vui lòng hoàn trả trang phục đúng hạn thỏa thuận. Trường hợp cần gia hạn, xin vui lòng thông báo sớm cho cửa hàng để được hỗ trợ (tránh phát sinh phụ thu quá hạn).
• Hư hỏng & Bồi hoàn: Nếu trang phục bị rách, cháy, ố bẩn không thể phục hồi hoặc làm mất đồ/phụ kiện, quý khách vui lòng thanh toán phí phục hồi hoặc bồi hoàn theo giá trị sản phẩm.
• Cọc thế chấp: Tiệm sẽ hoàn trả 100% tiền cọc hoặc giấy tờ tùy thân cho quý khách ngay sau khi kiểm tra nhận lại đầy đủ trang phục.`;

export default function ContractManager({
  contracts,
  cameras,
  customers = [],
  onAddContract,
  onUpdateContractStatus,
  onDeleteContract,
  onUpdateContractNote,
  onUpdateContractCustomer,
  onUpdateContractSurcharge,
  initialSearchQuery,
  systemDate,
  isAdmin = false,
  onFixDuplicateContracts
}: ContractManagerProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hideCustomerSuggestions, setHideCustomerSuggestions] = useState(false);
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [customAlertMessage, setCustomAlertMessage] = useState<string | null>(null);

  // States for inline quick notes
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  // States for surcharge editing in modal
  const [editingSurcharge, setEditingSurcharge] = useState(false);
  const [surchargeDraft, setSurchargeDraft] = useState<number>(0);
  const [surchargeReasonDraft, setSurchargeReasonDraft] = useState<string>('');

  // States for editing customer info in modal
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [customerDraft, setCustomerDraft] = useState({
    name: '',
    phone: '',
    docType: 'CCCD' as RentalContract['customerDocType'],
    docNote: ''
  });

  // State for customizable rental terms
  const [rentalTerms, setRentalTerms] = useState<string>(() => {
    return localStorage.getItem('shop_rental_terms') || DEFAULT_RENTAL_TERMS;
  });
  const [editingTerms, setEditingTerms] = useState(false);
  const [termsDraft, setTermsDraft] = useState('');

  const handleSaveNote = (id: string) => {
    if (onUpdateContractNote) {
      onUpdateContractNote(id, noteDraft.trim());
    }
    setEditingNoteId(null);
    setNoteDraft('');
  };

  // Helper to read custom QR image safely (handles plain base64, data URIs, or JSON-encoded strings)
  const getStoredCustomQr = (): string => {
    try {
      const raw = localStorage.getItem('custom_payment_qr_image');
      if (!raw) return '';
      if (raw.startsWith('data:image') || raw.startsWith('http')) return raw;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'string') return parsed;
      } catch {
        return raw;
      }
      return raw;
    } catch {
      return '';
    }
  };

  // Bank information & QR configuration states
  const [bankConfig, setBankConfig] = useState<BankConfig>(() =>
    loadStoredData('rental_bank_config', {
      bankId: 'MB',
      accountNo: '0387532321',
      accountName: 'TIEM ANH NHA CAO'
    })
  );
  const [showBankSettings, setShowBankSettings] = useState(false);
  const [qrAmountOption, setQrAmountOption] = useState<'remaining' | 'deposit50' | 'full' | 'custom'>('remaining');
  const [customQrAmount, setCustomQrAmount] = useState<number | null>(null);

  // Lock body scroll whenever any modal is open (placed after all related state declarations)
  useScrollLock(Boolean(selectedContract || showAddModal || deleteConfirmId || customAlertMessage || showBankSettings));

  const [customQrImage, setCustomQrImage] = useState<string>(getStoredCustomQr);
  const [vietQrBase64, setVietQrBase64] = useState<string>('');

  const vietQrUrl = useMemo(() => {
    return `https://img.vietqr.io/image/${getBankBin(bankConfig.bankId)}-${bankConfig.accountNo}-compact2.png?accountName=${encodeURIComponent(bankConfig.accountName)}`;
  }, [bankConfig.bankId, bankConfig.accountNo, bankConfig.accountName]);

  // Pre-convert VietQR to base64 data URL to ensure 100% reliable export on mobile and offline
  useEffect(() => {
    if (customQrImage) return;
    let active = true;
    fetch(vietQrUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === 'string') {
            setVietQrBase64(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [vietQrUrl, customQrImage]);

  // Sync bank config and custom QR with Supabase cloud and across tabs
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchFromSupabase('custom_payment_qr_image').then(cloudQr => {
        if (cloudQr && typeof cloudQr === 'string') {
          setCustomQrImage(cloudQr);
          saveStoredData('custom_payment_qr_image', cloudQr);
        }
      });
      fetchFromSupabase('rental_bank_config').then(cloudBank => {
        if (cloudBank && cloudBank.bankId && cloudBank.accountNo) {
          setBankConfig(cloudBank);
          setBankDraft(cloudBank);
          saveStoredData('rental_bank_config', cloudBank);
        }
      });
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'custom_payment_qr_image') {
        setCustomQrImage(getStoredCustomQr());
      }
      if (e.key === 'rental_bank_config') {
        const fresh = loadStoredData('rental_bank_config', null);
        if (fresh) {
          setBankConfig(fresh);
          setBankDraft(fresh);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleUploadCustomQr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCustomQrImage(base64);
      saveStoredData('custom_payment_qr_image', base64);
      if (isSupabaseConfigured) {
        syncToSupabase('custom_payment_qr_image', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQr = () => {
    setCustomQrImage('');
    saveStoredData('custom_payment_qr_image', '');
    if (isSupabaseConfigured) {
      syncToSupabase('custom_payment_qr_image', '');
    }
  };

  const handleUpdateBankConfig = (newConfig: BankConfig) => {
    setBankConfig(newConfig);
    saveStoredData('rental_bank_config', newConfig);
    if (isSupabaseConfigured) {
      syncToSupabase('rental_bank_config', newConfig);
    }
  };

  const [bankDraft, setBankDraft] = useState<BankConfig>(bankConfig);

  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Detect iOS / iPhone / iPad Safari
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleExportImage = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      setCustomAlertMessage('Không tìm thấy dữ liệu để xuất ảnh!');
      return;
    }
    
    setIsExporting(true);
    setEditingCustomer(false);
    setEditingTerms(false);
    
    // Wait for isExporting state to remove edit buttons from DOM
    // iOS Safari needs extra time to render fonts and external assets
    await new Promise(resolve => setTimeout(resolve, isIOS ? 600 : 250));
    
    // Temporarily override inline styles to neutralize margin offset
    const prevMarginLeft = element.style.marginLeft;
    const prevMarginRight = element.style.marginRight;
    const prevWidth = element.style.width;
    const prevMinWidth = element.style.minWidth;
    const prevMaxWidth = element.style.maxWidth;
    
    element.style.marginLeft = '0';
    element.style.marginRight = '0';
    element.style.width = '420px';
    element.style.minWidth = '420px';
    element.style.maxWidth = '420px';
    
    try {
      // iOS Safari "double-render" trick:
      // First pass warms up the canvas (often blank on iOS),
      // second pass produces the correct output.
      const toPngOptions = {
        backgroundColor: '#ffffff',
        pixelRatio: isIOS ? 1.5 : 2, // lower ratio on iOS to prevent memory crash
        width: 420,
        cacheBust: true,             // force reload cross-origin images
      };

      if (isIOS) {
        // Warm-up pass (result discarded)
        await toPng(element, toPngOptions).catch(() => {});
        // Short pause for Safari to settle
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const dataUrl = await toPng(element, toPngOptions);

      if (isIOS) {
        // iOS Safari does NOT support the `download` attribute on <a> tags.
        // Open image in a new tab — user can long-press → Save Image.
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${filename}</title></head>` +
            `<body style="margin:0;background:#111;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding-bottom:80px;">` +
            `<div style="position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">` +
            `<span style="color:#fff;font-family:sans-serif;font-size:13px;flex:1;">📥 Nhấn giữ ảnh bên dưới → <b>Lưu vào Ảnh</b></span>` +
            `<button onclick="window.close()" style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:14px;font-weight:bold;cursor:pointer;font-family:sans-serif;white-space:nowrap;">✕ Đóng</button>` +
            `</div>` +
            `<div style="margin-top:56px;width:100%;display:flex;justify-content:center;padding:16px;box-sizing:border-box;">` +
            `<img src="${dataUrl}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 4px 32px rgba(0,0,0,.5);" />` +
            `</div>` +
            `</body></html>`
          );
          newTab.document.close();
        } else {
          // Popup blocked fallback
          setCustomAlertMessage('Trình duyệt đã chặn cửa sổ. Vui lòng cho phép popup và thử lại!');
        }
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Lỗi khi xuất ảnh:', err);
      setCustomAlertMessage('Không thể tạo file ảnh. Vui lòng thử lại!');
    } finally {
      // Restore original styles
      element.style.marginLeft = prevMarginLeft;
      element.style.marginRight = prevMarginRight;
      element.style.width = prevWidth;
      element.style.minWidth = prevMinWidth;
      element.style.maxWidth = prevMaxWidth;
      setIsExporting(false);
    }
  };

  const handlePrintReceipt = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      setCustomAlertMessage('Không tìm thấy dữ liệu hóa đơn để in!');
      return;
    }

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    const headContent = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa đơn ${selectedContract?.contractCode || 'hợp đồng'}</title>
          ${headContent}
          <style>
            @page { size: auto; margin: 8mm; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
              background: #fff !important; 
              color: #000 !important;
              padding: 0;
              margin: 0;
            }
            .no-print, [data-no-export="true"], button { display: none !important; }
            #${elementId} {
              box-shadow: none !important;
              border: none !important;
              width: 100% !important;
              max-width: 650px !important;
              margin: 0 auto !important;
              padding: 5px !important;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 400);
  };

  const handleExportCSV = () => {
    if (filteredContracts.length === 0) {
      setCustomAlertMessage('Không có dữ liệu hợp đồng nào để xuất!');
      return;
    }

    const BOM = '\uFEFF';
    const headers = [
      'Mã Hợp Đồng',
      'Tên Khách Hàng',
      'Số Điện Thoại',
      'Loại Giấy Tờ',
      'Thông Tin Giấy Tờ',
      'Trang Phục Thuê',
      'Ngày Bàn Giao',
      'Ngày Trả Dự Kiến',
      'Thời Hạn',
      'Tổng Tiền Thuê (VND)',
      'Đã Thanh Toán (VND)',
      'Tiền Đặt Cọc (VND)',
      'Trạng Thái',
      'Ghi Chú',
      'Ngày Lập'
    ];

    const rows = filteredContracts.map(c => {
      const cameraNames = c.items.map(item => item.cameraName).join(' + ');
      const daysCount = Math.max(1, Math.ceil((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const durationText = `${daysCount} ngày`;
      
      let statusVN = c.status;
      if (c.status === 'Pending') statusVN = 'Chờ bàn giao';
      else if (c.status === 'Active') statusVN = 'Đang thuê';
      else if (c.status === 'Completed') statusVN = 'Đã trả đồ';
      else if (c.status === 'Overdue') statusVN = 'Quá hạn trả';
      else if (c.status === 'Cancelled') statusVN = 'Đã hủy';

      return [
        c.contractCode,
        `"${c.customerName.replace(/"/g, '""')}"`,
        `"${c.customerPhone.replace(/"/g, '""')}"`,
        c.customerDocType,
        `"${(c.customerDocNote || '').replace(/"/g, '""')}"`,
        `"${cameraNames.replace(/"/g, '""')}"`,
        c.startDate,
        c.endDate,
        `"${durationText.replace(/"/g, '""')}"`,
        c.totalPrice,
        c.paidAmount,
        c.depositAmount,
        statusVN,
        `"${(c.note || '').replace(/"/g, '""')}"`,
        c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : ''
      ];
    });

    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_don_thue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [contractOutfitSearch, setContractOutfitSearch] = useState<string>('');
  const [contractSizeFilter, setContractSizeFilter] = useState<string>('ALL');
  const [contractAvailabilityFilter, setContractAvailabilityFilter] = useState<'ALL' | 'READY' | 'BUSY'>('ALL');

  // New Contract form state
  const DRAFT_KEY_CONTRACT = 'thuedo_contract_form_draft';
  const [newContractForm, setNewContractForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('thuedo_contract_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.customerName || parsed.selectedCameraIds?.length)) {
          return parsed;
        }
      }
    } catch {}
    return {
      customerName: '',
      customerPhone: '',
      customerDocType: 'CCCD' as const,
      customerDocNote: '',
      selectedCameraIds: [] as string[],
      printCounts: {} as Record<string, number>,
      startDate: systemDate,
      endDate: systemDate,
      depositAmount: 0,
      paidAmount: 0,
      discountPercent: 0, // Tỷ lệ tự giảm giá (%)
      customFinalPrice: null as number | null,
      fittingNotes: '', // Số đo khách & Ghi chú fitting/sửa gấu/bóp eo
      note: ''
    };
  });

  const [prevCalculatedTotal, setPrevCalculatedTotal] = useState(0);
  const contractDocNoteInputRef = useRef<HTMLInputElement>(null);

  // Auto-save draft form to sessionStorage so switching tabs doesn't lose data
  useEffect(() => {
    if (!showAddModal) return;
    const hasData = newContractForm.customerName || newContractForm.customerPhone || newContractForm.selectedCameraIds.length > 0 || newContractForm.note;
    if (hasData) {
      try { sessionStorage.setItem('thuedo_contract_form_draft', JSON.stringify(newContractForm)); } catch {}
    }
  }, [newContractForm, showAddModal]);

  // Predefined Contract/Rental Form templates (Mẫu đơn thuê thời trang sẵn có)
  const DEFAULT_TEMPLATES: ContractTemplate[] = useMemo(() => [
    {
      id: 'tpl-1',
      templateName: '👰 Combo Váy Cưới Công Chúa VIP (Kèm Voan + Vương Miện)',
      customerName: 'Nguyễn Thị Thu Hà',
      customerPhone: '0982647900',
      customerDocType: 'CCCD_And_1M',
      customerDocNote: 'Giữ CCCD gốc + Cọc bảo đảm 1.000.000đ',
      selectedCameraIds: ['outfit-1', 'outfit-9'], // Váy cưới công chúa + Phụ kiện
      returnTime: '18:00',
      depositAmount: 1000000,
      paidAmountPct: 100,
      paidAmount: 1470000,
      note: 'Thử váy vừa vặn, bóp eo nhẹ 2cm. Kèm voan đội đầu 3m, vương miện đá và túi bảo quản chống bụi.',
      durationDays: 2
    },
    {
      id: 'tpl-2',
      templateName: '🤵 Set Vest Chú Rể Tiệc Cưới Hàn Quốc (2 Ngày)',
      customerName: 'Trần Văn Hoàng (Chú rể)',
      customerPhone: '0912445889',
      customerDocType: 'CCCD',
      customerDocNote: 'Giữ CCCD gốc chính chủ đối chiếu',
      selectedCameraIds: ['outfit-3'], // Vest be sữa Hàn Quốc
      returnTime: '19:00',
      depositAmount: 1000000,
      paidAmountPct: 50,
      paidAmount: 250000,
      note: 'Trọn bộ áo vest + quần tây + cà vạt / nơ cổ chú rể. Giữ form phẳng phiu khi trả đồ.',
      durationDays: 2
    },
    {
      id: 'tpl-3',
      templateName: '🌸 Áo Dài Tơ Tằm Nàng Thơ Chụp Ảnh (1 Ngày)',
      customerName: 'Lê Mai Anh',
      customerPhone: '0978332115',
      customerDocType: 'CCCD',
      customerDocNote: 'Giữ CCCD gốc',
      selectedCameraIds: ['outfit-5'], // Áo dài sen
      returnTime: '18:00',
      depositAmount: 800000,
      paidAmountPct: 100,
      paidAmount: 180000,
      note: 'Thuê chụp ngoại cảnh áo dài hoa sen. Kèm phụ kiện nón lá và mấn đội đầu tơ tằm.',
      durationDays: 1
    },
    {
      id: 'tpl-4',
      templateName: '✨ Đầm Dạ Hội Kim Tuyến Đi Event (Thuê 1 ngày)',
      customerName: 'Đặng Thanh Hằng',
      customerPhone: '0904889922',
      customerDocType: 'CashDeposit',
      customerDocNote: 'Cọc tiền mặt 1.500.000đ hoàn trả khi nhận đồ',
      selectedCameraIds: ['outfit-8'], // Đầm dạ hội
      returnTime: '18:00',
      depositAmount: 1500000,
      paidAmountPct: 100,
      paidAmount: 250000,
      note: 'Khách mặc dự gala tiệc tối. Kiểm tra kỹ tình trạng vải kim tuyến và phụ kiện đi kèm.',
      durationDays: 1
    }
  ], []);

  const [customTemplates, setCustomTemplates] = useState<ContractTemplate[]>(() => 
    loadStoredData('custom_contract_templates', [])
  );

  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);

  const allTemplates = useMemo(() => {
    return [...DEFAULT_TEMPLATES, ...customTemplates];
  }, [DEFAULT_TEMPLATES, customTemplates]);

  const handleApplyTemplate = (tpl: ContractTemplate) => {
    // Determine dynamic rate for the items in the template using the right duration
    const tplDays = tpl.durationDays || 1;
    const dailyTotal = tpl.selectedCameraIds.reduce((sum, id) => {
      const cam = cameras.find(c => c.id === id);
      return sum + (cam ? getCameraRateForDuration(cam, tplDays) : 0);
    }, 0);

    const calculatedTotalRate = dailyTotal * tplDays;
    let computedPaid = tpl.paidAmount;
    if (tpl.paidAmountPct > 0) {
      computedPaid = Math.round(calculatedTotalRate * (tpl.paidAmountPct / 100));
    }

    const calculatedEndDate = () => {
      const d = new Date(systemDate + 'T00:00:00');
      d.setDate(d.getDate() + (tplDays - 1));
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setNewContractForm({
      customerName: tpl.customerName,
      customerPhone: tpl.customerPhone,
      customerDocType: tpl.customerDocType,
      customerDocNote: tpl.customerDocNote,
      selectedCameraIds: tpl.selectedCameraIds.filter(id => cameras.some(c => c.id === id)),
      startDate: systemDate,
      endDate: calculatedEndDate(), 
      depositAmount: tpl.depositAmount,
      paidAmount: computedPaid,
      discountPercent: tpl.discountPercent || 0,
      note: tpl.note
    });

    setCustomAlertMessage(`Đã đặt và áp dụng thành công mẫu đơn hàng: "${tpl.templateName}" vào biểu mẫu nhập hợp đồng!`);
  };

  const handleSaveAsTemplate = () => {
    if (!newContractForm.customerName || newContractForm.selectedCameraIds.length === 0) {
      setCustomAlertMessage('Vui lòng nhập tối thiểu tên khách thuê và chọn ít nhất 1 thiết bị để lưu mẫu đơn thuê!');
      return;
    }

    const nameToUse = newTemplateName.trim() || `Mẫu đơn của ${newContractForm.customerName}`;
    const newTpl: ContractTemplate = {
      id: `tpl-custom-${Date.now()}`,
      templateName: `📝 ${nameToUse}`,
      customerName: newContractForm.customerName,
      customerPhone: newContractForm.customerPhone,
      customerDocType: newContractForm.customerDocType,
      customerDocNote: newContractForm.customerDocNote,
      selectedCameraIds: [...newContractForm.selectedCameraIds],
      returnTime: newContractForm.returnTime,
      depositAmount: newContractForm.depositAmount,
      paidAmountPct: 0,
      paidAmount: newContractForm.paidAmount,
      discountPercent: newContractForm.discountPercent,
      note: newContractForm.note,
      durationDays: calculatedDays
    };

    const updated = [...customTemplates, newTpl];
    setCustomTemplates(updated);
    saveStoredData('custom_contract_templates', updated);
    setNewTemplateName('');
    setShowSaveTemplateForm(false);
    setCustomAlertMessage(`Đã khởi tạo và ghi nhớ mẫu đơn thuê mới thành công: "${nameToUse}"!`);
  };

  const handleDeleteCustomTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    saveStoredData('custom_contract_templates', updated);
  };

  // Filters calculation
  const filteredContracts = useMemo(() => {
    return (contracts || []).filter(c => {
      if (!c) return false;
      const query = searchQuery.trim();
      const matchesSearch = matchContract(c, query).matched;

      let matchesStatus = true;
      if (statusFilter === 'UNPAID_DEPOSIT') {
        const reqDeposit = Math.round((c.totalPrice || 0) * 0.5);
        matchesStatus = c.status === 'Pending' && (c.paidAmount || 0) < reqDeposit;
      } else if (statusFilter === 'UNPAID') {
        const fullTotal = (c.totalPrice || 0) + (c.surchargeAmount || 0);
        matchesStatus = c.status !== 'Cancelled' && (fullTotal - (c.paidAmount || 0) > 0);
      } else if (statusFilter !== 'ALL') {
        matchesStatus = c.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchQuery, statusFilter]);

  // Overall Contract Debt Metrics
  const totalContractDebt = useMemo(() => {
    return (contracts || [])
      .filter(c => c && c.status !== 'Cancelled')
      .reduce((sum, c) => {
        const fullTotal = (c.totalPrice || 0) + (c.surchargeAmount || 0);
        return sum + Math.max(0, fullTotal - (c.paidAmount || 0));
      }, 0);
  }, [contracts]);

  const unpaidContractsCount = useMemo(() => {
    return (contracts || []).filter(c => {
      if (!c || c.status === 'Cancelled') return false;
      const fullTotal = (c.totalPrice || 0) + (c.surchargeAmount || 0);
      return fullTotal > (c.paidAmount || 0);
    }).length;
  }, [contracts]);

  // Pending Deposit (Chỉ tính các đơn Pending CHƯA cọc đủ 50%)
  const pendingDepositContracts = useMemo(() => {
    return (contracts || []).filter(c => {
      if (!c || c.status !== 'Pending') return false;
      const reqDeposit = Math.round((c.totalPrice || 0) * 0.5);
      return (c.paidAmount || 0) < reqDeposit;
    });
  }, [contracts]);

  const pendingDepositTotal = useMemo(() => {
    return pendingDepositContracts.reduce((sum, c) => {
      const reqDeposit = Math.round((c.totalPrice || 0) * 0.5);
      return sum + Math.max(0, reqDeposit - (c.paidAmount || 0));
    }, 0);
  }, [pendingDepositContracts]);

  const pendingContractsCount = pendingDepositContracts.length;

  // Pagination Configuration
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage) || 1;
  
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContracts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContracts, currentPage, itemsPerPage]);

  // Handle building new contract total rate
  const calculatedDays = useMemo(() => {
    if (!newContractForm.startDate || !newContractForm.endDate) return 0;
    const start = new Date(newContractForm.startDate);
    const end = new Date(newContractForm.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [newContractForm.startDate, newContractForm.endDate]);

  const totalBeforeDiscount = useMemo(() => {
    let regularDailyTotal = 0;
    let printerTotal = 0;

    newContractForm.selectedCameraIds.forEach(id => {
      const cam = cameras.find(c => c.id === id);
      if (!cam) return;
      if (cam.category === 'Printer' || cam.isPrinter) {
        const prints = newContractForm.printCounts?.[id] || 5;
        const { totalPrice } = getPrintPrice(cam, prints);
        printerTotal += totalPrice;
      } else {
        regularDailyTotal += getCameraRateForDuration(cam, calculatedDays);
      }
    });

    const camerasCost = regularDailyTotal * calculatedDays;
    return camerasCost + printerTotal;
  }, [newContractForm.selectedCameraIds, newContractForm.printCounts, calculatedDays, cameras]);

  const calculatedTotal = useMemo(() => {
    if (newContractForm.customFinalPrice !== null && newContractForm.customFinalPrice !== undefined) {
      return Math.max(0, newContractForm.customFinalPrice);
    }
    const discountAmount = Math.round(totalBeforeDiscount * ((newContractForm.discountPercent || 0) / 100));
    return Math.max(0, totalBeforeDiscount - discountAmount);
  }, [totalBeforeDiscount, newContractForm.customFinalPrice, newContractForm.discountPercent]);

  const getCameraRecommendedDeposit = (id: string): number => {
    const cam = cameras.find(c => c.id === id);
    if (cam && typeof cam.depositAmount === 'number') {
      return cam.depositAmount;
    }
    return 0;
  };

  const calculatedRecommendedDeposit = useMemo(() => {
    return newContractForm.selectedCameraIds.reduce((sum, id) => sum + getCameraRecommendedDeposit(id), 0);
  }, [newContractForm.selectedCameraIds, cameras]);

  const [prevRecommendedDeposit, setPrevRecommendedDeposit] = useState(0);

  // Auto-fill deposit amount when selecting equipment or switching to CashDeposit
  useEffect(() => {
    if (calculatedRecommendedDeposit !== prevRecommendedDeposit) {
      if (newContractForm.depositAmount === 0 || newContractForm.depositAmount === prevRecommendedDeposit || newContractForm.customerDocType === 'CashDeposit') {
        setNewContractForm(prev => ({
          ...prev,
          depositAmount: calculatedRecommendedDeposit
        }));
      }
      setPrevRecommendedDeposit(calculatedRecommendedDeposit);
    }
  }, [calculatedRecommendedDeposit, prevRecommendedDeposit, newContractForm.depositAmount, newContractForm.customerDocType]);

  // Synchronize dynamic reservation deposit tracking
  useEffect(() => {
    if (calculatedTotal !== prevCalculatedTotal) {
      setPrevCalculatedTotal(calculatedTotal);
    }
  }, [calculatedTotal, prevCalculatedTotal]);

  const handleCreateContract = (e?: React.FormEvent, exportReceiptAfterSave = false) => {
    if (e) e.preventDefault();
    if (newContractForm.selectedCameraIds.length === 0) {
      setCustomAlertMessage('Vui lòng chọn ít nhất một trang phục hoặc phụ kiện!');
      return;
    }

    if (newContractForm.endDate < newContractForm.startDate) {
      setCustomAlertMessage('Ngày trả dự kiến không thể nhỏ hơn ngày bàn giao!');
      return;
    }

    const conflict = checkBookingConflict(
      newContractForm.selectedCameraIds,
      newContractForm.startDate,
      newContractForm.endDate,
      false,
      contracts
    );
    if (conflict.hasConflict) {
      setCustomAlertMessage(conflict.message);
      return;
    }

    const items = newContractForm.selectedCameraIds.map(id => {
      const cam = cameras.find(c => c.id === id);
      const isPrinter = cam?.category === 'Printer' || Boolean(cam?.isPrinter);
      const prints = isPrinter ? (newContractForm.printCounts?.[id] || 5) : undefined;
      const rate = isPrinter && cam
        ? getPrintPrice(cam, prints!).totalPrice
        : (cam ? getCameraRateForDuration(cam, calculatedDays) : 0);

      return {
        cameraId: id,
        cameraName: isPrinter ? `${cam?.name || 'Máy in ảnh'} (${prints} tấm)` : (cam?.name || 'Trang phục'),
        dailyRate: rate,
        quantity: 1,
        printCount: prints,
        size: cam?.size,
        color: cam?.color
      };
    });

    const newCode = generateNextContractCode(contracts, newContractForm.startDate);

    const contract: RentalContract = {
      id: `con-${Date.now()}`,
      contractCode: newCode,
      customerId: `cust-${Date.now()}`,
      customerName: newContractForm.customerName,
      customerPhone: newContractForm.customerPhone,
      customerDocType: newContractForm.customerDocType,
      customerDocNote: newContractForm.customerDocNote,
      items,
      startDate: newContractForm.startDate,
      endDate: newContractForm.endDate,
      totalPrice: calculatedTotal,
      discountPercent: newContractForm.discountPercent,
      paidAmount: newContractForm.paidAmount,
      depositAmount: newContractForm.depositAmount,
      status: 'Pending',
      note: newContractForm.note,
      fittingNotes: newContractForm.fittingNotes,
      createdAt: new Date().toISOString()
    };

    onAddContract(contract);
    setShowAddModal(false);
    
    // If user clicked quick invoice export, open the receipt modal right away
    if (exportReceiptAfterSave) {
      setSelectedContract(contract);
    }

    // Reset form and clear draft
    try { sessionStorage.removeItem('thuedo_contract_form_draft'); } catch {}
    setNewContractForm({
      customerName: '',
      customerPhone: '',
      customerDocType: 'CCCD',
      customerDocNote: '',
      selectedCameraIds: [],
      printCounts: {},
      startDate: systemDate,
      endDate: systemDate,
      depositAmount: 0,
      paidAmount: 0,
      discountPercent: 0,
      customFinalPrice: null,
      fittingNotes: '',
      note: ''
    });
  };

  const getStatusBadgeClass = (status: ContractStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Overdue':
        return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case 'Pending': return 'Chờ bàn giao';
      case 'Active': return 'Đang thuê';
      case 'Completed': return 'Đã hoàn thành';
      case 'Overdue': return 'Quá hạn trả';
      case 'Cancelled': return 'Đã hủy đơn';
    }
  };

  // Tính danh sách các mã hợp đồng bị trùng lặp
  const { duplicateCodeSet, duplicateCount } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of contracts) {
      const code = (c.contractCode || '').trim();
      if (code) {
        counts.set(code, (counts.get(code) || 0) + 1);
      }
    }
    const dups = new Set<string>();
    let dupTotal = 0;
    for (const [code, count] of counts.entries()) {
      if (count > 1) {
        dups.add(code);
        dupTotal += (count - 1);
      }
    }
    return { duplicateCodeSet: dups, duplicateCount: dupTotal };
  }, [contracts]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white border border-gray-150 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          <div className="space-y-0.5">
            <h2 className="text-[15px] sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 select-none">
              <FileText className="text-orange-600 w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" /> Quản Lý Đơn Thuê & Hợp Đồng Trang Phục
            </h2>
            <p className="text-[11.5px] sm:text-xs text-gray-500 leading-normal">
              Theo dõi tiến độ đơn thuê váy cưới, vest, áo dài, lưu trữ cọc thế chấp và tình trạng hoàn trả trang phục.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleExportCSV}
              className="bg-slate-50 border border-gray-200 text-gray-700 font-bold px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] flex items-center justify-center gap-1.5 hover:bg-slate-100 hover:text-gray-900 transition-all cursor-pointer shadow-4xs"
              title="Xuất định dạng CSV danh sách đã lọc"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> Xuất bản CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 text-white font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] flex items-center justify-center gap-1.5 hover:bg-orange-700 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Lập hợp đồng
            </button>
          </div>
        </div>

        {/* Banner cảnh báo phát hiện mã hợp đồng trùng lặp */}
        {duplicateCount > 0 && (
          <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-900">
              <div className="p-2 bg-amber-200/80 text-amber-800 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-black text-amber-950 text-xs sm:text-sm">Phát hiện {duplicateCount} hợp đồng đang bị trùng mã!</span>
                <p className="text-amber-800/90 mt-0.5">
                  Các mã trùng: <strong className="font-mono">{Array.from(duplicateCodeSet).slice(0, 3).join(', ')}{duplicateCodeSet.size > 3 ? '...' : ''}</strong>. Bạn có thể bấm chuẩn hóa để tự động đánh lại số thứ tự duy nhất.
                </p>
              </div>
            </div>
            {onFixDuplicateContracts && (
              <button
                type="button"
                onClick={onFixDuplicateContracts}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center"
              >
                <CheckCircle2 className="w-4 h-4" /> Chuẩn hóa mã trùng ngay
              </button>
            )}
          </div>
        )}

        {/* Aggregate Financial Metrics Banner: Dư Nợ & Chưa Thanh Toán Cọc */}
        {(unpaidContractsCount > 0 || pendingContractsCount > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Card 1: Dư Nợ Chưa Thu */}
            {unpaidContractsCount > 0 && (
              <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/90 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-2 shadow-3xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 sm:p-2.5 bg-rose-200/80 text-rose-800 rounded-xl shrink-0">
                    <CreditCard className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-rose-800 uppercase tracking-wider block truncate">Dư Nợ Chưa Thu</span>
                    <span className="font-mono text-base sm:text-lg font-black text-rose-700 block truncate mt-0.5">
                      {totalContractDebt.toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === 'UNPAID' ? 'ALL' : 'UNPAID')}
                  className={`text-[10.5px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 transition cursor-pointer border shadow-3xs whitespace-nowrap ${
                    statusFilter === 'UNPAID'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {statusFilter === 'UNPAID' ? '✓ Đang lọc' : `⚠️ ${unpaidContractsCount} đơn nợ`}
                </button>
              </div>
            )}

            {/* Card 2: Chưa Thanh Toán Tiền Cọc 50% Giữ Đồ */}
            {pendingContractsCount > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/90 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-2 shadow-3xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 sm:p-2.5 bg-amber-200/80 text-amber-800 rounded-xl shrink-0">
                    <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider block truncate">Chưa Cọc 50% Giữ Đồ</span>
                    <span className="font-mono text-base sm:text-lg font-black text-amber-700 block truncate mt-0.5">
                      {pendingDepositTotal.toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === 'UNPAID_DEPOSIT' ? 'ALL' : 'UNPAID_DEPOSIT')}
                  className={`text-[10.5px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 transition cursor-pointer border shadow-3xs whitespace-nowrap ${
                    statusFilter === 'UNPAID_DEPOSIT'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {statusFilter === 'UNPAID_DEPOSIT' ? '✓ Đang lọc' : `⏳ ${pendingContractsCount} đơn chưa cọc`}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo mã HĐ, tên khách hàng, SĐT..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 sm:py-2 text-[11px] sm:text-xs font-normal border border-gray-250 rounded-lg sm:rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-400/80 shadow-3xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-orange-600">
              <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-7.5 pr-6 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium border border-gray-250 rounded-lg sm:rounded-xl bg-gray-50/80 hover:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 cursor-pointer appearance-none truncate shadow-3xs"
              title="Lọc theo trạng thái hợp đồng"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="UNPAID_DEPOSIT">⏳ Chưa cọc 50% ({pendingContractsCount})</option>
              <option value="UNPAID">⚠️ Còn dư nợ ({unpaidContractsCount})</option>
              <option value="Pending">Chờ giao đồ (Pending)</option>
              <option value="Active">Đang cho thuê (Active)</option>
              <option value="Completed">Đã trả đồ (Completed)</option>
              <option value="Overdue">Quá hạn trả (Overdue)</option>
              <option value="Cancelled">Đã hủy bỏ (Cancelled)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400 text-[9px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table/List */}
      <div className="bg-white border border-gray-150/70 rounded-2xl shadow-sm overflow-hidden">
        {/* Mobile View Card List */}
        <div className="block lg:hidden divide-y divide-gray-100 bg-gray-50/50">
          {paginatedContracts.length > 0 ? (
            paginatedContracts.map(c => {
              const duration = Math.max(1, Math.ceil((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
              return (
                <div key={c.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/30 transition bg-white first:rounded-t-2xl last:rounded-b-2xl">
                  {/* Top section: Code & Status */}
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                    <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${duplicateCodeSet.has(c.contractCode) ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-gray-100 text-gray-900 border-gray-200'}`}>
                      {duplicateCodeSet.has(c.contractCode) && <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />}
                      {c.contractCode}
                      {duplicateCodeSet.has(c.contractCode) && <span className="text-[9px] font-bold text-rose-600 uppercase ml-0.5">Trùng</span>}
                    </span>
                    <span className={`inline-block border text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-3xs ${getStatusBadgeClass(c.status)}`}>
                      {getStatusLabel(c.status)}
                    </span>
                  </div>

                  {/* Customer Information with Avatar */}
                  <div className="flex items-start gap-3 pt-0.5">
                    <div className="w-9 h-9 rounded-full bg-orange-100/80 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 border border-orange-200/45 uppercase select-none">
                      {c.customerName.trim().split(' ').pop()?.slice(0, 2) || 'KH'}
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="text-sm font-extrabold text-gray-900">
                        {c.customerName}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5Check">
                        <a href={`tel:${c.customerPhone}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-100/60 rounded-lg text-[11px] text-orange-700 font-mono font-bold transition-all shrink-0">
                          <Phone className="w-3 h-3 text-orange-500 fill-orange-500/10" /> {c.customerPhone}
                        </a>
                        <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded font-bold">
                          {c.customerDocType === 'Other'
                            ? (c.customerDocNote?.trim() || 'Tài sản khác')
                            : `${renderDocTypeLabel(c.customerDocType)}${c.customerDocNote?.trim() && !['Giữ CCCD gốc + 1.000.000đ', 'Giữ CCCD gốc', 'Giữ GPLX gốc', 'Giữ Hộ chiếu gốc', 'Đặt cọc tiền mặt'].includes(c.customerDocNote.trim()) ? ` (${c.customerDocNote.trim()})` : ''}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment list */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">Trang Phục Thuê:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.items.map((i, idx) => {
                        const matchedCam = cameras.find(cam => cam.id === i.cameraId || cam.name.toLowerCase() === i.cameraName.toLowerCase());
                        const displayColor = i.color || matchedCam?.color;
                        const displaySize = i.size || matchedCam?.size;
                        return (
                          <span key={idx} className="bg-orange-50/70 text-orange-700 border border-orange-100 text-[10px] sm:text-xs px-2 py-0.5 rounded-lg font-bold inline-flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-orange-400" /> {i.cameraName}
                            {displaySize && <span className="text-gray-600 font-semibold text-[9px] bg-white/80 px-1 py-0.2 rounded border border-gray-200">Size {displaySize}</span>}
                            {displayColor && <span className="text-rose-600 font-bold text-[9px] bg-rose-50 px-1 py-0.2 rounded border border-rose-200">🎨 {displayColor}</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-150/60 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 font-semibold" />
                      <span>{formatDMY(c.startDate)}{c.startDate === c.endDate ? ' (1 ngày)' : ` đến ${formatDMY(c.endDate)}`}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-1.5 font-medium">
                      <span>Thời hạn thuê:</span>
                      <span className="font-bold text-gray-700">{duration} ngày</span>
                    </div>
                  </div>

                  {/* Pricing details */}
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                    {(() => {
                      const contractSurcharge = c.surchargeAmount || 0;
                      const finalTotal = (c.totalPrice || 0) + contractSurcharge;
                      const remainingDebt = Math.max(0, finalTotal - (c.paidAmount || 0));

                      return (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 font-medium">Tiền thuê đồ:</span>
                            <span className="font-mono font-bold text-gray-900 text-sm flex items-center gap-1.5">
                              {c.discountPercent ? (
                                <span className="text-[9px] font-sans font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 rounded-sm">
                                  -{c.discountPercent}%
                                </span>
                              ) : null}
                              {c.totalPrice.toLocaleString()} đ
                            </span>
                          </div>

                          {contractSurcharge > 0 && (
                            <div className="flex items-center justify-between text-xs bg-amber-50/80 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                              <span className="font-bold truncate max-w-[70%]" title={c.surchargeReason}>
                                ⚡ Phụ thu ({c.surchargeReason || 'Phát sinh'}):
                              </span>
                              <span className="font-mono font-black shrink-0">
                                +{contractSurcharge.toLocaleString()} đ
                              </span>
                            </div>
                          )}

                          {c.status === 'Pending' ? (
                            (c.paidAmount || 0) > 0 ? (
                              (() => {
                                const pct = finalTotal > 0 ? Math.round(((c.paidAmount || 0) / finalTotal) * 100) : 0;
                                return (
                                  <>
                                    <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100">
                                      <span className="text-emerald-700 font-medium">Đã cọc {pct}% giữ đồ:</span>
                                      <span className="font-mono font-bold text-emerald-700">
                                        {c.paidAmount.toLocaleString()} đ
                                      </span>
                                    </div>
                                    <div className="pt-1 select-none flex items-center justify-between gap-2">
                                      <div className="text-[10px] text-gray-400 font-medium">
                                        Cọc thế chấp: <strong className="text-gray-750">{c.depositAmount > 0 ? `${c.depositAmount.toLocaleString()} đ` : 'Không có'}</strong>
                                      </div>
                                      <div>
                                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold shadow-3xs">
                                          ✓ Đã cọc {pct}%
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              <>
                                <div className="flex items-center justify-between text-xs text-amber-850 bg-amber-50/40 px-1 rounded-sm">
                                  <span className="font-medium">Cọc 50% giữ đồ cần đóng:</span>
                                  <span className="font-mono font-bold">
                                    {(Math.round((c.totalPrice || 0) * 0.5)).toLocaleString()} đ
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100">
                                  <span className="text-gray-500 font-medium">Thực tế đã thanh toán:</span>
                                  <span className="font-mono font-bold text-gray-400">
                                    0 đ
                                  </span>
                                </div>
                                <div className="pt-1 select-none flex items-center justify-between gap-2">
                                  <div className="text-[10px] text-gray-400 font-medium">
                                    Cọc thế chấp: <strong className="text-gray-750">{c.depositAmount > 0 ? `${c.depositAmount.toLocaleString()} đ` : 'Không có'}</strong>
                                  </div>
                                  <div>
                                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md font-bold shadow-3xs">
                                      ⏳ Chưa cọc 50%: {(Math.round((c.totalPrice || 0) * 0.5)).toLocaleString()} đ
                                    </span>
                                  </div>
                                </div>
                              </>
                            )
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Đã thanh toán:</span>
                                <span className="font-mono font-bold text-emerald-600">
                                  {c.paidAmount.toLocaleString()} đ
                                </span>
                              </div>
                              {/* Remaining debt & deposit details */}
                              <div className="pt-1 select-none flex items-center justify-between gap-2">
                                <div className="text-[10px] text-gray-400 font-medium">
                                  Cọc thế chấp: <strong className="text-gray-750">{c.depositAmount > 0 ? `${c.depositAmount.toLocaleString()}đ` : 'Không có'}</strong>
                                </div>
                                <div>
                                  {remainingDebt > 0 ? (
                                    <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md font-bold shadow-3xs">
                                      Còn nợ: {remainingDebt.toLocaleString()}đ
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-bold shadow-3xs">
                                      ✓ Đã thanh toán đủ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Ghi chú nhanh (Quick Notes for mobile) */}
                  <div className="pt-1">
                    {editingNoteId === c.id ? (
                      <div className="flex items-center gap-1.5 bg-amber-50/60 p-1.5 rounded-lg border border-amber-200">
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 font-sans font-medium text-gray-800"
                          placeholder="Ghi chú nhanh..."
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveNote(c.id);
                            if (e.key === 'Escape') setEditingNoteId(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote(c.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Lưu"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hủy"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1 group/note">
                        {cleanSystemNote(c.note) ? (
                          <div className="text-xs text-amber-800 bg-amber-50/50 border border-amber-100/80 px-3 py-2 rounded-xl flex items-start justify-between gap-1.5 w-full font-medium leading-relaxed relative pr-8">
                            <span className="break-words">{cleanSystemNote(c.note)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteId(c.id);
                                setNoteDraft(cleanSystemNote(c.note));
                              }}
                              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-orange-600 hover:bg-white rounded-md border border-gray-200 shadow-3xs transition-all cursor-pointer"
                              title="Chỉnh sửa ghi chú"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(c.id);
                              setNoteDraft('');
                            }}
                            className="text-xs text-gray-500 hover:text-orange-600 font-bold flex items-center gap-1 hover:underline transition bg-gray-50/40 hover:bg-orange-50/30 border border-gray-250 border-dashed py-1.5 px-3 rounded-lg cursor-pointer w-full justify-center"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-400" /> Thêm ghi chú nhanh
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedContract(c)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-200 hover:border-orange-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs active:scale-[0.98] h-10"
                    >
                      Xem chi tiết & Xử lý
                    </button>
                    {onDeleteContract && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmId(c.id);
                        }}
                        className="text-red-500 hover:text-white hover:bg-red-500 border border-red-100 hover:border-red-550 w-10 h-10 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center"
                        title="Xóa Hợp Đồng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-405 font-medium italic text-xs bg-white rounded-2xl">
              Không tìm thấy hợp đồng nào đáp ứng điều kiện.
            </div>
          )}
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs select-none uppercase tracking-wider">
                <th className="px-6 py-4">Mã Hợp Đồng</th>
                <th className="px-6 py-4">Khách Hàng</th>
                <th className="px-6 py-4">Trang Phục Thuê</th>
                <th className="px-6 py-4">Thời Gian Thuê</th>
                <th className="px-6 py-4 text-right">Tổng Chi Phí</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedContracts.length > 0 ? (
                paginatedContracts.map(c => {
                  const duration = Math.max(1, Math.ceil((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.contractCode}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-850">{c.customerName}</div>
                        <div className="text-gray-400 font-mono text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" /> {c.customerPhone}
                        </div>
                        
                        {/* Inline Quick Notes (Ghi chú nhanh) */}
                        <div className="mt-2 pt-1.5 border-t border-gray-100/80">
                          {editingNoteId === c.id ? (
                            <div className="flex items-center gap-1 max-w-[210px] bg-amber-50/60 p-1 rounded-lg border border-amber-200">
                              <input
                                type="text"
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                className="w-full text-xs px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-hidden focus:border-orange-500 font-sans font-medium text-gray-800"
                                placeholder="Ghi chú nhanh..."
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveNote(c.id);
                                  if (e.key === 'Escape') setEditingNoteId(null);
                                }}
                              />
                              <button
                                onClick={() => handleSaveNote(c.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                                title="Lưu"
                              >
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Hủy"
                              >
                                <X className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1 group/note max-w-[215px]">
                              {cleanSystemNote(c.note) ? (
                                <div className="text-xs text-amber-800 bg-amber-50/70 border border-amber-100/90 px-2 py-1 rounded-lg flex items-start justify-between gap-1 w-full font-medium leading-normal relative pr-6">
                                  <span className="break-all" title={cleanSystemNote(c.note)}>{cleanSystemNote(c.note)}</span>
                                  <button
                                    onClick={() => {
                                      setEditingNoteId(c.id);
                                      setNoteDraft(cleanSystemNote(c.note));
                                    }}
                                    className="absolute right-1 top-1 p-0.5 text-gray-400 hover:text-orange-600 hover:bg-white rounded border border-gray-200 shadow-3xs transition-all cursor-pointer opacity-0 group-hover/note:opacity-100"
                                    title="Chỉnh sửa ghi chú"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNoteId(c.id);
                                    setNoteDraft('');
                                  }}
                                  className="text-[10px] text-gray-400 hover:text-orange-600 font-bold flex items-center gap-1 hover:underline transition-colors py-0.5 px-2 rounded-md bg-gray-50/40 hover:bg-orange-50/30 border border-gray-200 border-dashed cursor-pointer"
                                >
                                  <Plus className="w-2.5 h-2.5 text-gray-400" /> Thêm ghi chú nhanh
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[220px] truncate" title={c.items.map(i => i.cameraName).join(', ')}>
                          {c.items.map((i, idx) => {
                            const matchedCam = cameras.find(cam => cam.id === i.cameraId || cam.name.toLowerCase() === i.cameraName.toLowerCase());
                            const displayColor = i.color || matchedCam?.color;
                            return (
                              <span key={idx} className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 text-xs px-2 py-0.5 rounded-md font-medium mr-1 mb-1">
                                <span>{i.cameraName}</span>
                                {displayColor && <span className="text-rose-600 font-bold text-[10px]">🎨 {displayColor}</span>}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700 font-medium">{formatDMY(c.startDate)} đến {formatDMY(c.endDate)}</div>
                        <div className="text-gray-400 text-xs">Thời hạn: <span className="font-bold text-gray-650">{duration} ngày</span></div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.discountPercent ? (
                            <span className="text-[10px] font-sans font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              -{c.discountPercent}%
                            </span>
                          ) : null}
                          <span>{c.totalPrice.toLocaleString()} đ</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-sans font-normal">
                          {c.status === 'Pending' ? (
                            (c.paidAmount || 0) > 0 ? (
                              (() => {
                                const pct = c.totalPrice > 0 ? Math.round(((c.paidAmount || 0) / c.totalPrice) * 100) : 0;
                                return (
                                  <span className="text-emerald-700 font-bold inline-block bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]" title={`Đã nhận ${c.paidAmount.toLocaleString()} đ tiền cọc giữ đồ (${pct}%)`}>
                                    ✓ Đã cọc {pct}%: {c.paidAmount.toLocaleString()} đ
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="text-amber-700 font-bold inline-block bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]" title="Khoản cọc giữ đồ cần chuyển khoản để hoàn thiện duyệt lịch">
                                ⏳ Chưa cọc giữ đồ
                              </span>
                            )
                          ) : (
                            <>
                              Đã thanh toán: <span className="text-emerald-600 font-semibold">{c.paidAmount.toLocaleString()} đ</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block border text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(c.status)}`}>
                          {getStatusLabel(c.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedContract(c)}
                            className="text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-200 hover:border-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Xem chi tiết / Xử lý
                          </button>
                          {onDeleteContract && (
                            <button
                              onClick={() => {
                                setDeleteConfirmId(c.id);
                              }}
                              className="text-red-500 hover:text-white hover:bg-red-500 border border-red-100 hover:border-red-550 p-1.5 rounded-lg transition-all cursor-pointer"
                              title="Xóa Hợp Đồng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-medium italic">
                    Không tìm thấy hợp đồng nào đáp ứng điều kiện.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Contract manager pagination controls */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-150 flex flex-col items-center gap-3 bg-gray-50/60 select-none">
            <span className="text-xs text-gray-500 font-medium text-center">
              Hiển thị từ <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> tới <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredContracts.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredContracts.length}</span> hợp đồng
            </span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    currentPage === page
                      ? 'bg-orange-600 border border-orange-600 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contract Detail & Status Transition Modal */}
      {selectedContract && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 pb-7 sm:p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full overflow-hidden self-center animate-scale-up border border-gray-100 flex flex-col max-h-[88vh] sm:max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-orange-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 flex justify-between items-center shrink-0">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5 truncate">
                  <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">Hợp đồng {selectedContract.contractCode}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 truncate">Lập lúc: {new Date(selectedContract.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-white hover:text-gray-200 text-xl sm:text-2xl font-bold p-1.5 cursor-pointer leading-none shrink-0"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div 
              className="p-3 sm:p-4 space-y-3.5 flex-1 overflow-y-auto overscroll-contain modal-scrollable"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              {/* Overdue Alert banner */}
              {selectedContract.status === 'Overdue' && (
                <div className="bg-rose-50 border border-rose-200 p-3 sm:p-3.5 rounded-xl flex items-start gap-2 text-rose-800">
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm">Hợp đồng này đang bị QUÁ HẠN TRẢ đồ!</h5>
                    <p className="text-[11px] sm:text-xs mt-1">
                      Hãy gọi điện liên hệ ngay cho khách hàng: <span className="font-bold font-mono text-gray-950 underline">{selectedContract.customerPhone}</span>. Lập biên bản phụ thu nếu đồ trả muộn so với cam kết ban đầu.
                    </p>
                  </div>
                </div>
              )}

              <div id="contract-receipt-capture" className="bg-white p-3 sm:p-4 rounded-2xl space-y-3 font-sans text-gray-900 w-full box-border">
                {/* Visual Invoice Title for image export */}
                <div className="text-center space-y-1 border-b border-gray-200 pb-2.5">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide">
                    HÓA ĐƠN BÀN GIAO & THANH TOÁN
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-[10.5px] sm:text-[11px] text-gray-500 font-mono whitespace-nowrap">
                    <span>Mã HĐ: <strong className="text-orange-600 font-bold">{selectedContract.contractCode}</strong></span>
                    <span className="text-gray-300 font-normal">•</span>
                    <span>Ngày lập: {new Date(selectedContract.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                {/* Section 1: Customer details & Timings in Compact Layout */}
                <div className="bg-slate-50/80 p-2.5 sm:p-3 border border-slate-200/80 rounded-xl" style={{overflow: 'visible'}}>
                  {/* Customer Info, Timing & QR Code Row */}
                  <div className={`flex ${editingCustomer ? 'flex-col sm:flex-row' : 'flex-row'} flex-nowrap gap-2 sm:gap-3 items-start justify-between`}>
                    {/* Customer Info & Rental Timings */}
                    <div className="space-y-1.5 min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">THÔNG TIN KHÁCH THUÊ</h4>
                        {onUpdateContractCustomer && !editingCustomer && !isExporting && (
                          <button
                            type="button"
                            data-no-export="true"
                            onClick={() => {
                              setEditingCustomer(true);
                              setCustomerDraft({
                                name: selectedContract.customerName,
                                phone: selectedContract.customerPhone,
                                docType: selectedContract.customerDocType,
                                docNote: selectedContract.customerDocNote || ''
                              });
                            }}
                            className="no-export-item flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
                            title="Sửa thông tin khách thuê"
                          >
                            <Edit2 className="w-3 h-3" /> Sửa
                          </button>
                        )}
                      </div>

                      {editingCustomer ? (
                        <div className="space-y-2 bg-orange-50/60 border border-orange-200 p-2.5 rounded-xl">
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase block mb-1">Họ tên *</label>
                            <input
                              type="text"
                              value={customerDraft.name}
                              onChange={e => setCustomerDraft(d => ({ ...d, name: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900"
                              placeholder="Nguyễn Văn A"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase block mb-1">Số điện thoại *</label>
                            <input
                              type="tel"
                              value={customerDraft.phone}
                              onChange={e => setCustomerDraft(d => ({ ...d, phone: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900"
                              placeholder="09xxxxxxxx"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase block mb-1">Loại thế chấp</label>
                            <select
                              value={customerDraft.docType}
                              onChange={e => setCustomerDraft(d => ({ ...d, docType: e.target.value as RentalContract['customerDocType'] }))}
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-800"
                            >
                              <option value="CCCD">Giữ căn cước (CCCD)</option>
                              <option value="CCCD_And_1M">Giữ CCCD + 1 triệu</option>
                              <option value="GPLX">Giữ bằng lái (GPLX)</option>
                              <option value="Passport">Giữ hộ chiếu (Passport)</option>
                              <option value="CashDeposit">Đặt cọc tiền mặt</option>
                              <option value="Other">Hình thức khác</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase block mb-1">Mô tả thế chấp</label>
                            <input
                              type="text"
                              value={customerDraft.docNote}
                              onChange={e => setCustomerDraft(d => ({ ...d, docNote: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900"
                              placeholder="VD: CCCD gốc + xe Wave đỏ"
                            />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (!customerDraft.name.trim() || !customerDraft.phone.trim()) {
                                  setCustomAlertMessage('Vui lòng nhập đầy đủ tên và số điện thoại!');
                                  return;
                                }
                                onUpdateContractCustomer!(
                                  selectedContract.id,
                                  customerDraft.name.trim(),
                                  customerDraft.phone.trim(),
                                  customerDraft.docType,
                                  customerDraft.docNote.trim()
                                );
                                setSelectedContract(prev => prev ? {
                                  ...prev,
                                  customerName: customerDraft.name.trim(),
                                  customerPhone: customerDraft.phone.trim(),
                                  customerDocType: customerDraft.docType,
                                  customerDocNote: customerDraft.docNote.trim()
                                } : null);
                                setEditingCustomer(false);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black py-1.5 rounded-lg transition cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCustomer(false)}
                              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div>
                            <p className="font-black text-gray-900 text-sm sm:text-base leading-tight truncate">{selectedContract.customerName}</p>
                            <p className="text-[11px] sm:text-xs text-gray-600 font-mono font-bold mt-0.5">SĐT: {selectedContract.customerPhone}</p>
                          </div>

                          {/* Thế chấp (ngay dưới SĐT) */}
                          <div>
                            <div className="inline-flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-lg text-amber-950 max-w-full">
                              <span className="text-[9.5px] font-extrabold text-amber-800 uppercase shrink-0">Thế chấp:</span>
                              <span className="text-[10.5px] font-bold font-mono text-gray-800 truncate">
                                {selectedContract.customerDocType === 'Other'
                                  ? (selectedContract.customerDocNote?.trim() || 'Tài sản khác')
                                  : `${renderDocTypeLabel(selectedContract.customerDocType)}${
                                      selectedContract.customerDocNote?.trim() && 
                                      !['Giữ CCCD gốc + 1.000.000đ', 'Giữ CCCD gốc', 'Giữ GPLX gốc', 'Giữ Hộ chiếu gốc', 'Đặt cọc tiền mặt'].includes(selectedContract.customerDocNote.trim())
                                        ? ` (${selectedContract.customerDocNote.trim()})`
                                        : ''
                                    }`}
                              </span>
                            </div>
                          </div>

                          {/* Thời hạn thuê lồng ghép gọn gàng */}
                          <div className="bg-white/90 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Bắt đầu:</span>
                              <strong className="font-bold font-mono text-gray-900 whitespace-nowrap">{formatDMY(selectedContract.startDate)}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Hạn trả:</span>
                              <strong className="font-bold font-mono text-orange-600 whitespace-nowrap">{formatDMY(selectedContract.endDate)}</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR Code Block on the Right */}
                    <div 
                      className="shrink-0 flex flex-col items-center bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200/90 w-[114px] sm:w-[126px]" 
                      style={{ borderRadius: '12px', boxShadow: 'none' }}
                    >
                      {/* Header row */}
                      <div className={`w-full flex items-center ${isExporting ? 'justify-center' : 'justify-between'} mb-1 px-0.5`}>
                        <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase text-gray-700 tracking-wider whitespace-nowrap">
                          QR THANH TOÁN
                        </span>
                        {!isExporting && isAdmin && (
                          <button
                            type="button"
                            data-no-export="true"
                            onClick={() => {
                              setBankDraft(bankConfig);
                              setShowBankSettings(true);
                            }}
                            className="text-gray-400 hover:text-orange-600 p-0.5 rounded hover:bg-gray-100 transition shrink-0 cursor-pointer"
                            title="Cài đặt tài khoản ngân hàng"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div 
                        className="w-[82px] h-[82px] sm:w-[94px] sm:h-[94px] bg-white rounded-lg border border-gray-200 flex items-center justify-center p-0.5" 
                        style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: 'none' }}
                      >
                        <QrDisplay
                          customImage={customQrImage}
                          bin={getBankBin(bankConfig.bankId)}
                          accountNo={bankConfig.accountNo}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>

                      {/* Hiển thị số tài khoản và tên tài khoản dưới mã QR */}
                      <div 
                        onClick={() => {
                          if (!isExporting && isAdmin) {
                            setBankDraft(bankConfig);
                            setShowBankSettings(true);
                          }
                        }}
                        className={`w-full mt-1 pt-1 border-t border-dashed border-gray-200 flex flex-col items-center justify-center text-center ${!isExporting && isAdmin ? 'cursor-pointer hover:bg-orange-50/70 p-0.5 rounded-lg transition' : ''}`}
                        title={isAdmin ? "Bấm để cài đặt Số tài khoản & Tên tài khoản" : undefined}
                      >
                        <div className="w-full flex items-center justify-center gap-0.5 flex-wrap leading-tight">
                          <span className="text-[8px] sm:text-[8.5px] font-bold text-gray-400 uppercase tracking-tight">STK:</span>
                          <span 
                            className="text-[9.5px] sm:text-[10.5px] font-black font-mono text-gray-900 tracking-tight select-all break-all"
                            title="Số tài khoản"
                          >
                            {bankConfig.accountNo?.trim() || (isAdmin ? 'Chưa nhập' : '---')}
                          </span>
                        </div>
                        <div className="w-full mt-0.5">
                          <span 
                            className="text-[8px] sm:text-[8.5px] font-extrabold uppercase text-gray-700 tracking-tight leading-tight line-clamp-1 truncate max-w-full block" 
                            title={bankConfig.accountName || 'Tên chủ tài khoản'}
                          >
                            {bankConfig.accountName?.trim() || (isAdmin ? '(Bấm thêm tên)' : '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Items Detail - ONLY item name, no price */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">DANH SÁCH Trang Phục Thuê</h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                    {selectedContract.items.map((i, idx) => {
                      const matchedCam = cameras.find(c => c.id === i.cameraId || c.name.toLowerCase() === i.cameraName.toLowerCase());
                      const displaySize = i.size || matchedCam?.size;
                      const displayColor = i.color || matchedCam?.color;
                      return (
                        <div key={idx} className="p-2.5 px-3.5 flex items-center text-xs sm:text-sm bg-white">
                          <div className="font-bold text-gray-900 truncate flex-1 min-w-0 flex items-center gap-2">
                            {matchedCam?.image ? (
                              <img src={matchedCam.image} alt="" className="w-6 h-7 rounded object-cover border border-gray-200 shrink-0" />
                            ) : (
                              <span className="text-orange-500 text-sm shrink-0">👗</span>
                            )}
                            <span className="truncate">{i.cameraName}</span>
                            {displaySize && (
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0 border border-slate-200">
                                Size {displaySize}
                              </span>
                            )}
                            {displayColor && (
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border border-rose-200">
                                🎨 {displayColor}
                              </span>
                            )}
                            {i.quantity > 1 && (
                              <span className="text-gray-500 font-mono text-[11px] font-medium">({i.quantity} chiếc)</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Surcharge Block */}
                <div className="bg-amber-50/70 border border-amber-250 p-3 sm:p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-amber-900 font-extrabold text-xs flex items-center gap-1">
                        <span>⚡ Phụ thu phát sinh:</span>
                      </span>
                      {selectedContract.surchargeAmount && selectedContract.surchargeAmount > 0 ? (
                        <span className="bg-amber-200 text-amber-950 font-mono font-black text-xs px-2 py-0.5 rounded-md border border-amber-300">
                          +{selectedContract.surchargeAmount.toLocaleString()}đ
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">(Không có phụ thu)</span>
                      )}
                    </div>

                    {!editingSurcharge && !isExporting && (
                      <button
                        type="button"
                        data-no-export="true"
                        onClick={() => {
                          setSurchargeDraft(selectedContract.surchargeAmount || 0);
                          setSurchargeReasonDraft(selectedContract.surchargeReason || '');
                          setEditingSurcharge(true);
                        }}
                        className="text-[11px] font-bold text-amber-800 bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-3xs"
                      >
                        <Edit2 className="w-3 h-3 text-amber-700" />
                        <span>{selectedContract.surchargeAmount ? 'Sửa phụ thu' : '+ Thêm phụ thu'}</span>
                      </button>
                    )}
                  </div>

                  {selectedContract.surchargeReason && !editingSurcharge && (
                    <div className="text-[11px] text-amber-900 bg-white/90 p-2 rounded-lg border border-amber-200/80 font-medium">
                      <span className="font-bold text-gray-500">Lý do: </span>
                      {selectedContract.surchargeReason}
                    </div>
                  )}

                  {editingSurcharge && (
                    <div className="space-y-2 pt-1 border-t border-amber-200/80 animate-fade-in" data-no-export="true">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Số tiền phụ thu (VNĐ):
                        </label>
                        <MoneyInput
                          value={surchargeDraft}
                          onChange={(val) => setSurchargeDraft(val)}
                          placeholder="Nhập số tiền phụ thu (VD: 100.000)"
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Lý do phụ thu (Bấm chọn nhanh hoặc tự gõ):
                        </label>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {[
                            '🧺 Giặt tẩy vết bẩn',
                            '🪡 Sửa rách / May vá',
                            '⏰ Trả trễ hạn',
                            '🎀 Thuê thêm phụ kiện',
                            '⏳ Gia hạn thời gian'
                          ].map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSurchargeReasonDraft(prev => prev ? `${prev}, ${tag}` : tag);
                              }}
                              className="text-[10px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded cursor-pointer transition font-medium active:scale-95 shadow-3xs"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={surchargeReasonDraft}
                          onChange={(e) => setSurchargeReasonDraft(e.target.value)}
                          placeholder="VD: Dính son môi ở cổ áo, trả muộn 3 tiếng..."
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingSurcharge(false)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          Hủy
                        </button>
                        {selectedContract.surchargeAmount ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateContractSurcharge) {
                                onUpdateContractSurcharge(selectedContract.id, 0, '');
                              }
                              const oldSurch = selectedContract.surchargeAmount || 0;
                              const newPaid = Math.max(0, (selectedContract.paidAmount || 0) - oldSurch);
                              setSelectedContract(prev => prev ? ({ ...prev, surchargeAmount: undefined, surchargeReason: undefined, paidAmount: newPaid }) : null);
                              setEditingSurcharge(false);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                          >
                            Xóa phụ thu
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateContractSurcharge) {
                              onUpdateContractSurcharge(selectedContract.id, surchargeDraft, surchargeReasonDraft, true);
                            }
                            const oldSurch = selectedContract.surchargeAmount || 0;
                            const diff = surchargeDraft - oldSurch;
                            const newPaid = Math.max(0, (selectedContract.paidAmount || 0) + diff);
                            setSelectedContract(prev => prev ? ({
                              ...prev,
                              surchargeAmount: surchargeDraft > 0 ? surchargeDraft : undefined,
                              surchargeReason: surchargeReasonDraft?.trim() || undefined,
                              paidAmount: newPaid
                            }) : null);
                            setEditingSurcharge(false);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer shadow-xs active:scale-95"
                        >
                          Lưu phụ thu & Thu tiền
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Summary Block */}
                {(() => {
                  const contractSurcharge = selectedContract.surchargeAmount || 0;
                  const finalTotal = selectedContract.totalPrice + contractSurcharge;
                  const remainingToPay = Math.max(0, finalTotal - selectedContract.paidAmount);

                  return (
                    <div className="bg-gradient-to-br from-orange-50/60 to-amber-50/40 border border-orange-200/80 p-3.5 sm:p-4 rounded-xl space-y-2">
                      {selectedContract.discountPercent ? (
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-gray-600 font-medium">Giảm giá tự động:</span>
                          <span className="font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs shrink-0">-{selectedContract.discountPercent}%</span>
                        </div>
                      ) : null}

                      <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                        <span className="text-gray-700 font-semibold">Tiền thuê trang phục:</span>
                        <span className="font-black text-gray-900 text-sm sm:text-base font-mono shrink-0">{selectedContract.totalPrice.toLocaleString()}đ</span>
                      </div>

                      {contractSurcharge > 0 && (
                        <div className="flex justify-between items-center text-xs sm:text-sm gap-2 text-amber-900 bg-amber-100/70 px-2 py-1 rounded-lg border border-amber-250">
                          <span className="font-bold flex items-center gap-1">
                            <span>⚡ Phụ thu ({selectedContract.surchargeReason || 'Phát sinh'}):</span>
                          </span>
                          <span className="font-black font-mono shrink-0">+{contractSurcharge.toLocaleString()}đ</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/80 pt-1.5 font-bold text-gray-900 gap-2">
                        <span>Tổng tiền hợp đồng:</span>
                        <span className="text-base sm:text-lg font-black text-orange-600 font-mono shrink-0">{finalTotal.toLocaleString()}đ</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/60 pt-1.5 text-gray-700 gap-2">
                        <span>Trị giá cọc thế chấp (VNĐ cọc):</span>
                        <span className="font-bold text-gray-800 font-mono shrink-0">{selectedContract.depositAmount.toLocaleString()}đ</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/60 pt-1.5 text-gray-700 gap-2">
                        <span>Đã thanh toán / cọc:</span>
                        <span className="font-bold text-emerald-700 font-mono shrink-0">{selectedContract.paidAmount.toLocaleString()}đ</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-300 pt-2 font-bold text-gray-900 gap-2 bg-orange-100/50 p-2 rounded-lg">
                        <span>Còn lại cần thanh toán:</span>
                        <span className={`text-sm sm:text-base font-black font-mono shrink-0 ${remainingToPay > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {remainingToPay > 0 ? `${remainingToPay.toLocaleString()}đ` : '✓ Đã thu đủ 100%'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Contract Note if present */}
                {selectedContract.note && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-[11px] text-amber-950 leading-relaxed text-left">
                    <strong className="text-amber-900 block font-bold mb-0.5">📝 Ghi chú đơn hàng:</strong>
                    <span>{selectedContract.note}</span>
                  </div>
                )}

                {/* Section: Lưu ý & Quy định thuê trang phục (Có thể chỉnh sửa) */}
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-wide">
                      <ShieldAlert className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Lưu ý & Quy định thuê trang phục</span>
                    </div>
                    {!isExporting && (
                      <div>
                        {editingTerms ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setTermsDraft(DEFAULT_RENTAL_TERMS)}
                              className="text-[10px] text-gray-500 hover:text-gray-800 underline cursor-pointer mr-1"
                            >
                              Mặc định
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTerms(false)}
                              className="text-[10.5px] font-bold text-gray-600 bg-gray-200/80 hover:bg-gray-300 px-2 py-0.5 rounded-lg transition cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const trimmed = termsDraft.trim() || DEFAULT_RENTAL_TERMS;
                                setRentalTerms(trimmed);
                                localStorage.setItem('shop_rental_terms', trimmed);
                                setEditingTerms(false);
                              }}
                              className="text-[10.5px] font-bold text-white bg-orange-600 hover:bg-orange-700 px-2.5 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-3xs"
                            >
                              <Save className="w-3 h-3" /> Lưu
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            data-no-export="true"
                            onClick={() => {
                              setTermsDraft(rentalTerms);
                              setEditingTerms(true);
                            }}
                            className="no-export-item flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
                            title="Sửa nội dung lưu ý quy định thuê"
                          >
                            <Edit2 className="w-3 h-3" /> Sửa lưu ý
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {editingTerms ? (
                    <div className="space-y-1.5 pt-1">
                      <textarea
                        value={termsDraft}
                        onChange={e => setTermsDraft(e.target.value)}
                        rows={7}
                        className="w-full border border-orange-300 rounded-lg p-2 text-[11px] font-normal focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900 leading-relaxed"
                        placeholder="Nhập nội dung lưu ý & quy định thuê đồ..."
                      />
                      <p className="text-[10px] text-gray-400 italic">
                        * Nội dung này sẽ được lưu dùng chung cho tất cả các hóa đơn in ra và xuất ảnh.
                      </p>
                    </div>
                  ) : (
                    <div className="text-[10px] sm:text-[10.5px] text-gray-700 space-y-1 leading-relaxed whitespace-pre-line">
                      {rentalTerms}
                    </div>
                  )}
                </div>

              </div>

              {/* Status Update Quick Controls - Centered */}
              <div className="border-t border-gray-150 pt-3.5 space-y-2.5 shrink-0 text-center">
                <h4 className="text-[10px] sm:text-xs uppercase font-extrabold text-gray-400 tracking-wider text-center">
                  VẬN HÀNH TRẠNG THÁI HỢP ĐỒNG & ĐẶT CỌC GIỮ ĐỒ
                </h4>
                
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {selectedContract.status === 'Pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const deposit50 = Math.round(selectedContract.totalPrice * 0.5);
                          onUpdateContractStatus(selectedContract.id, 'Pending', 'Đã nhận đủ 50% tiền cọc giữ đồ chuyển khoản từ khách hàng.', deposit50);
                          setSelectedContract({
                            ...selectedContract,
                            paidAmount: deposit50
                          });
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
                        title="Xác nhận khách đã chuyển khoản 50% tiền cọc"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>✓ Xác nhận ĐÃ thu cọc 50% ({Math.round(selectedContract.totalPrice * 0.5).toLocaleString()}đ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdateContractStatus(selectedContract.id, 'Pending', 'Khách hàng chưa thanh toán tiền cọc 50% để giữ đồ.', 0);
                          setSelectedContract({
                            ...selectedContract,
                            paidAmount: 0
                          });
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-850 border border-amber-300 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                        title="Đánh dấu khách chưa chuyển tiền cọc 50%"
                      >
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>⏳ Đánh dấu CHƯA cọc 50%</span>
                      </button>

                      <button
                        onClick={() => {
                          onUpdateContractStatus(selectedContract.id, 'Active', 'Bàn giao trang phục và chụp ảnh lưu hồ sơ.');
                          setSelectedContract(prev => prev ? ({ ...prev, status: 'Active' }) : null);
                        }}
                        className="bg-blue-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Check className="w-4 h-4 text-white" /> Bàn giao trang phục (Bắt đầu thuê)
                      </button>
                    </>
                  )}

                  {selectedContract.status === 'Active' && (
                    <>
                      <button
                        onClick={() => {
                          const totalWithSurcharge = selectedContract.totalPrice + (selectedContract.surchargeAmount || 0);
                          onUpdateContractStatus(selectedContract.id, 'Completed', 'Trang phục đã được thu hồi đầy đủ, tất toán xong và chuyển sang trạng thái đang giặt hấp.', totalWithSurcharge);
                          setSelectedContract(prev => prev ? ({ ...prev, status: 'Completed', paidAmount: totalWithSurcharge }) : null);
                        }}
                        className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Check className="w-4 h-4 text-white" /> Nhận đồ & Tất toán (Chuyển giặt)
                      </button>
                      <button
                        onClick={() => {
                          onUpdateContractStatus(selectedContract.id, 'Overdue', 'Hợp đồng trễ hạn chưa trả, liên hệ chưa phản hồi.');
                          setSelectedContract(prev => prev ? ({ ...prev, status: 'Overdue' }) : null);
                        }}
                        className="bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-500" /> Báo quá hạn (Overdue)
                      </button>
                    </>
                  )}

                  {selectedContract.status === 'Overdue' && (
                    <button
                      onClick={() => {
                        const totalWithSurcharge = selectedContract.totalPrice + (selectedContract.surchargeAmount || 0);
                        onUpdateContractStatus(selectedContract.id, 'Completed', 'Đã thu hồi trang phục thành công sau thời gian trễ hạn. Thu thêm phụ thu và chuyển giặt.', totalWithSurcharge);
                        setSelectedContract(prev => prev ? ({ ...prev, status: 'Completed', paidAmount: totalWithSurcharge }) : null);
                      }}
                      className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" /> Tất toán nhận lại đồ (Chuyển giặt)
                    </button>
                  )}

                  {selectedContract.status === 'Completed' && (
                    <p className="text-gray-400 text-xs italic flex items-center justify-center gap-2 py-1">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Hợp đồng đã hoàn thành tất toán. Đồ thuê đã chuyển sang trạng thái "🧺 Đang giặt hấp" trong kho.
                    </p>
                  )}

                  {selectedContract.status === 'Cancelled' && (
                    <div className="w-full space-y-2 flex flex-col items-center">
                      <p className="text-gray-500 text-xs italic flex items-center justify-center gap-1.5 py-0.5 font-medium">
                        <X className="w-4 h-4 text-rose-500 shrink-0" /> Hợp đồng này đang ở trạng thái <strong className="text-rose-600">ĐÃ HỦY</strong>.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateContractStatus(selectedContract.id, 'Pending', 'Khách hàng có nhu cầu đặt lại trang phục, đã khôi phục hợp đồng.');
                            setSelectedContract(prev => prev ? ({ ...prev, status: 'Pending' }) : null);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                          title="Khôi phục trạng thái về Chờ nhận đồ"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Khôi phục đặt lịch (Chờ nhận)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateContractStatus(selectedContract.id, 'Active', 'Bàn giao trang phục và chụp ảnh lưu hồ sơ.');
                            setSelectedContract(prev => prev ? ({ ...prev, status: 'Active' }) : null);
                          }}
                          className="bg-blue-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                          title="Bàn giao trang phục và bắt đầu tính thời gian thuê"
                        >
                          <Check className="w-3.5 h-3.5" /> Bàn giao trang phục ngay (Bắt đầu thuê)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Print Simulate buttons - Centered */}
            <div className="bg-gray-50 px-4 sm:px-5 py-3.5 flex flex-wrap gap-2.5 justify-center items-center border-t border-gray-150 shrink-0">
              <button
                type="button"
                className="bg-white hover:bg-gray-100 border border-gray-250 text-gray-750 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-4xs min-h-[38px] whitespace-nowrap"
                onClick={() => handlePrintReceipt('contract-receipt-capture')}
                title="In hóa đơn hợp đồng bản cứng ra máy in"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>In Hóa Đơn (Bản cứng)</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleExportImage('contract-receipt-capture', `${selectedContract.contractCode}_thong_tin_thue.png`)}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-4xs border border-transparent min-h-[38px] whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4" /> {isExporting ? 'Đang tạo...' : 'Xuất ảnh Hợp đồng'}
              </button>

              {selectedContract.status !== 'Cancelled' && selectedContract.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateContractStatus(selectedContract.id, 'Cancelled', 'Khách hàng hủy đặt lịch do thay đổi kế hoạch.');
                    setSelectedContract(prev => prev ? ({ ...prev, status: 'Cancelled' }) : null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-4xs min-h-[38px] whitespace-nowrap"
                  title="Hủy lịch đặt hợp đồng này"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" /> Hủy đặt lịch
                </button>
              )}

              {onDeleteContract && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmId(selectedContract.id);
                  }}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-xl transition-all min-h-[38px] shadow-4xs whitespace-nowrap"
                  title="Xóa vĩnh viễn hợp đồng này"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Xóa Hợp Đồng
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="bg-gray-800 text-white hover:bg-gray-900 border border-transparent font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer text-center min-h-[38px] whitespace-nowrap"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add New Contract Form Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden self-center border border-gray-100 animate-scale-up flex flex-col max-h-[90vh]">
            <div className="bg-orange-600 px-6 py-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" /> Lập Hợp Đồng Thuê Trang Phục Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-gray-200 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form 
              onSubmit={handleCreateContract} 
              className="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain modal-scrollable"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Họ tên khách hàng *</label>
                  {(() => {
                    const query = newContractForm.customerName.trim().toLowerCase();
                    // Build deduplicated list from customers + contracts
                    const allKnown: { name: string; phone: string }[] = [];
                    const seen = new Set<string>();
                    [...customers.map(c => ({ name: c.name, phone: c.phone })),
                     ...contracts.map(c => ({ name: c.customerName, phone: c.customerPhone }))]
                      .forEach(item => {
                        const key = item.phone || item.name;
                        if (!seen.has(key) && item.name) { seen.add(key); allKnown.push(item); }
                      });
                    const nameSuggestions = query.length >= 1
                      ? allKnown.filter(k => k.name.toLowerCase().includes(query) && k.name !== newContractForm.customerName)
                      : [];
                    return (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={newContractForm.customerName}
                            onChange={e => {
                              setHideCustomerSuggestions(false);
                              setNewContractForm({ ...newContractForm, customerName: e.target.value });
                            }}
                            onFocus={() => setHideCustomerSuggestions(false)}
                            onKeyDown={e => {
                              if (e.key === 'Escape') setHideCustomerSuggestions(true);
                            }}
                            className="w-full border border-gray-200 rounded-lg p-2 pr-8 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="Nguyễn Văn A"
                            autoComplete="off"
                          />
                          {newContractForm.customerName && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewContractForm({ ...newContractForm, customerName: '' });
                                setHideCustomerSuggestions(true);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
                              title="Xoá tên"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {nameSuggestions.length > 0 && !hideCustomerSuggestions && (
                          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-orange-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                            <div className="px-3 py-1.5 text-[10px] font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 border-b border-orange-100 flex items-center justify-between">
                              <span className="flex items-center gap-1">👥 Khách cũ gợi ý</span>
                              <button
                                type="button"
                                onMouseDown={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setHideCustomerSuggestions(true);
                                }}
                                className="p-0.5 px-1.5 text-orange-500 hover:text-orange-800 hover:bg-orange-100/80 rounded transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                title="Bỏ qua gợi ý này"
                              >
                                <span className="text-[10px] font-semibold lowercase">bỏ qua</span>
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {nameSuggestions.slice(0, 6).map((sug, i) => (
                              <button
                                key={i}
                                type="button"
                                onMouseDown={e => {
                                  e.preventDefault();
                                  setNewContractForm({ ...newContractForm, customerName: sug.name, customerPhone: sug.phone || newContractForm.customerPhone });
                                  setHideCustomerSuggestions(true);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-orange-50 transition-colors flex items-center justify-between gap-2 cursor-pointer border-b border-gray-100 last:border-0"
                              >
                                <span className="font-semibold text-sm text-gray-850 truncate">{sug.name}</span>
                                {sug.phone && <span className="font-mono text-[11px] text-gray-500 shrink-0">{sug.phone}</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại *</label>
                  {(() => {
                    const phone = newContractForm.customerPhone.trim();
                    const matchedCustomer = phone.length >= 8
                      ? (customers.find(c => c.phone === phone) ||
                         contracts.reduce((found: any, c) => found || (c.customerPhone === phone ? { name: c.customerName } : null), null))
                      : null;
                    return (
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={newContractForm.customerPhone}
                          onChange={e => {
                            const newPhone = e.target.value;
                            const found = newPhone.trim().length >= 8
                              ? (customers.find(c => c.phone === newPhone.trim()) ||
                                 contracts.reduce((f: any, c) => f || (c.customerPhone === newPhone.trim() ? { name: c.customerName } : null), null))
                              : null;
                            if (found && !newContractForm.customerName) {
                              setNewContractForm({ ...newContractForm, customerPhone: newPhone, customerName: found.name });
                            } else {
                              setNewContractForm({ ...newContractForm, customerPhone: newPhone });
                            }
                          }}
                          className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none ${matchedCustomer ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-200'}`}
                          placeholder="0912xxxxxx"
                        />
                        {matchedCustomer && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                            <span>✓</span>
                            <span>Khách cũ: <span className="font-bold">{matchedCustomer.name}</span></span>
                            {newContractForm.customerName !== matchedCustomer.name && (
                              <button
                                type="button"
                                onClick={() => setNewContractForm({ ...newContractForm, customerName: matchedCustomer.name })}
                                className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors"
                              >
                                Điền tên
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Loại cọc thế chấp</label>
                  <select
                    value={newContractForm.customerDocType}
                    onChange={e => {
                      const val = e.target.value as any;
                      const nextData = { ...newContractForm, customerDocType: val };
                      if (val === 'CCCD_And_1M') {
                        nextData.depositAmount = 1000000;
                      } else if (val === 'Other') {
                        nextData.depositAmount = 0;
                        setTimeout(() => {
                          contractDocNoteInputRef.current?.focus();
                        }, 60);
                      } else if (val === 'CashDeposit') {
                        nextData.depositAmount = calculatedRecommendedDeposit > 0 ? calculatedRecommendedDeposit : 1000000;
                      } else {
                        nextData.depositAmount = 0;
                      }
                      // Nếu ô ghi chú trước đó đang mang các câu tự động lặp lại cũ thì xóa sạch
                      if (nextData.customerDocNote === 'Giữ CCCD gốc + 1.000.000đ' || 
                          nextData.customerDocNote === 'Giữ CCCD gốc' || 
                          nextData.customerDocNote === 'Giữ GPLX gốc' || 
                          nextData.customerDocNote === 'Giữ Hộ chiếu gốc' || 
                          nextData.customerDocNote === 'Đặt cọc tiền mặt') {
                        nextData.customerDocNote = '';
                      }
                      setNewContractForm(nextData);
                    }}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-gray-700"
                  >
                    <option value="CCCD">Giữ căn cước (CCCD)</option>
                    <option value="CCCD_And_1M">Giữ căn cước (CCCD) và 1 triệu đồng</option>
                    <option value="GPLX">Giữ bằng lái (GPLX)</option>
                    <option value="Passport">Giữ hộ chiếu (Passport)</option>
                    <option value="CashDeposit">Đặt cọc tiền mặt</option>
                    <option value="Other">Hình thức khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mô tả cọc thế chấp {newContractForm.customerDocType === 'Other' && <span className="text-orange-600 font-bold">* (Viết ghi chú)</span>}
                  </label>
                  <input
                    ref={contractDocNoteInputRef}
                    type="text"
                    value={newContractForm.customerDocNote}
                    onChange={e => setNewContractForm({ ...newContractForm, customerDocNote: e.target.value })}
                    className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                      newContractForm.customerDocType === 'Other' ? 'border-orange-400 bg-orange-50/20' : 'border-gray-200'
                    }`}
                    placeholder={newContractForm.customerDocType === 'Other' ? 'Viết ghi chú thế chấp (VD: Xe máy, cavet, thẻ SV...)' : 'VD: CCCD chính chủ + xe máy Wave đỏ'}
                  />
                </div>
              </div>

              {/* Equipment Multi Check selectors */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800">
                      Chọn trang phục thuê *
                    </span>
                  </div>
                  {newContractForm.selectedCameraIds.length > 0 ? (
                    <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                      Đã chọn: {newContractForm.selectedCameraIds.length} món
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">
                      Chưa chọn trang phục nào
                    </span>
                  )}
                </div>
                {/* Quick Search and Size Filter for Outfits */}
                <div className="space-y-1.5 mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={contractOutfitSearch}
                      onChange={e => setContractOutfitSearch(e.target.value)}
                      placeholder="🔍 Tìm nhanh mẫu đồ, mã số, màu sắc..."
                      className="w-full bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs font-medium"
                    />
                    {contractOutfitSearch && (
                      <button
                        type="button"
                        onClick={() => setContractOutfitSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Row: Size and Availability Filters */}
                  <div className="space-y-1.5 pt-0.5">
                    {/* Size Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                      <span className="text-[10px] font-bold text-gray-500 shrink-0 uppercase tracking-tight">Size:</span>
                      {['ALL', 'S', 'M', 'L', 'XL', 'XXL', 'Freesize'].map(sz => {
                        const isActive = contractSizeFilter === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setContractSizeFilter(sz)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all shrink-0 cursor-pointer ${
                              isActive
                                ? 'bg-orange-600 text-white shadow-2xs'
                                : 'bg-white/90 text-gray-600 hover:bg-orange-100 hover:text-orange-800 border border-orange-200/60'
                            }`}
                          >
                            {sz === 'ALL' ? 'Tất cả' : sz}
                          </button>
                        );
                      })}
                    </div>

                    {/* Availability Status Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                      <span className="text-[10px] font-bold text-gray-500 shrink-0 uppercase tracking-tight">Tình trạng:</span>
                      {[
                        { id: 'ALL', label: 'Tất cả đồ' },
                        { id: 'READY', label: '✓ Chỉ đồ sẵn sàng' },
                        { id: 'BUSY', label: '🧺 Đang giặt / sửa' }
                      ].map(st => {
                        const isActive = contractAvailabilityFilter === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setContractAvailabilityFilter(st.id as any)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all shrink-0 cursor-pointer ${
                              isActive
                                ? (st.id === 'READY' ? 'bg-emerald-600 text-white shadow-2xs' : st.id === 'BUSY' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-700 text-white shadow-2xs')
                                : 'bg-white/90 text-gray-600 hover:bg-orange-100 hover:text-orange-800 border border-orange-200/60'
                            }`}
                          >
                            {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card list */}
                <div className="border border-gray-250 rounded-xl p-2 bg-white shadow-2xs max-h-[220px] overflow-y-auto space-y-1.5">
                  {(() => {
                    const availableOutfits = cameras
                      .filter(cam => {
                        const isLaundry = cam.cleaningStatus === 'Laundry';
                        const isMending = cam.cleaningStatus === 'Mending';
                        const isRented = cam.status === 'Rented';
                        const isMaint = cam.status === 'Maintenance';
                        const isReady = !isLaundry && !isMending && !isRented && !isMaint;

                        if (contractAvailabilityFilter === 'READY' && !isReady) return false;
                        if (contractAvailabilityFilter === 'BUSY' && isReady) return false;

                        if (contractSizeFilter !== 'ALL') {
                          if (contractSizeFilter === 'Freesize') {
                            const isFs = (cam.availableSizes && cam.availableSizes.some(s => /free|fs/i.test(s))) ||
                              (cam.size && /free|fs/i.test(cam.size));
                            if (!isFs) return false;
                          } else {
                            const hasSize = (cam.availableSizes && cam.availableSizes.some(s => s.toUpperCase() === contractSizeFilter.toUpperCase())) ||
                              (cam.size && cam.size.toUpperCase().includes(contractSizeFilter.toUpperCase()));
                            if (!hasSize) return false;
                          }
                        }
                        if (contractOutfitSearch.trim()) {
                          const q = contractOutfitSearch.trim().toLowerCase();
                          const matchName = (cam.name || '').toLowerCase().includes(q);
                          const matchShort = (cam.shortName || '').toLowerCase().includes(q);
                          const matchSerial = (cam.serialNumber || '').toLowerCase().includes(q);
                          const matchColor = (cam.color || '').toLowerCase().includes(q);
                          const matchSize = (cam.size || '').toLowerCase().includes(q);
                          if (!matchName && !matchShort && !matchSerial && !matchColor && !matchSize) return false;
                        }
                        return true;
                      })
                      .sort((a, b) => {
                        const aUnavail = a.cleaningStatus === 'Laundry' || a.cleaningStatus === 'Mending' || a.status === 'Rented' || a.status === 'Maintenance';
                        const bUnavail = b.cleaningStatus === 'Laundry' || b.cleaningStatus === 'Mending' || b.status === 'Rented' || b.status === 'Maintenance';
                        if (aUnavail && !bUnavail) return 1;
                        if (!aUnavail && bUnavail) return -1;
                        return 0;
                      });

                    if (availableOutfits.length === 0) {
                      return (
                        <p className="text-xs text-gray-400 italic text-center py-4">
                          {contractOutfitSearch || contractSizeFilter !== 'ALL' || contractAvailabilityFilter !== 'ALL'
                            ? 'Không tìm thấy trang phục nào phù hợp với bộ lọc.'
                            : 'Hiện không có trang phục khả dụng trong kho.'}
                        </p>
                      );
                    }

                    return availableOutfits.map(cam => {
                      const isSelected = newContractForm.selectedCameraIds.includes(cam.id);
                      const isPrinter = cam.category === 'Printer' || Boolean(cam.isPrinter);
                      const printCount = newContractForm.printCounts?.[cam.id] || 5;
                      const printPricing = isPrinter ? getPrintPrice(cam, printCount) : null;

                      const isCleaningLaundry = cam.cleaningStatus === 'Laundry';
                      const isCleaningMending = cam.cleaningStatus === 'Mending';
                      const isRented = cam.status === 'Rented';
                      const isMaintenance = cam.status === 'Maintenance';
                      const isUnavailable = isCleaningLaundry || isCleaningMending || isRented || isMaintenance;

                      return (
                        <div
                          key={cam.id}
                          onClick={() => {
                            if (isUnavailable) {
                              const reasonMsg = isCleaningLaundry
                                ? `Trang phục "${cam.name}" (${cam.serialNumber}) ĐANG GIẶT HẤP, chưa sẵn sàng để tạo hợp đồng thuê mới!`
                                : isCleaningMending
                                ? `Trang phục "${cam.name}" (${cam.serialNumber}) ĐANG MAY SỬA, chưa sẵn sàng để tạo hợp đồng thuê mới!`
                                : isRented
                                ? `Trang phục "${cam.name}" (${cam.serialNumber}) ĐANG CHO THUÊ, chưa trả về cửa hàng!`
                                : `Trang phục "${cam.name}" (${cam.serialNumber}) đang bảo trì, không thể chọn!`;
                              setCustomAlertMessage(reasonMsg);
                              return;
                            }

                            if (isSelected) {
                              setNewContractForm({
                                ...newContractForm,
                                selectedCameraIds: newContractForm.selectedCameraIds.filter(id => id !== cam.id)
                              });
                            } else {
                              setNewContractForm({
                                ...newContractForm,
                                selectedCameraIds: [...newContractForm.selectedCameraIds, cam.id],
                                printCounts: {
                                  ...newContractForm.printCounts,
                                  [cam.id]: newContractForm.printCounts?.[cam.id] || 5
                                }
                              });
                            }
                          }}
                          className={`p-2.5 rounded-xl select-none transition-all duration-150 border ${
                            isUnavailable
                              ? 'bg-gray-100/80 border-gray-250 opacity-65 cursor-not-allowed'
                              : isSelected
                              ? 'bg-orange-50 border-orange-300 shadow-sm cursor-pointer'
                              : 'bg-gray-50/60 border-transparent hover:bg-orange-50/40 hover:border-orange-100 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Custom checkbox */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                              isUnavailable
                                ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isSelected
                                ? 'bg-orange-500 border-orange-500 shadow-sm'
                                : 'border-gray-300 bg-white'
                            }`}>
                              {isUnavailable ? (
                                <span className="text-[10px] font-black text-gray-500">✕</span>
                              ) : isSelected ? (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              ) : null}
                            </div>

                            {/* Outfit thumbnail */}
                            <div style={{ width: '2.5rem', height: '3.25rem' }} className="rounded-lg overflow-hidden bg-slate-100 border border-gray-200 shrink-0 flex items-center justify-center shadow-3xs">
                              {cam.image ? (
                                <img src={cam.image} alt={cam.name} className="w-full h-full object-cover object-top" loading="lazy" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-base">{isPrinter ? '🖨️' : '👗'}</span>
                              )}
                            </div>

                            {/* Outfit info */}
                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                <span className={`text-xs sm:text-sm font-bold truncate ${isUnavailable ? 'text-gray-500' : isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
                                  {cam.name}
                                </span>
                                <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0">
                                  {cam.serialNumber}
                                </span>
                                {cam.size && (
                                  <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0">
                                    Size {cam.size}
                                  </span>
                                )}
                                {cam.color && (
                                  <span className="bg-rose-50 text-rose-700 text-[9px] font-semibold px-1.5 py-0.2 rounded truncate max-w-[90px] shrink-0" title={cam.color}>
                                    🎨 {cam.color}
                                  </span>
                                )}

                                {/* Trạng thái sẵn sàng cho thuê */}
                                {isCleaningLaundry ? (
                                  <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-200 shrink-0 flex items-center gap-0.5 shadow-2xs">
                                    <span>🧺 Đang giặt hấp</span>
                                    <span className="text-red-600 font-bold">(Khóa)</span>
                                  </span>
                                ) : isCleaningMending ? (
                                  <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-300 shrink-0 flex items-center gap-0.5 shadow-2xs">
                                    <span>🪡 Đang sửa đồ</span>
                                    <span className="text-red-600 font-bold">(Khóa)</span>
                                  </span>
                                ) : isRented ? (
                                  <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-purple-200 shrink-0 flex items-center gap-0.5 shadow-2xs">
                                    <span>⏳ Đang cho thuê</span>
                                    <span className="text-red-600 font-bold">(Khóa)</span>
                                  </span>
                                ) : isMaintenance ? (
                                  <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-200 shrink-0">
                                    🛠️ Bảo trì (Khóa)
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                                    ✓ Sẵn sàng
                                  </span>
                                )}
                              </div>
                              <span className={`text-[11px] font-extrabold shrink-0 px-2 py-0.5 rounded-full transition-all ${
                                isUnavailable
                                  ? 'bg-gray-200 text-gray-500'
                                  : isSelected
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-orange-50 text-orange-700'
                              }`}>
                                {isPrinter
                                  ? (isSelected
                                      ? `${printPricing?.totalPrice.toLocaleString()}đ (${printCount} tấm)`
                                      : '40k/tấm (từ 33k)'
                                    )
                                  : (calculatedDays > 0
                                      ? `${Math.round(getCameraRateForDuration(cam, calculatedDays, false)).toLocaleString()}đ/ngày`
                                      : `${(cam.price1Day ?? cam.dailyRate).toLocaleString()}đ/ngày`
                                    )
                                }
                              </span>
                            </div>
                          </div>

                          {/* Print count controller when printer is selected */}
                          {isSelected && isPrinter && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="mt-2 pt-2 border-t border-orange-200/80 flex items-center justify-between flex-wrap gap-2 text-xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-gray-700">Số lượng in:</span>
                                <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-3xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = Math.max(1, printCount - 1);
                                      setNewContractForm(prev => ({
                                        ...prev,
                                        printCounts: { ...prev.printCounts, [cam.id]: next }
                                      }));
                                    }}
                                    className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    value={printCount}
                                    onChange={e => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1);
                                      setNewContractForm(prev => ({
                                        ...prev,
                                        printCounts: { ...prev.printCounts, [cam.id]: val }
                                      }));
                                    }}
                                    className="w-12 text-center text-xs font-bold font-mono py-0.5 focus:outline-none border-x border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = printCount + 1;
                                      setNewContractForm(prev => ({
                                        ...prev,
                                        printCounts: { ...prev.printCounts, [cam.id]: next }
                                      }));
                                    }}
                                    className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-[11px] text-gray-500 font-medium">tấm</span>
                              </div>

                              <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                {printPricing?.unitPrice.toLocaleString()}đ/tấm ({printPricing?.tierLabel}) = <strong>{printPricing?.totalPrice.toLocaleString()}đ</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Fitting & Measurement Notes */}
              <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <span>👗 Số đo khách & Yêu cầu chỉnh sửa / Fitting:</span>
                  </label>
                  <span className="text-[10px] text-rose-700 font-semibold">Tùy chọn</span>
                </div>
                <input
                  type="text"
                  value={newContractForm.fittingNotes || ''}
                  onChange={e => setNewContractForm({ ...newContractForm, fittingNotes: e.target.value })}
                  className="w-full bg-white border border-rose-200 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder-gray-400"
                  placeholder="VD: Cao 1m62, nặng 48kg, eo 64cm, bóp eo váy 2cm, kèm nơ cài..."
                />
              </div>

              {/* Khung ngoài thời gian thuê trang phục */}
              <div className="bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-white border-2 border-orange-200/80 rounded-2xl p-3 sm:p-3.5 shadow-xs space-y-2.5 overflow-hidden">
                {/* Header của khung ngoài */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    <span>Thời gian thuê trang phục:</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-orange-700 bg-orange-100/90 px-2.5 py-0.5 rounded-full shadow-3xs">
                    📅 Thuê {calculatedDays > 0 ? calculatedDays : 1} ngày
                  </span>
                </div>

                {/* Chọn ngày bắt đầu và ngày trả */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
                  <div className="w-full min-w-0">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                      Ngày bắt đầu bàn giao *
                    </label>
                    <div className="relative w-full cursor-pointer group">
                      <div className="w-full h-10 bg-white border border-gray-300 group-hover:border-orange-500 rounded-xl px-3 flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-gray-850 tracking-wide truncate">
                            {newContractForm.startDate ? formatDMY(newContractForm.startDate) : 'Chọn ngày'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 group-hover:bg-orange-100 border border-orange-200/80 px-1.5 py-0.5 rounded shrink-0 transition-colors">
                          Đổi
                        </span>
                      </div>
                      <input
                        type="date"
                        required
                        value={newContractForm.startDate}
                        onChange={e => {
                          const d = e.target.value;
                          setNewContractForm(prev => ({
                            ...prev,
                            startDate: d,
                            endDate: prev.endDate < d ? d : prev.endDate
                          }));
                        }}
                        onClick={e => {
                          try {
                            (e.target as HTMLInputElement).showPicker?.();
                          } catch {}
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            try {
                              (e.target as HTMLInputElement).showPicker?.();
                            } catch {}
                          }
                        }}
                        className="date-picker-overlay absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                  <div className="w-full min-w-0">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                      Ngày trả dự kiến *
                    </label>
                    <div className="relative w-full cursor-pointer group">
                      <div className="w-full h-10 bg-white border border-gray-300 group-hover:border-orange-500 rounded-xl px-3 flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-gray-850 tracking-wide truncate">
                            {newContractForm.endDate ? formatDMY(newContractForm.endDate) : 'Chọn ngày'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 group-hover:bg-orange-100 border border-orange-200/80 px-1.5 py-0.5 rounded shrink-0 transition-colors">
                          Đổi
                        </span>
                      </div>
                      <input
                        type="date"
                        required
                        min={newContractForm.startDate}
                        value={newContractForm.endDate}
                        onChange={e => setNewContractForm({ ...newContractForm, endDate: e.target.value })}
                        onClick={e => {
                          try {
                            (e.target as HTMLInputElement).showPicker?.();
                          } catch {}
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            try {
                              (e.target as HTMLInputElement).showPicker?.();
                            } catch {}
                          }
                        }}
                        className="date-picker-overlay absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Money & Deposit section */}
              <div className="bg-amber-50/30 border border-amber-200/60 rounded-2xl p-3 sm:p-3.5 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Cột 1: Cọc thế chấp */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-750">Tiền cọc thế chấp (VND)</label>
                    </div>
                    <MoneyInput
                      value={newContractForm.depositAmount ?? 0}
                      onChange={v => setNewContractForm({ ...newContractForm, depositAmount: v })}
                      placeholder="0"
                      allowZero={true}
                      className="border border-gray-250 bg-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      suffixColor="gray"
                    />
                    {calculatedRecommendedDeposit > 0 && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setNewContractForm({ ...newContractForm, depositAmount: calculatedRecommendedDeposit })}
                          className="text-[11px] text-amber-850 bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          💡 Cọc quy định: {calculatedRecommendedDeposit.toLocaleString()}đ
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cột 2: Cọc giữ đồ trước */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <label className="text-xs font-bold text-gray-750 whitespace-nowrap">Cọc giữ đồ (VND)</label>
                      {newContractForm.paidAmount > 0 && calculatedTotal > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          newContractForm.paidAmount === Math.round(calculatedTotal * 0.5)
                            ? 'bg-amber-200/80 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {newContractForm.paidAmount === Math.round(calculatedTotal * 0.5)
                            ? 'Đúng 50%'
                            : `Cọc ${Math.round((newContractForm.paidAmount / calculatedTotal) * 100)}%`}
                        </span>
                      )}
                    </div>
                    <MoneyInput
                      value={newContractForm.paidAmount || 0}
                      onChange={v => setNewContractForm({ ...newContractForm, paidAmount: v })}
                      placeholder="VD: 500.000"
                      className="border border-gray-250 bg-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      suffixColor="gray"
                    />
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setNewContractForm({ ...newContractForm, paidAmount: Math.round(calculatedTotal * 0.5) })}
                        className={`w-full min-w-0 text-[11px] font-bold py-1 px-1.5 rounded-lg border transition-all cursor-pointer text-center truncate ${
                          newContractForm.paidAmount === Math.round(calculatedTotal * 0.5) && calculatedTotal > 0
                            ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-black'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250'
                        }`}
                        title={`Cọc 50% (${(Math.round(calculatedTotal * 0.5)).toLocaleString()} đ)`}
                      >
                        50% ({(Math.round(calculatedTotal * 0.5)).toLocaleString()}đ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewContractForm({ ...newContractForm, paidAmount: 0 })}
                        className={`w-full min-w-0 text-[11px] font-bold py-1 px-1.5 rounded-lg border transition-all cursor-pointer text-center truncate ${
                          newContractForm.paidAmount === 0
                            ? 'bg-gray-700 border-gray-800 text-white shadow-xs font-black'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250'
                        }`}
                        title="Không thu cọc giữ đồ (0 đ)"
                      >
                        Không cọc (0đ)
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-600 pt-0.5">
                      {newContractForm.paidAmount > 0 ? (
                        <span>
                          {newContractForm.paidAmount === Math.round(calculatedTotal * 0.5) ? (
                            <span className="text-amber-900 font-semibold">✓ Đã cọc 50% ({(newContractForm.paidAmount).toLocaleString()}đ)</span>
                          ) : (
                            <span className="text-blue-800 font-semibold">✓ Cọc {calculatedTotal > 0 ? Math.round((newContractForm.paidAmount / calculatedTotal) * 100) : 0}% ({(newContractForm.paidAmount).toLocaleString()}đ)</span>
                          )}
                          {calculatedTotal > newContractForm.paidAmount && (
                            <span> · Còn thu: <strong className="text-orange-700 font-bold">{(calculatedTotal - newContractForm.paidAmount).toLocaleString()}đ</strong></span>
                          )}
                        </span>
                      ) : (
                        <span>Chưa thu cọc · Còn thu: <strong className="text-orange-700 font-bold">{(calculatedTotal).toLocaleString()}đ</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Discount & Note Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Cột 1: Tự giảm giá cho khách */}
                <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <label className="text-xs font-bold text-gray-800 whitespace-nowrap">Tự giảm giá</label>
                      {newContractForm.discountPercent > 0 && totalBeforeDiscount > 0 ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                          -{(totalBeforeDiscount - calculatedTotal).toLocaleString()}đ (-{newContractForm.discountPercent}%)
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-medium shrink-0">
                          Gốc: {(totalBeforeDiscount || 0).toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-2 items-center">
                      <div className="col-span-2 relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step="any"
                          value={newContractForm.discountPercent || ''}
                          onChange={e => {
                            const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                            const newFinal = Math.round(totalBeforeDiscount * (1 - val / 100));
                            setNewContractForm(prev => ({
                              ...prev,
                              discountPercent: val,
                              customFinalPrice: newFinal
                            }));
                          }}
                          className="w-full bg-white border border-gray-250 rounded-xl py-2 pl-2.5 pr-6 text-sm font-bold font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="0"
                          title="Nhập % giảm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">%</span>
                      </div>
                      <div className="col-span-3">
                        <MoneyInput
                          value={newContractForm.customFinalPrice !== null && newContractForm.customFinalPrice !== undefined ? newContractForm.customFinalPrice : calculatedTotal}
                          onChange={finalPrice => {
                            if (!totalBeforeDiscount || totalBeforeDiscount <= 0) {
                              setNewContractForm(prev => ({ ...prev, discountPercent: 0, customFinalPrice: 0 }));
                              return;
                            }
                            const val = finalPrice ?? 0;
                            let calculatedPct = 0;
                            if (totalBeforeDiscount > 0 && val < totalBeforeDiscount) {
                              const discountAmount = totalBeforeDiscount - val;
                              const rawPct = (discountAmount / totalBeforeDiscount) * 100;
                              calculatedPct = Number(rawPct.toFixed(2));
                            }
                            setNewContractForm(prev => ({
                              ...prev,
                              customFinalPrice: val,
                              discountPercent: calculatedPct
                            }));
                          }}
                          allowZero={true}
                          placeholder="Giá chốt (đ)"
                          className="w-full bg-white border border-gray-250 rounded-xl p-2 text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                      <span>% giảm</span>
                      <span>Giá chốt cuối (đ)</span>
                    </div>
                  </div>

                  {/* 6 nút chọn nhanh trải đều 100% bằng grid grid-cols-6, không bị tràn hay scrollbar */}
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {[0, 5, 10, 15, 20, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          const newFinal = Math.round(totalBeforeDiscount * (1 - pct / 100));
                          setNewContractForm(prev => ({
                            ...prev,
                            discountPercent: pct,
                            customFinalPrice: newFinal
                          }));
                        }}
                        className={`py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer text-center ${
                          newContractForm.discountPercent === pct
                            ? 'bg-orange-500 border-orange-500 text-white shadow-xs font-black'
                            : 'bg-white hover:bg-gray-100 text-gray-650 border-gray-250'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cột 2: Ghi chú đơn hàng */}
                <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between">
                  <label className="text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                    <span>Ghi chú đơn hàng</span>
                    <span className="text-[10px] font-normal text-gray-400">Không bắt buộc</span>
                  </label>
                  <textarea
                    rows={2}
                    value={newContractForm.note}
                    onChange={e => setNewContractForm({ ...newContractForm, note: e.target.value })}
                    className="w-full bg-white border border-gray-250 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none flex-1 min-h-[68px]"
                    placeholder="Ghi chú thêm: giờ lấy đồ, phụ kiện mượn thêm, thỏa thuận giặt hấp riêng..."
                  />
                </div>
              </div>

              {/* Calculated price breakdown card */}
              {calculatedDays > 0 && calculatedTotal > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50/40 border border-orange-100 rounded-xl p-2.5 sm:p-3 text-xs text-orange-850 flex items-center justify-between gap-3 font-medium shadow-2xs">
                  <div className="min-w-0 flex-1 leading-snug">
                    <span className="font-extrabold text-orange-900">Chi tiết tạm tính:</span>{' '}
                    <span>
                      {newContractForm.selectedCameraIds.length} món trang phục &times;{' '}
                      {calculatedDays} ngày
                    </span>
                  </div>
                  <div className="font-mono font-black text-sm sm:text-base text-orange-700 shrink-0 whitespace-nowrap text-right">
                    {calculatedTotal.toLocaleString()}&nbsp;đ
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-650 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-center whitespace-nowrap"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateContract(undefined, true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>Lưu & Xuất hóa đơn</span>
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white font-bold px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm hover:bg-orange-700 transition-all cursor-pointer text-center whitespace-nowrap"
                >
                  Tạo hợp đồng
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-650">
              <span className="p-2 bg-red-50 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </span>
              <h3 className="font-bold text-lg text-gray-900">Xác nhận xóa hợp đồng</h3>
            </div>
            
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa vĩnh viễn hợp đồng này? Hành động này sẽ cập nhật lại trạng thái trang phục và tự động xóa hồ sơ khách hàng tương ứng (nếu khách không còn đơn thuê nào khác).
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-650 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteContract) {
                    onDeleteContract(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                  setSelectedContract(null); // Close detail modal if open
                }}
                className="bg-red-600 text-white font-medium px-5 py-2 rounded-xl text-sm hover:bg-red-700 transition-all cursor-pointer"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Alert Modal */}
      {customAlertMessage && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-up border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-orange-600">
              <span className="p-2 bg-orange-50 rounded-xl">
                <FileText className="w-5 h-5 text-orange-600" />
              </span>
              <h4 className="font-bold text-base text-gray-900">Thông báo hệ thống</h4>
            </div>
            <p className="text-sm text-gray-655 leading-relaxed">{customAlertMessage}</p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCustomAlertMessage(null)}
                className="bg-orange-600 text-white font-medium px-5 py-2 rounded-xl text-sm hover:bg-orange-700 transition-all cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Bank & QR Settings Modal */}
      {showBankSettings && isAdmin && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-up border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-gray-900">Sửa số tài khoản & QR</h3>
                  <p className="text-[11px] text-gray-500">Thông tin nhận chuyển khoản của cửa hàng</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBankSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ngân hàng thụ hưởng</label>
                <select
                  value={bankDraft.bankId}
                  onChange={e => setBankDraft({ ...bankDraft, bankId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-800"
                >
                  {VIET_BANKS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số tài khoản *</label>
                <input
                  type="text"
                  value={bankDraft.accountNo}
                  onChange={e => setBankDraft({ ...bankDraft, accountNo: e.target.value })}
                  placeholder="VD: 0387532321"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tên chủ tài khoản (In hoa không dấu)</label>
                <input
                  type="text"
                  value={bankDraft.accountName}
                  onChange={e => setBankDraft({ ...bankDraft, accountName: e.target.value.toUpperCase() })}
                  placeholder="VD: TIEM ANH NHA CAO"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-gray-900 uppercase"
                />
              </div>

              {/* Tùy chọn ảnh mã QR */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1">Ảnh mã QR tùy chỉnh (tùy chọn)</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{customQrImage ? 'Đổi ảnh QR' : 'Tải lên ảnh QR riêng'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadCustomQr}
                    />
                  </label>
                  {customQrImage && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomQr}
                      className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Dùng lại VietQR tự động
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Mặc định hệ thống tự tạo mã VietQR theo số tài khoản ở trên.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowBankSettings(false)}
                className="flex-1 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!bankDraft.accountNo.trim()) {
                    setCustomAlertMessage('Vui lòng nhập số tài khoản!');
                    return;
                  }
                  handleUpdateBankConfig({
                    ...bankDraft,
                    accountNo: bankDraft.accountNo.trim(),
                    accountName: bankDraft.accountName.trim()
                  });
                  setShowBankSettings(false);
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Lưu số tài khoản
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}



