import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Download, X, Eye, Share2, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import { RentalContract, BankConfig } from '../types';
import { getBankBin, VIET_BANKS, renderDocTypeLabel } from './ContractManager';

interface K57ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: RentalContract | null;
  bankConfig: BankConfig;
  customQrImage?: string;
  shopName?: string;
}

export const K57ReceiptModal: React.FC<K57ReceiptModalProps> = ({
  isOpen,
  onClose,
  contract,
  bankConfig,
  customQrImage,
  shopName
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Auto-detect brand name cleanly without quotes
  const getCleanShopName = (rawName?: string): string => {
    let name = rawName || '';
    if (!name) {
      const fromStorage = localStorage.getItem('logoText');
      if (fromStorage) {
        try {
          const parsed = JSON.parse(fromStorage);
          name = typeof parsed === 'string' ? parsed : fromStorage;
        } catch {
          name = fromStorage;
        }
      }
    }
    name = (name || '').replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, '').trim();
    return (name || 'TIỆM NHÀ CAOS').toUpperCase();
  };

  const effectiveShopName = getCleanShopName(shopName);

  // Detect iOS Safari
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Generate crisp black-and-white QR code data URL
  useEffect(() => {
    if (!contract) return;
    if (customQrImage) {
      setQrDataUrl(customQrImage);
      return;
    }
    const bin = getBankBin(bankConfig.bankId);
    const cleanAccount = (bankConfig.accountNo || '').trim();
    if (!cleanAccount) return;

    // Napas standard QR string
    const f00 = '000201';
    const f01 = '010211';
    const sub00 = '0010A000000727';
    const sub01_sub00 = '0006' + bin;
    const sub01_sub01 = '01' + cleanAccount.length.toString().padStart(2, '0') + cleanAccount;
    const sub01_content = sub01_sub00 + sub01_sub01;
    const sub01 = '01' + sub01_content.length.toString().padStart(2, '0') + sub01_content;
    const sub02 = '0208QRIBFTTA';
    const f38_content = sub00 + sub01 + sub02;
    const f38 = '38' + f38_content.length.toString().padStart(2, '0') + f38_content;
    const f53 = '5303704';
    const f58 = '5802VN';
    const raw = f00 + f01 + f38 + f53 + f58 + '6304';

    // CRC16 Checksum
    let crc = 0xFFFF;
    for (let i = 0; i < raw.length; i++) {
      crc ^= raw.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    const checksum = crc.toString(16).toUpperCase().padStart(4, '0');
    const qrString = raw + checksum;

    QRCode.toDataURL(qrString, {
      margin: 1,
      width: 260,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).then(url => setQrDataUrl(url)).catch(() => {});
  }, [contract, bankConfig, customQrImage]);

  if (!isOpen || !contract || typeof document === 'undefined') return null;

  // Format dates
  const formatDateVN = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const formatDateTimeVN = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${mins} ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const timeRangeText = contract.is6Hours
    ? `6 tiếng: ${contract.startTime || '08:00'} - ${contract.returnTime || '14:00'} (${formatDateVN(contract.startDate)})`
    : `${formatDateVN(contract.startDate)} → ${formatDateVN(contract.endDate)}`;

  const docText = contract.customerDocType === 'Other'
    ? (contract.customerDocNote?.trim() || 'Tài sản khác')
    : `${renderDocTypeLabel(contract.customerDocType)}${
        contract.customerDocNote?.trim() &&
        !['Giữ CCCD gốc + 1.000.000đ', 'Giữ CCCD gốc', 'Giữ GPLX gốc', 'Giữ Hộ chiếu gốc', 'Đặt cọc tiền mặt'].includes(contract.customerDocNote.trim())
          ? ` (${contract.customerDocNote.trim()})`
          : ''
      }`;

  const surcharge = contract.surchargeAmount || 0;
  const finalTotal = contract.totalPrice + surcharge;
  const remaining = Math.max(0, finalTotal - contract.paidAmount);
  const bankName = VIET_BANKS.find(b => b.id === bankConfig.bankId)?.name?.split('(')[0]?.trim() || bankConfig.bankId;

  // Reusable receipt content with 100% INLINE STYLES (never breaks in iframe or PDF)
  const renderReceiptContent = () => (
    <div style={{ fontFamily: '"Courier New", Courier, monospace, sans-serif', fontSize: '11px', lineHeight: '1.4', color: '#000000', boxSizing: 'border-box', width: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
        {effectiveShopName}
      </div>
      <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '10.5px', marginTop: '2px' }}>
        HÓA ĐƠN BÀN GIAO &amp; THANH TOÁN
      </div>

      <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Mã HĐ:</span>
        <span style={{ fontWeight: '700' }}>{contract.contractCode}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: '10px', color: '#374151' }}>
        <span>Ngày lập:</span>
        <span>{formatDateTimeVN(contract.createdAt)}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />

      {/* Customer details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Khách:</span>
        <span style={{ fontWeight: '700', textAlign: 'right' }}>{contract.customerName}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>SĐT:</span>
        <span style={{ fontWeight: '700', textAlign: 'right' }}>{contract.customerPhone}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <span style={{ flexShrink: 0 }}>Thế chấp:</span>
        <span style={{ fontWeight: '700', textAlign: 'right', marginLeft: '8px' }}>{docText}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <span style={{ flexShrink: 0 }}>Thời hạn:</span>
        <span style={{ fontWeight: '700', textAlign: 'right', marginLeft: '8px' }}>{timeRangeText}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />

      {/* Items List - Clothing specific formatting */}
      <div style={{ fontWeight: '700', marginBottom: '4px', textAlign: 'left', width: '100%' }}>DANH SÁCH TRANG PHỤC:</div>
      {contract.items && contract.items.length > 0 ? (
        contract.items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '6px', width: '100%', textAlign: 'left' }}>
            <div style={{ fontWeight: '700', fontSize: '11px' }}>
              {idx + 1}. {item.cameraName}
            </div>
            {(item.size || item.color) && (
              <div style={{ fontSize: '10px', color: '#4b5563', paddingLeft: '8px', marginTop: '1px' }}>
                {item.size && <span>Size: {item.size}</span>}
                {item.size && item.color && <span> • </span>}
                {item.color && <span>Màu: {item.color}</span>}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: '10.5px', color: '#1f2937', paddingLeft: '8px', marginTop: '1px' }}>
              <span>SL: {item.quantity || 1}</span>
              <span style={{ fontWeight: '700' }}>
                {item.dailyRate
                  ? (item.dailyRate * (item.quantity || 1)).toLocaleString('vi-VN') + 'đ'
                  : ''}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div style={{ fontStyle: 'italic', color: '#6b7280' }}>Chưa có trang phục</div>
      )}

      <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />

      {/* Financial Calculation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Tiền thuê trang phục:</span>
        <span>{contract.totalPrice.toLocaleString('vi-VN')}đ</span>
      </div>

      {Boolean(contract.discountPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: '#4b5563' }}>
          <span>Giảm giá:</span>
          <span>-{contract.discountPercent}%</span>
        </div>
      )}

      {Boolean(contract.surchargeAmount) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: '#4b5563' }}>
          <span>Phụ thu:</span>
          <span>+{contract.surchargeAmount?.toLocaleString('vi-VN')}đ</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Cọc thế chấp:</span>
        <span>{(contract.depositAmount || 0).toLocaleString('vi-VN')}đ</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontWeight: '700' }}>
        <span>Đã thanh toán:</span>
        <span>{contract.paidAmount.toLocaleString('vi-VN')}đ</span>
      </div>

      <div style={{ borderTop: '2px solid #000000', margin: '7px 0', width: '100%' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontWeight: '900', fontSize: '11.5px' }}>
        <span>CÒN LẠI CẦN THU:</span>
        <span>
          {remaining > 0 ? `${remaining.toLocaleString('vi-VN')}đ` : '0đ (ĐÃ THU ĐỦ)'}
        </span>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <>
          <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontWeight: '700', fontSize: '9.5px', marginBottom: '2px' }}>QUÉT MÃ VIETQR THANH TOÁN</div>
            <img
              src={qrDataUrl}
              alt="VietQR"
              style={{ width: '125px', height: '125px', margin: '4px auto', display: 'block', border: '1px solid rgba(0,0,0,0.1)' }}
            />
            <div style={{ fontWeight: '700', fontSize: '9.5px', marginTop: '2px' }}>
              {bankConfig.accountNo} • {bankName}
            </div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151', marginTop: '1px' }}>
              {bankConfig.accountName}
            </div>
          </div>
        </>
      )}

      <div style={{ borderTop: '1px dashed #000000', margin: '7px 0', width: '100%' }} />

      {/* Footer Note - No signature section as requested */}
      <div style={{ textAlign: 'center', fontSize: '9.5px', fontStyle: 'italic', color: '#4b5563', width: '100%' }}>
        * Quý khách vui lòng kiểm tra kỹ trang phục khi nhận bàn giao.
        <br />
        Cảm ơn Quý Khách!
      </div>
    </div>
  );

  // Print handler with strict single-page 58mm thermal print styles
  const handlePrint = () => {
    if (!printContainerRef.current) return;

    if (isIOS) {
      window.print();
      return;
    }

    // On PC / Android: print via dedicated hidden iframe with complete standalone CSS
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '58mm';
    iframe.style.height = '100px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const receiptHtml = printContainerRef.current.innerHTML;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Bill K57 - ${contract.contractCode}</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0 !important;
            }
            @media print {
              html, body {
                width: 58mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
            body {
              width: 50mm;
              max-width: 50mm;
              margin: 0 auto;
              padding: 2mm 1.5mm;
              box-sizing: border-box;
              font-family: "Courier New", Courier, monospace, sans-serif;
              font-size: 11px;
              line-height: 1.35;
              color: #000000;
              background: #ffffff;
            }
            * {
              box-sizing: border-box;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          ${receiptHtml}
        </body>
      </html>
    `);
    doc.close();

    const triggerPrint = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print failed, fallback to window.print', e);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    };

    setTimeout(triggerPrint, 300);
  };

  // Exact 1:1 Image Export matching the preview card
  const handleExportImage = async () => {
    const sourceEl = printContainerRef.current;
    if (!sourceEl) return;

    try {
      setIsExporting(true);

      // Clone the live preview element so it matches 100% what the user sees
      const clone = sourceEl.cloneNode(true) as HTMLElement;
      clone.id = 'k57-export-clone';
      clone.style.position = 'fixed';
      clone.style.left = '0px';
      clone.style.top = '0px';
      clone.style.margin = '0px';
      clone.style.width = '320px';
      clone.style.minWidth = '320px';
      clone.style.maxWidth = '320px';
      clone.style.boxSizing = 'border-box';
      clone.style.padding = '18px 16px';
      clone.style.borderRadius = '8px';
      clone.style.border = '1px solid #d1d5db';
      clone.style.boxShadow = 'none';
      clone.style.transform = 'none';
      clone.style.zIndex = '-99999';
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#000000';
      document.body.appendChild(clone);

      // Wait a tick for DOM and fonts to settle
      await new Promise(r => setTimeout(r, 60));

      const targetHeight = clone.scrollHeight || clone.offsetHeight;

      const dataUrl = await toPng(clone, {
        backgroundColor: '#ffffff',
        pixelRatio: isIOS ? 2 : 2.5,
        width: 320,
        height: targetHeight,
        cacheBust: true,
      });

      document.body.removeChild(clone);

      const filename = `Bill_K57_${contract.contractCode}.png`;

      // 1. Try native Web Share API (Safari / iOS / Chrome Mobile)
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], filename, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Hóa đơn K57 ${contract.contractCode}`,
              text: `Hóa đơn bàn giao ${contract.contractCode} - ${contract.customerName}`
            });
            setIsExporting(false);
            return;
          }
        } catch (shareErr) {
          console.log('Share dismissed or unsupported:', shareErr);
        }
      }

      // 2. On PC: download via <a> link
      if (!isIOS) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 3. Always open in-app image preview so iPhone users can touch & hold to save
      setPreviewImageUrl(dataUrl);
    } catch (err) {
      console.error('Lỗi khi xuất ảnh bill K57:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return createPortal(
    <>
      {/* Global Print Styles for iOS Safari AirPrint */}
      <style>{`
        @media print {
          body > *:not(#k57-print-root) {
            display: none !important;
          }
          #k57-print-root {
            display: flex !important;
            justify-content: center !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 58mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          #k57-printable-receipt {
            width: 50mm !important;
            max-width: 50mm !important;
            margin: 0 auto !important;
            padding: 2mm 1.5mm !important;
            box-shadow: none !important;
            border: none !important;
            font-size: 11px !important;
            color: #000000 !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Overlay */}
      <div id="k57-print-root" className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col my-auto border border-gray-200 animate-in fade-in zoom-in-95 duration-150 relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-sm tracking-wide">Hóa Đơn In Khổ K57 (58mm)</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable Preview */}
          <div className="p-4 bg-gray-100 flex flex-col items-center max-h-[75vh] overflow-y-auto">
            <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-1 no-print">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>Xem trước cuộn in nhiệt 58mm (không kèm chữ ký):</span>
            </div>

            {/* Thermal Paper Bill On-Screen Display */}
            <div 
              id="k57-printable-receipt" 
              ref={printContainerRef}
              className="w-[310px] max-w-[310px] bg-white text-black px-4 py-4 shadow-md border border-gray-300 rounded-sm font-mono text-[11px] leading-[1.4] box-border select-none mx-auto"
              style={{ boxSizing: 'border-box' }}
            >
              {renderReceiptContent()}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-wrap gap-2 justify-end items-center no-print">
            <button
              type="button"
              onClick={handleExportImage}
              disabled={isExporting}
              className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isIOS ? <Share2 className="w-3.5 h-3.5 text-orange-600" /> : <Download className="w-3.5 h-3.5 text-orange-600" />}
              <span>{isExporting ? 'Đang tạo...' : isIOS ? 'Chia sẻ / Lưu ảnh' : 'Tải ảnh Bill K57'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In ra máy in (K57)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* In-app Image Preview Popup for iPhone touch & hold to save */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto no-print animate-in fade-in duration-150"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div 
            className="bg-white rounded-2xl p-4 max-w-sm w-full flex flex-col items-center gap-3 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm text-gray-900 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Đã tạo ảnh Bill K57!
              </h4>
              <p className="text-[11px] text-gray-600">
                {isIOS ? '👉 Nhấn giữ vào ảnh bên dưới 1-2 giây rồi chọn "Lưu vào Ảnh" (Save to Photos) hoặc Chia sẻ qua Zalo.' : 'Bạn có thể xem hoặc lưu ảnh bên dưới.'}
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-gray-200 shadow-inner p-2 bg-gray-50 flex justify-center w-full">
              <img 
                src={previewImageUrl} 
                alt="Bill K57" 
                className="max-w-[280px] w-full h-auto rounded shadow-sm select-auto"
                style={{ WebkitTouchCallout: 'default' }}
              />
            </div>

            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              ✕ Đóng ảnh xem trước
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};
