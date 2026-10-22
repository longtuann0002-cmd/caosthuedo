import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, RentalContract, BankConfig, Customer } from '../types';
import MoneyInput from './MoneyInput';
import { DressIcon } from './DressIcon';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera as CameraIcon, AlertTriangle, CheckCircle, Info, Trash2, CreditCard, Settings, Phone, Copy, Sparkles, Clock, User, Filter, Eye, Image as ImageIcon, FileText, Zap, Edit2, X, Save, Check, ShieldAlert, Printer } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getCameraRateForDuration, checkBookingConflict, getPrintPrice } from '../utils/pricing';
import { loadStoredData, saveStoredData } from '../utils/mockData';
import { isSupabaseConfigured, syncToSupabase, fetchFromSupabase } from '../utils/supabase';
import { formatDMY } from '../utils/dateUtils';
import { VIET_BANKS, getBankBin, QrDisplay, DEFAULT_RENTAL_TERMS } from './ContractManager';
import { useScrollLock } from '../utils/useScrollLock';
import { generateNextContractCode } from '../utils/contractUtils';

// 20 fully distinct vivid palettes — ordered so adjacent entries look maximally different
const CAMERA_COLOR_PALETTES = [
  { border: 'border-blue-600',     bgClass: 'bg-blue-200/85 text-blue-950 hover:bg-blue-300/85',         tagColor: 'bg-blue-200 text-blue-900'     }, // 0
  { border: 'border-rose-600',     bgClass: 'bg-rose-200/85 text-rose-950 hover:bg-rose-300/85',         tagColor: 'bg-rose-200 text-rose-900'     }, // 1
  { border: 'border-emerald-600',  bgClass: 'bg-emerald-200/85 text-emerald-950 hover:bg-emerald-300/85',tagColor: 'bg-emerald-200 text-emerald-900'}, // 2
  { border: 'border-amber-600',    bgClass: 'bg-amber-200/85 text-amber-950 hover:bg-amber-300/85',      tagColor: 'bg-amber-200 text-amber-900'   }, // 3
  { border: 'border-purple-600',   bgClass: 'bg-purple-200/85 text-purple-950 hover:bg-purple-300/85',   tagColor: 'bg-purple-200 text-purple-900' }, // 4
  { border: 'border-teal-600',     bgClass: 'bg-teal-200/85 text-teal-950 hover:bg-teal-300/85',         tagColor: 'bg-teal-200 text-teal-900'     }, // 5
  { border: 'border-orange-600',   bgClass: 'bg-orange-200/85 text-orange-950 hover:bg-orange-300/85',   tagColor: 'bg-orange-200 text-orange-900' }, // 6
  { border: 'border-indigo-600',   bgClass: 'bg-indigo-200/85 text-indigo-950 hover:bg-indigo-300/85',   tagColor: 'bg-indigo-200 text-indigo-900' }, // 7
  { border: 'border-pink-600',     bgClass: 'bg-pink-200/85 text-pink-950 hover:bg-pink-300/85',         tagColor: 'bg-pink-200 text-pink-900'     }, // 8
  { border: 'border-cyan-600',     bgClass: 'bg-cyan-200/85 text-cyan-950 hover:bg-cyan-300/85',         tagColor: 'bg-cyan-200 text-cyan-900'     }, // 9
  { border: 'border-red-600',      bgClass: 'bg-red-200/85 text-red-950 hover:bg-red-300/85',            tagColor: 'bg-red-200 text-red-900'       }, // 10
  { border: 'border-lime-600',     bgClass: 'bg-lime-200/85 text-lime-950 hover:bg-lime-300/85',         tagColor: 'bg-lime-200 text-lime-900'     }, // 11
  { border: 'border-fuchsia-600',  bgClass: 'bg-fuchsia-200/85 text-fuchsia-950 hover:bg-fuchsia-300/85',tagColor: 'bg-fuchsia-200 text-fuchsia-900'}, // 12
  { border: 'border-sky-600',      bgClass: 'bg-sky-200/85 text-sky-950 hover:bg-sky-300/85',            tagColor: 'bg-sky-200 text-sky-900'       }, // 13
  { border: 'border-violet-600',   bgClass: 'bg-violet-200/85 text-violet-950 hover:bg-violet-300/85',   tagColor: 'bg-violet-200 text-violet-900' }, // 14
  { border: 'border-green-700',    bgClass: 'bg-green-200/85 text-green-950 hover:bg-green-300/85',      tagColor: 'bg-green-200 text-green-900'   }, // 15
  { border: 'border-yellow-600',   bgClass: 'bg-yellow-200/85 text-yellow-950 hover:bg-yellow-300/85',   tagColor: 'bg-yellow-200 text-yellow-900' }, // 16
  { border: 'border-slate-600',    bgClass: 'bg-slate-200/85 text-slate-950 hover:bg-slate-300/85',      tagColor: 'bg-slate-200 text-slate-900'   }, // 17
  { border: 'border-stone-600',    bgClass: 'bg-stone-200/85 text-stone-950 hover:bg-stone-300/85',      tagColor: 'bg-stone-200 text-stone-900'   }, // 18
  { border: 'border-zinc-600',     bgClass: 'bg-zinc-200/85 text-zinc-950 hover:bg-zinc-300/85',         tagColor: 'bg-zinc-200 text-zinc-900'     }, // 19
];

// Registry: every shortName registered in the app gets a fixed unique palette index.
// When a new camera is added, it auto-assigns the next available index so colors never collide.
const CAMERA_COLOR_REGISTRY: Record<string, number> = {};
let _nextColorIndex = 0;

const getCameraColorProps = (shortName: string) => {
  const key = (shortName || 'CAM').toUpperCase().trim();
  if (CAMERA_COLOR_REGISTRY[key] === undefined) {
    CAMERA_COLOR_REGISTRY[key] = _nextColorIndex % CAMERA_COLOR_PALETTES.length;
    _nextColorIndex++;
  }
  return CAMERA_COLOR_PALETTES[CAMERA_COLOR_REGISTRY[key]];
};

const renderDocTypeLabel = (docType: string) => {
  switch (docType) {
    case 'CCCD': return 'Giữ căn cước (CCCD)';
    case 'CCCD_And_1M': return 'Giữ CCCD + 1 triệu';
    case 'GPLX': return 'Giữ bằng lái (GPLX)';
    case 'Passport': return 'Giữ hộ chiếu (Passport)';
    case 'CashDeposit': return 'Đặt cọc tiền mặt';
    case 'Other': return 'Xe máy / Tài sản khác';
    default: return docType;
  }
};

interface BookingCalendarProps {
  cameras: Camera[];
  contracts: RentalContract[];
  customers?: Customer[];
  onAddContract: (contract: RentalContract) => void;
  onDeleteContract?: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  systemDate: string;
  initialBookingIntent?: {
    startDate?: string;
    endDate?: string;
    selectedCameraIds?: string[];
    is6Hours?: boolean;
    note?: string;
  } | null;
  onClearBookingIntent?: () => void;
}

export default function BookingCalendar({
  cameras,
  contracts,
  customers = [],
  onAddContract,
  onDeleteContract,
  selectedDate,
  setSelectedDate,
  systemDate,
  initialBookingIntent,
  onClearBookingIntent
}: BookingCalendarProps) {
  // Calendar focuses on a target year and month. Initialize to match selectedDate (closest booking on startup)
  const [currentYear, setCurrentYear] = useState<number>(() => {
    const parts = selectedDate.split('-');
    return parts[0] ? parseInt(parts[0]) : 2026;
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const parts = selectedDate.split('-');
    return parts[1] ? parseInt(parts[1]) : 5;
  }); // 1-indexed
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'timeline'>('month');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showAddQuickModal, setShowAddQuickModal] = useState(false);
  const [hideCustomerSuggestions, setHideCustomerSuggestions] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [customAlertMessage, setCustomAlertMessage] = useState<string | null>(null);
  const [selectedCameraFilter, setSelectedCameraFilter] = useState<string>('ALL');
          const [quickOutfitSearch, setQuickOutfitSearch] = useState<string>('');
  const [quickSizeFilter, setQuickSizeFilter] = useState<string>('ALL');
  const [quickAvailabilityFilter, setQuickAvailabilityFilter] = useState<'ALL' | 'READY' | 'BUSY'>('ALL');
  const [mobileDetailDate, setMobileDetailDate] = useState<string | null>(null);

  // Tự động hủy lọc nếu thiết bị đang chọn lọc bị chuyển sang trạng thái bảo trì
  useEffect(() => {
    if (selectedCameraFilter !== 'ALL') {
      const exists = cameras.some(c => c.status !== 'Maintenance' && c.id === selectedCameraFilter);
      if (!exists) {
        setSelectedCameraFilter('ALL');
      }
    }
  }, [cameras, selectedCameraFilter]);

  // Handle booking intent (e.g. from global search modal "+ Đặt lịch")
  useEffect(() => {
    if (!initialBookingIntent) return;
    const sDate = initialBookingIntent.startDate || selectedDate || systemDate;
    const eDate = initialBookingIntent.endDate || sDate;
    
    // Jump calendar view to target date
    if (sDate) {
      setSelectedDate(sDate);
      const parts = sDate.split('-');
      if (parts[0]) setCurrentYear(parseInt(parts[0]));
      if (parts[1]) setCurrentMonth(parseInt(parts[1]));
    }

    setFormData(prev => ({
      ...prev,
      startDate: sDate,
      endDate: eDate,
      selectedCameraIds: initialBookingIntent.selectedCameraIds || [],
      note: initialBookingIntent.note || prev.note || ''
    }));

    setShowAddQuickModal(true);

    if (onClearBookingIntent) {
      onClearBookingIntent();
    }
  }, [initialBookingIntent, selectedDate, systemDate, setSelectedDate, onClearBookingIntent]);

  const goToToday = () => {
    const today = systemDate || new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    const parts = today.split('-');
    setCurrentYear(parseInt(parts[0]));
    setCurrentMonth(parseInt(parts[1]));
  };

  // State for customizable rental terms
  const [rentalTerms, setRentalTerms] = useState<string>(() => {
    return localStorage.getItem('shop_rental_terms') || DEFAULT_RENTAL_TERMS;
  });
  const [editingTerms, setEditingTerms] = useState(false);
  const [termsDraft, setTermsDraft] = useState('');

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

  // Bank Configuration and selection states for Quick-Payment QR Codes
  const [bankConfig, setBankConfig] = useState<BankConfig>(() =>
    loadStoredData('rental_bank_config', {
      bankId: 'MB',
      accountNo: '0387532321',
      accountName: 'TIEM ANH NHA CAO'
    })
  );
  const [showQrForContractCode, setShowQrForContractCode] = useState<string | null>(null);
  const [calendarQrOption, setCalendarQrOption] = useState<'remaining' | 'deposit50' | 'full'>('remaining');

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

  const [showBankSettings, setShowBankSettings] = useState(false);
  const [bankDraft, setBankDraft] = useState<BankConfig>(bankConfig);

  const handleUpdateBankConfig = (newConfig: BankConfig) => {
    setBankConfig(newConfig);
    saveStoredData('rental_bank_config', newConfig);
    if (isSupabaseConfigured) {
      syncToSupabase('rental_bank_config', newConfig);
    }
  };

  const syncBankConfig = () => {
    const freshConfig = loadStoredData('rental_bank_config', {
      bankId: 'MB',
      accountNo: '0387532321',
      accountName: 'TIEM ANH NHA CAO'
    });
    setBankConfig(freshConfig);
  };
  
  // For quick booking form
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerDocType: 'CCCD_And_1M' as const,
    customerDocNote: '',
    selectedCameraIds: [] as string[],
    printCounts: {} as Record<string, number>,
    startDate: '',
    endDate: '',
    depositAmount: 1000000,
    paidAmount: 0,
    discountPercent: 0, // Tỷ lệ tự giảm giá (%)
    customFinalPrice: null as number | null,
    note: '',
  });

  const [prevCalculatedTotal, setPrevCalculatedTotal] = useState(0);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const quickDocNoteInputRef = useRef<HTMLInputElement>(null);

  const calculatedDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [formData.startDate, formData.endDate]);

  const totalBeforeDiscount = useMemo(() => {
    let regularDailyTotal = 0;
    let printerTotal = 0;

    formData.selectedCameraIds.forEach(id => {
      const cam = cameras.find(c => c.id === id);
      if (!cam) return;
      if (cam.category === 'Printer' || cam.isPrinter) {
        const prints = formData.printCounts?.[id] || 5;
        const { totalPrice } = getPrintPrice(cam, prints);
        printerTotal += totalPrice;
      } else {
        regularDailyTotal += getCameraRateForDuration(cam, calculatedDays);
      }
    });

    const camerasCost = regularDailyTotal * calculatedDays;
    return camerasCost + printerTotal;
  }, [formData.selectedCameraIds, formData.printCounts, calculatedDays, cameras]);

  const calculatedTotal = useMemo(() => {
    if (formData.customFinalPrice !== null && formData.customFinalPrice !== undefined) {
      return Math.max(0, formData.customFinalPrice);
    }
    const discountAmount = Math.round(totalBeforeDiscount * ((formData.discountPercent || 0) / 100));
    return Math.max(0, totalBeforeDiscount - discountAmount);
  }, [totalBeforeDiscount, formData.customFinalPrice, formData.discountPercent]);

  const getCameraRecommendedDeposit = (id: string): number => {
    const cam = cameras.find(c => c.id === id);
    if (cam && typeof cam.depositAmount === 'number') {
      return cam.depositAmount;
    }
    return 0;
  };

  const calculatedRecommendedDeposit = useMemo(() => {
    return formData.selectedCameraIds.reduce((sum, id) => sum + getCameraRecommendedDeposit(id), 0);
  }, [formData.selectedCameraIds, cameras]);

  const [prevRecommendedDeposit, setPrevRecommendedDeposit] = useState(0);

  // Auto-fill deposit amount when selecting equipment or switching to CashDeposit
  useEffect(() => {
    if (calculatedRecommendedDeposit !== prevRecommendedDeposit) {
      if (formData.depositAmount === 0 || formData.depositAmount === prevRecommendedDeposit || formData.customerDocType === 'CashDeposit') {
        setFormData(prev => ({
          ...prev,
          depositAmount: calculatedRecommendedDeposit
        }));
      }
      setPrevRecommendedDeposit(calculatedRecommendedDeposit);
    }
  }, [calculatedRecommendedDeposit, prevRecommendedDeposit, formData.depositAmount, formData.customerDocType]);

  // Synchronize dynamic reservation deposit value, defaulting to exactly 50% of calculated total price
  useEffect(() => {
    if (calculatedTotal !== prevCalculatedTotal) {
      const prevHalfPrice = Math.round(prevCalculatedTotal * 0.5);
      if (prevCalculatedTotal === 0 || formData.paidAmount === prevHalfPrice) {
        setFormData(prev => ({
          ...prev,
          paidAmount: Math.round(calculatedTotal * 0.5)
        }));
      }
      setPrevCalculatedTotal(calculatedTotal);
    }
  }, [calculatedTotal, prevCalculatedTotal, formData.paidAmount]);

  // Calculate grid info for the rendered month OR week (T2 đầu tuần, CN cuối tuần)
  const calendarDays = useMemo(() => {
    if (viewMode === 'month') {
      // Get first day of the month (Monday-first: 0 is T2, 1 is T3, ..., 6 is CN)
      const rawFirstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is CN, 1 is T2...
      const firstDayIndex = (rawFirstDayIndex + 6) % 7; // Convert to Monday-first (T2 = 0, ..., CN = 6)
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();

      const days: { day: number; isCurrentMonth: boolean; dateString: string }[] = [];

      // Fill previous month padding days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevDay = prevMonthDays - i;
        const m = currentMonth === 1 ? 12 : currentMonth - 1;
        const y = currentMonth === 1 ? currentYear - 1 : currentYear;
        days.push({
          day: prevDay,
          isCurrentMonth: false,
          dateString: `${y}-${String(m).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`
        });
      }

      // Fill current month days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          day: i,
          isCurrentMonth: true,
          dateString: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
      }

      // Fill next month padding days to round up to multiple of 7 (usually 35 or 42 cells)
      const remainingCells = (7 - (days.length % 7)) % 7;
      for (let i = 1; i <= remainingCells; i++) {
        const m = currentMonth === 12 ? 1 : currentMonth + 1;
        const y = currentMonth === 12 ? currentYear + 1 : currentYear;
        days.push({
          day: i,
          isCurrentMonth: false,
          dateString: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
      }

      return days;
    } else {
      // Weekly view: 7 days starting from Monday (T2) to Sunday (CN) of that week
      const baseDate = new Date(selectedDate);
      const rawDayOfWeek = baseDate.getDay(); // 0 (CN) to 6 (T7)
      const dayOfWeekMondayFirst = (rawDayOfWeek + 6) % 7; // 0 (T2) to 6 (CN)
      const startOfWeek = new Date(baseDate);
      startOfWeek.setDate(baseDate.getDate() - dayOfWeekMondayFirst); // set to T2 (Monday) of the week

      const days: { day: number; isCurrentMonth: boolean; dateString: string }[] = [];
      for (let i = 0; i < 7; i++) {
        const loopDate = new Date(startOfWeek);
        loopDate.setDate(startOfWeek.getDate() + i);
        const y = loopDate.getFullYear();
        const m = loopDate.getMonth() + 1;
        const d = loopDate.getDate();
        days.push({
          day: d,
          isCurrentMonth: m === currentMonth,
          dateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        });
      }
      return days;
    }
  }, [currentYear, currentMonth, viewMode, selectedDate]);

  // Map each calendar day to contracts
  const dayBookingsMap = useMemo(() => {
    const map: Record<string, { contract: RentalContract; cameraId: string; cameraShort: string; cameraName: string; size?: string; timeString: string; printCount?: number; isPrinter?: boolean }[]> = {};

    contracts.forEach(contract => {
      if (contract.status === 'Cancelled') return;
      
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      
      // Loop from start date to end date
      let loopDate = new Date(start);
      while (loopDate <= end) {
        const dateStr = loopDate.toISOString().split('T')[0];
        if (!map[dateStr]) map[dateStr] = [];

        contract.items.forEach(item => {
          const cam = cameras.find(c => c.id === item.cameraId);
          const shortName = cam?.shortName || item.cameraName.substring(0, 5);
          
          // Check if this is a printer device (strict: avoid false positives like "Mini Evo")
          const isPrinter = cam?.category === 'Printer' || 
                            Boolean(cam?.isPrinter) || 
                            (item.printCount !== undefined && item.printCount > 0) ||
                            /^(in\s*film|in\s*ảnh|máy\s*in(\s*ảnh)?)$/i.test(shortName.trim()) ||
                            /máy\s*in(\s*ảnh)?/i.test(item.cameraName || '');

          // Extract print count only if this is legitimately a printer
          let printCount: number | undefined = undefined;
          if (isPrinter) {
            printCount = item.printCount;
            if (!printCount || printCount <= 0) {
              const nameMatch = (item.cameraName || '').match(/(\d+)\s*tấm/i);
              const noteMatch = (contract.note || '').match(/(\d+)\s*tấm/i);
              if (nameMatch) {
                printCount = parseInt(nameMatch[1], 10);
              } else if (noteMatch) {
                printCount = parseInt(noteMatch[1], 10);
              } else if (item.quantity && item.quantity > 1) {
                printCount = item.quantity;
              } else if (item.dailyRate > 0) {
                const rate = item.dailyRate;
                if (rate >= 330000 && rate % 33000 === 0) printCount = rate / 33000;
                else if (rate >= 105000 && rate % 35000 === 0) printCount = rate / 35000;
                else if (rate === 80000) printCount = 2;
                else if (rate === 40000) printCount = 1;
                else if (rate >= 33000) printCount = Math.max(1, Math.round(rate / 35000));
              }
              if (!printCount || printCount <= 0) {
                printCount = 1;
              }
            }
          }

          // Build a dummy time range based on actual items to mimic the exact details from screenshot
          // For May 1: 00:00-00:00 XS10, 00:00-00:00 R50
          // For May 2: 00:00-08:00 XS10, 00:00-08:00 R50
          // For May 3: 06:00-00:00 XS10
          // For May 4: 00:00-06:00 XS10
          // For May 5: 12:00-00:00 R50
          let timeString = '00:00-00:00';
          if (contract.is6Hours) {
            const retTime = contract.returnTime || '18:00';
            let startStr = contract.startTime;
            if (!startStr) {
              const [hBase, mBase] = retTime.split(':');
              const hInt = parseInt(hBase, 10) || 18;
              const startH = Math.max(0, hInt - 6);
              startStr = `${String(startH).padStart(2, '0')}:${mBase || '00'}`;
            }
            timeString = `${startStr}-${retTime}`;
          } else if (dateStr === '2026-05-02') timeString = '00:00-08:00';
          else if (dateStr === '2026-05-03') timeString = '06:00-00:00';
          else if (dateStr === '2026-05-04') timeString = '00:00-06:00';
          else if (dateStr === '2026-05-05') timeString = '12:00-00:00';
          else if (dateStr === '2026-05-14') {
            timeString = shortName === 'R50' ? '00:00-00:00' : '08:00-00:00';
          } else if (dateStr === '2026-05-17') {
            timeString = shortName === 'R50' ? '00:00-00:00' : '00:00-08:00';
          } else if (dateStr === '2026-05-18') {
            timeString = '00:00-12:00';
          } else if (dateStr === '2026-05-19') {
            timeString = '08:00-00:00';
          } else if (dateStr === '2026-05-20') {
            timeString = '00:00-08:00';
          }

          const cleanName = item.cameraName.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || item.cameraName;

          map[dateStr].push({
            contract,
            cameraId: item.cameraId,
            cameraShort: shortName,
            cameraName: item.cameraName,
            cleanName,
            color: item.color || cam?.color || '',
            category: cam?.category || 'Áo dài',
            size: item.size || cam?.size || 'M',
            timeString,
            printCount,
            isPrinter,
          });
        });

        // Advance 1 day
        loopDate.setDate(loopDate.getDate() + 1);
      }
    });

    return map;
  }, [contracts, cameras]);

  const handlePrev = () => {
    if (viewMode === 'month' || viewMode === 'timeline') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      // Go back 7 days from selectedDate
      const base = new Date(selectedDate);
      base.setDate(base.getDate() - 7);
      const dateStr = base.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      const parts = dateStr.split('-');
      setCurrentYear(parseInt(parts[0]));
      setCurrentMonth(parseInt(parts[1]));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month' || viewMode === 'timeline') {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      // Go forward 7 days from selectedDate
      const base = new Date(selectedDate);
      base.setDate(base.getDate() + 7);
      const dateStr = base.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      const parts = dateStr.split('-');
      setCurrentYear(parseInt(parts[0]));
      setCurrentMonth(parseInt(parts[1]));
    }
  };

  const [quickReceiptContract, setQuickReceiptContract] = useState<RentalContract | null>(null);
  const [isExportingReceipt, setIsExportingReceipt] = useState<boolean>(false);

  // Lock body scroll whenever any modal is open to prevent background scrolling on mobile
  useScrollLock(Boolean(showAddQuickModal || quickReceiptContract || deleteConfirmId || customAlertMessage || showBankSettings));

  // Detect iOS / iPhone / iPad Safari
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleExportReceiptImage = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      setCustomAlertMessage('Không tìm thấy dữ liệu để xuất ảnh!');
      return;
    }
    
    setIsExportingReceipt(true);
    setEditingTerms(false);
    // iOS Safari needs extra time to render fonts and external assets
    await new Promise(resolve => setTimeout(resolve, isIOS ? 600 : 250));
    
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
      element.style.marginLeft = prevMarginLeft;
      element.style.marginRight = prevMarginRight;
      element.style.width = prevWidth;
      element.style.minWidth = prevMinWidth;
      element.style.maxWidth = prevMaxWidth;
      setIsExportingReceipt(false);
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
          <title>Hóa đơn ${quickReceiptContract?.contractCode || 'hợp đồng'}</title>
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

  const handleQuickBookingSubmit = (e?: React.FormEvent, exportReceiptAfterSave = false) => {
    if (e) e.preventDefault();
    if (formData.selectedCameraIds.length === 0) {
      setCustomAlertMessage('Vui lòng chọn ít nhất một trang phục!');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setCustomAlertMessage('Vui lòng nhập ngày bắt đầu và ngày kết thúc!');
      return;
    }

    if (formData.endDate < formData.startDate) {
      setCustomAlertMessage('Ngày trả dự kiến không thể nhỏ hơn ngày bắt đầu!');
      return;
    }

    const conflict = checkBookingConflict(
      formData.selectedCameraIds,
      formData.startDate,
      formData.endDate,
      false,
      contracts
    );
    if (conflict.hasConflict) {
      setCustomAlertMessage(conflict.message);
      return;
    }

    const unavailableCam = formData.selectedCameraIds
      .map(id => cameras.find(c => c.id === id))
      .find(c => c && (c.cleaningStatus === 'Laundry' || c.cleaningStatus === 'Mending' || c.status === 'Maintenance'));

    if (unavailableCam) {
      const reason = unavailableCam.cleaningStatus === 'Laundry' 
        ? 'đang giặt hấp' 
        : unavailableCam.cleaningStatus === 'Mending' 
        ? 'đang sửa chữa' 
        : 'đang bảo dưỡng';
      setCustomAlertMessage(`Trang phục "${unavailableCam.name}" (Size ${unavailableCam.size || 'FS'}) ${reason}, không thể tạo đơn thuê!`);
      return;
    }

    const items = formData.selectedCameraIds.map(id => {
      const cam = cameras.find(c => c.id === id);
      const isPrinter = cam?.category === 'Printer' || Boolean(cam?.isPrinter);
      const prints = isPrinter ? (formData.printCounts?.[id] || 5) : undefined;
      const rate = isPrinter && cam
        ? getPrintPrice(cam, prints!).totalPrice
        : (cam ? getCameraRateForDuration(cam, calculatedDays) : 100000);

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

    const totalPrice = calculatedTotal;

    const contractCode = generateNextContractCode(contracts, formData.startDate);

    const newContract: RentalContract = {
      id: `con-${Date.now()}`,
      contractCode,
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerDocType: formData.customerDocType,
      customerDocNote: formData.customerDocNote,
      items,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice,
      discountPercent: formData.discountPercent,
      paidAmount: formData.paidAmount,
      depositAmount: formData.depositAmount,
      status: 'Pending',
      note: formData.note,
      createdAt: new Date().toISOString()
    };

    onAddContract(newContract);
    setShowAddQuickModal(false);

    if (exportReceiptAfterSave) {
      setQuickReceiptContract(newContract);
    }

    // Reset form
    setFormData({
      customerId: '',
      customerName: '',
      customerPhone: '',
      customerDocType: 'CCCD_And_1M',
      customerDocNote: '',
      selectedCameraIds: [],
      startDate: '',
      endDate: '',
      depositAmount: 1000000,
      paidAmount: 0,
      discountPercent: 0,
      customFinalPrice: null,
      note: '',
    });
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const parts = dateStr.split('-');
    setCurrentYear(parseInt(parts[0]));
    setCurrentMonth(parseInt(parts[1]));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
            {/* MAIN FOCUS: Calendar Section (Theo dõi lịch thuê trang phục) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 shadow-sm">
        {/* Calendar Header with Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3.5 mb-3 sm:mb-4 border-b border-gray-100 pb-3.5 sm:pb-4">
          {/* Title & Today on Mobile */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 sm:p-2.5 bg-orange-600 text-white rounded-xl shadow-2xs">
                <CalendarIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight select-none">
                    {viewMode === 'month' 
                      ? `Lịch thuê tháng ${String(currentMonth).padStart(2, '0')}/${currentYear}` 
                      : viewMode === 'timeline'
                      ? `Tiến độ trang phục tháng ${String(currentMonth).padStart(2, '0')}/${currentYear}`
                      : `Lịch thuê trong tuần`}
                  </h2>
                  {selectedCameraFilter !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-300">
                      Đang lọc: {cameras.find(c => c.id === selectedCameraFilter)?.name || cameras.find(c => c.id === selectedCameraFilter)?.shortName || selectedCameraFilter}
                      <button
                        type="button"
                        onClick={() => setSelectedCameraFilter('ALL')}
                        className="ml-0.5 hover:text-red-700 font-bold"
                        title="Bỏ lọc"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-normal hidden sm:block">
                  {viewMode === 'timeline'
                    ? 'Biểu đồ tiến độ chi tiết từng mẫu áo/váy và size theo các ngày trong tháng'
                    : 'Theo dõi lịch nhận đồ, ngày trả và tình trạng trang phục đã đặt'}
                </p>
              </div>
            </div>

            {/* Today Jump Button (Mobile only) */}
            <button
              type="button"
              onClick={goToToday}
              className="lg:hidden px-3 py-1.5 text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-3xs"
              title="Về ngày hôm nay"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Hôm nay</span>
            </button>
          </div>

          {/* Controls: Navigator + Switcher + Quick Filter + Prominent CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Today Jump Button (Desktop) */}
            <button
              type="button"
              onClick={goToToday}
              className="hidden lg:flex px-3 py-2 text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl transition cursor-pointer active:scale-95 items-center gap-1.5 shadow-3xs shrink-0"
              title="Về ngày hôm nay"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Hôm nay</span>
            </button>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              {/* View Switcher: Tháng / Tuần / Tiến độ trang phục */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    viewMode === 'month'
                      ? 'bg-white text-orange-600 shadow-3xs font-black'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    viewMode === 'week'
                      ? 'bg-white text-orange-600 shadow-3xs font-black'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                    viewMode === 'timeline'
                      ? 'bg-white text-orange-600 shadow-3xs font-black'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="Chế độ tiến độ theo từng mẫu đồ (Gantt timeline)"
                >
                  <span>👗 Tiến độ</span>
                </button>
              </div>

              {/* Timeframe Navigator (Prev, Next) */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-gray-50/80 p-0.5 gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 text-gray-650 hover:bg-white hover:text-gray-900 rounded-lg transition-all cursor-pointer shrink-0"
                  title={viewMode === 'week' ? "Tuần trước" : "Tháng trước"}
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                <span className="px-1.5 font-black text-gray-800 text-xs text-center select-none font-mono truncate flex-1 sm:min-w-[80px]">
                  {viewMode === 'week' ? 'Tuần này' : `${String(currentMonth).padStart(2, '0')}/${currentYear}`}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 text-gray-650 hover:bg-white hover:text-gray-900 rounded-lg transition-all cursor-pointer shrink-0"
                  title={viewMode === 'month' ? "Tháng sau" : "Tuần sau"}
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Quick Booking Button */}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  startDate: selectedDate,
                  endDate: selectedDate
                }));
                setShowAddQuickModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-[0.98] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white cursor-pointer uppercase tracking-wider whitespace-nowrap transition-all"
              title="Đặt lịch nhanh"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Đặt lịch nhanh</span>
            </button>
          </div>
        </div>

        {/* Conditional View: Month/Week Calendar Grid OR Outfit Gantt Timeline */}
        {viewMode === 'timeline' ? (
          /* =========================================================================
             CHẾ ĐỘ TIẾN ĐỘ THEO TỪNG MẪU TRANG PHỤC & SIZE (GANTT TIMELINE)
             ========================================================================= */
          <div className="w-full pb-1 overflow-x-auto select-none border border-gray-200/90 rounded-2xl shadow-inner bg-slate-50/50">
            {(() => {
              const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
              const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

              const nonMaintenanceCams = cameras.filter(c => c.status !== 'Maintenance');
              const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Freesize', 'FS'];
              const sortedCams = [...nonMaintenanceCams].sort((a, b) => {
                const nameCompare = (a.name || '').localeCompare(b.name || '');
                if (nameCompare !== 0) return nameCompare;
                const ai = SIZE_ORDER.indexOf(a.size || 'FS');
                const bi = SIZE_ORDER.indexOf(b.size || 'FS');
                return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
              });

              return (
                <div className="min-w-[860px]">
                  {/* Timeline Header Row (Days of Month) */}
                  <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 shadow-xs">
                    <div className="w-48 sm:w-60 p-2.5 font-black text-xs text-gray-750 uppercase tracking-wide border-r border-gray-200 bg-gray-50/90 shrink-0 flex items-center justify-between">
                      <span>Mẫu đồ & Size</span>
                      <span className="text-[10px] text-gray-600 font-bold">({sortedCams.length} món)</span>
                    </div>

                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(26px, 1fr))` }}>
                      {dayNumbers.map(d => {
                        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const dayOfWeek = new Date(currentYear, currentMonth - 1, d).getDay();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const isSelected = selectedDate === dateStr;
                        const isToday = (systemDate || new Date().toISOString().split('T')[0]) === dateStr;

                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleDayClick(dateStr)}
                            className={`p-1 text-center transition-all cursor-pointer border-r border-gray-150/70 last:border-r-0 flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-orange-500 text-white font-black ring-1 ring-orange-500'
                                : isToday
                                ? 'bg-orange-100/90 text-orange-950 font-black'
                                : isWeekend
                                ? 'bg-slate-100/80 text-rose-700 font-bold'
                                : 'hover:bg-orange-50/50 text-gray-700'
                            }`}
                            title={`Ngày ${d}/${currentMonth}. Bấm để chọn ngày.`}
                          >
                            <span className="text-[8px] uppercase tracking-tighter opacity-80">
                              {dayOfWeek === 0 ? 'CN' : `T${dayOfWeek + 1}`}
                            </span>
                            <span className="text-[11px] font-black leading-tight font-mono">
                              {d}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Rows: Each Outfit & Size */}
                  <div className="divide-y divide-gray-150/80 bg-white">
                    {sortedCams.map(cam => {
                      const colors = getCameraColorProps(cam.shortName);
                      const isFilterActive = selectedCameraFilter === cam.id;
                      const baseName = (cam.name || '').replace(/\s*\(Size\s+\S+\)\s*$/i, '').replace(/\s*\(Freesize\)\s*$/i, '').trim();

                      return (
                        <div
                          key={cam.id}
                          className={`flex items-stretch hover:bg-orange-50/30 transition-colors ${
                            isFilterActive ? 'bg-orange-50/60 ring-1 ring-orange-400 inset-0' : ''
                          }`}
                        >
                          {/* Column 1: Outfit Label Info */}
                          <div
                            onClick={() => setSelectedCameraFilter(prev => prev === cam.id ? 'ALL' : cam.id)}
                            className="w-48 sm:w-60 p-2 border-r border-gray-200 shrink-0 flex items-center justify-between gap-1.5 cursor-pointer bg-white group hover:bg-orange-50/40"
                            title={`Bấm để ${isFilterActive ? 'bỏ lọc' : 'lọc'} riêng mẫu này`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 shrink-0">
                                  #{cam.shortName}
                                </span>
                                <span className="text-xs font-black text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                  {baseName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5 text-[9.5px]">
                                <span className="font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                                  Size {cam.size || 'FS'}
                                </span>
                                {cam.color && (
                                  <span className="text-gray-500 truncate" title={cam.color}>
                                    🎨 {cam.color}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              {isFilterActive ? '✓ Đang lọc' : 'Lọc'}
                            </span>
                          </div>

                          {/* Column 2: 31 Day Cells */}
                          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(26px, 1fr))` }}>
                            {dayNumbers.map(d => {
                              const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                              const bookingsOnThisDay = (dayBookingsMap[dateStr] || []).filter(b => b.cameraId === cam.id);
                              const isBooked = bookingsOnThisDay.length > 0;
                              const isSelected = selectedDate === dateStr;
                              const dayOfWeek = new Date(currentYear, currentMonth - 1, d).getDay();
                              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                              return (
                                <div
                                  key={d}
                                  onClick={() => handleDayClick(dateStr)}
                                  onDoubleClick={() => {
                                    if (cam.cleaningStatus === 'Laundry' || cam.cleaningStatus === 'Mending' || cam.status === 'Maintenance') {
                                      const reason = cam.cleaningStatus === 'Laundry' ? 'đang giặt hấp' : cam.cleaningStatus === 'Mending' ? 'đang sửa chữa' : 'đang bảo dưỡng';
                                      setCustomAlertMessage(`Trang phục "${baseName}" (Size ${cam.size || 'FS'}) ${reason}, không thể đặt lịch!`);
                                      return;
                                    }
                                    handleDayClick(dateStr);
                                    setFormData(prev => ({
                                      ...prev,
                                      startDate: dateStr,
                                      endDate: dateStr,
                                      selectedCameraIds: [cam.id]
                                    }));
                                    setShowAddQuickModal(true);
                                  }}
                                  className={`border-r border-gray-150/60 last:border-r-0 p-0.5 flex items-center justify-center transition-all cursor-pointer relative ${
                                    isSelected
                                      ? 'bg-orange-100/50'
                                      : isWeekend && !isBooked
                                      ? 'bg-slate-50/50'
                                      : 'hover:bg-slate-100/60'
                                  }`}
                                  title={
                                    isBooked
                                      ? `${baseName} (Size ${cam.size}): Đã có khách thuê ngày ${d}/${currentMonth} (${bookingsOnThisDay[0]?.contract.customerName})`
                                      : `${baseName} (Size ${cam.size}): Còn trống ngày ${d}/${currentMonth}. Nhấp đúp để tạo đơn ngay.`
                                  }
                                >
                                  {isBooked ? (
                                    <div
                                      className={`w-full h-7 rounded-md border-0 border-l-[3px] ${colors.border} ${colors.bgClass} flex items-center justify-center shadow-3xs px-0.5 text-center transition-all hover:scale-105`}
                                    >
                                      <span className="text-[7.5px] font-black truncate leading-tight">
                                        {bookingsOnThisDay[0]?.contract.customerName?.split(' ').slice(-1)[0] || 'Thuê'}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 opacity-30 hover:opacity-100 hover:scale-125 transition-all inline-block" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* =========================================================================
             CHẾ ĐỘ LỊCH THÁNG / TUẦN (GRID CALENDAR)
             ========================================================================= */
          <div className="w-full pb-1">
            {/* Day Grid Headers: T2 ở đầu, CN ở cuối */}
            <div className="grid grid-cols-7 gap-1 bg-slate-100/70 py-2 px-1 rounded-xl text-center font-black text-gray-600 text-[11px] sm:text-xs tracking-wider mb-2 select-none">
              <div>T2</div>
              <div>T3</div>
              <div>T4</div>
              <div>T5</div>
              <div>T6</div>
              <div>T7</div>
              <div className="text-rose-600 font-black">CN</div>
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map(({ day, isCurrentMonth, dateString }) => {
                const allBookings = dayBookingsMap[dateString] || [];
                const bookings = selectedCameraFilter === 'ALL'
                  ? allBookings
                  : allBookings.filter(b => b.cameraId === selectedCameraFilter);
                
                const bookingCount = bookings.length;
                const isSelected = selectedDate === dateString;
                const isToday = (systemDate || new Date().toISOString().split('T')[0]) === dateString;

                // Determine status and style matching the legend
                let statusStyle = 'bg-white border-gray-200 hover:border-emerald-400';
                if (bookingCount > 0) {
                  const hasFullDayBooking = bookings.some(b => !b.contract.is6Hours);
                  if (bookingCount >= 2 && hasFullDayBooking) {
                    statusStyle = 'bg-rose-50/80 border-rose-300 hover:border-rose-400';
                  } else {
                    statusStyle = 'bg-amber-50/80 border-amber-300 hover:border-amber-400';
                  }
                }

                // Subdued styling if the day belongs to another month
                const monthStyle = isCurrentMonth ? 'text-gray-900' : 'text-gray-300 bg-gray-50/40 border-gray-150';

                return (
                  <div
                    key={dateString}
                    onClick={() => { handleDayClick(dateString); setMobileDetailDate(dateString); }}
                    onDoubleClick={() => {
                      handleDayClick(dateString);
                      setFormData(prev => ({
                        ...prev,
                        startDate: dateString,
                        endDate: dateString
                      }));
                      setShowAddQuickModal(true);
                    }}
                    className={`border rounded-xl p-1 sm:p-2 cursor-pointer transition-all flex flex-col justify-start gap-1 sm:gap-1.5 ${statusStyle} ${monthStyle} ${
                      isSelected ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/30 shadow-xs' : 'hover:shadow-3xs'
                    } ${viewMode === 'week' ? 'min-h-[85px] sm:min-h-[160px]' : 'min-h-[64px] sm:min-h-[96px]'}`}
                    title={`Ngày ${day}/${currentMonth}. Bấm để xem chi tiết, nhấp đúp để đặt lịch nhanh.`}
                  >
                    {/* Cell Header: Day number + count badge */}
                    <div className="flex justify-between items-center pb-0.5 sm:pb-1">
                      <span className={`text-[11px] sm:text-xs font-black inline-flex items-center justify-center ${
                        isToday 
                          ? 'w-5 h-5 rounded-full bg-orange-600 text-white shadow-3xs' 
                          : (isCurrentMonth ? (isSelected ? 'text-orange-700' : 'text-gray-800') : 'text-gray-400')
                      }`}>
                        {day}
                      </span>
                      {bookingCount > 0 && (
                        <span className="bg-white/95 border border-gray-200 text-gray-700 text-[8px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded-full shadow-3xs leading-none">
                          {bookingCount}
                        </span>
                      )}
                    </div>

                    {/* Booking item text blocks (Hiển thị 2 dòng rõ ràng: Tên mẫu & Size + Màu sắc) */}
                    <div className="space-y-1 mt-0.5 flex-grow select-none w-full">
                      {bookings.map((b, idx) => {
                        const colors = getCameraColorProps(b.cameraShort);
                        const isExcessOnMobile = idx >= 2;
                        const sizeLabel = b.isPrinter
                          ? `🖨️ ${b.printCount ?? '?'}t`
                          : (b.size === 'Freesize' || b.size === 'FS' ? 'FS' : `Size ${b.size || 'M'}`);
                        const colorLabel = (b as any).color ? ` • ${(b as any).color}` : '';
                        const displayName = b.cameraShort || (b as any).cleanName || b.cameraName;

                        return (
                          <div
                            key={idx}
                            className={`group flex flex-col justify-center px-1.5 py-1 border-0 border-l-[3px] sm:border-l-[3.5px] ${colors.border} ${colors.bgClass} rounded-md shadow-3xs transition-all hover:scale-[1.01] ${
                              isExcessOnMobile ? 'hidden sm:flex' : 'flex'
                            }`}
                            title={`${b.cameraName} (${sizeLabel}${colorLabel}) - Khách: ${b.contract.customerName}`}
                          >
                            {/* Dòng 1: Tên mẫu rõ ràng */}
                            <div className="flex items-center justify-between gap-1 leading-tight">
                              <span className="font-black text-[9.5px] sm:text-[11px] truncate tracking-tight text-gray-900">
                                {displayName}
                              </span>
                            </div>

                            {/* Dòng 2: Size & Chi tiết màu/in ảnh */}
                            <div className="flex items-center gap-1 mt-0.5 text-[8px] sm:text-[9px] font-semibold text-gray-700 leading-none">
                              <span className="bg-white/90 px-1 py-0.5 rounded font-bold text-gray-800 shadow-3xs shrink-0">
                                {sizeLabel}
                              </span>
                              {(b as any).color && (
                                <span className="truncate opacity-80 font-medium text-[8px]">
                                  {(b as any).color}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {bookings.length > 2 && (
                        <div className="sm:hidden text-[8px] font-black text-orange-700 bg-orange-100/70 py-0.5 rounded text-center leading-none">
                          +{bookings.length - 2} đơn nữa
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend Panel at Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-4 text-[11px] sm:text-xs text-gray-600 border-t border-gray-100 pt-3 select-none">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border border-gray-300 bg-white inline-block"></span>
              <span>Sẵn sàng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border border-amber-300 bg-amber-100 inline-block"></span>
              <span>Đã có lịch đặt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border border-rose-300 bg-rose-100 inline-block"></span>
              <span>Kín lịch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border-2 border-orange-500 bg-orange-100 inline-block"></span>
              <span>Đang chọn ({formatDMY(selectedDate)})</span>
            </div>
          </div>

          <div className="text-gray-600 font-mono text-[11px] bg-orange-50/60 px-3 py-1 rounded-lg border border-orange-200/60 flex items-center gap-1.5">
            <span className="font-sans font-bold">Ngày đang chọn:</span>
            <span className="text-orange-600 font-black">{formatDMY(selectedDate)}</span>
          </div>
        </div>

        {/* Mobile Day Detail Bottom Sheet */}
        {mobileDetailDate !== null && typeof document !== 'undefined' && createPortal(
          (() => {
            const sheetBookings = dayBookingsMap[mobileDetailDate] || [];
            const sheetDayOfWeek = (() => {
              try {
                const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                const d = new Date(mobileDetailDate);
                const parts = mobileDetailDate.split('-');
                const dayNum = parseInt(parts[2] || '1');
                const monthNum = parseInt(parts[1] || '1');
                return `${daysOfWeek[d.getDay()]}, ${dayNum < 10 ? '0' + dayNum : dayNum}/${String(monthNum).padStart(2, '0')}`;
              } catch (e) {
                return mobileDetailDate;
              }
            })();
            return (
              <div 
                className="md:hidden fixed inset-0 z-[9990] flex flex-col justify-end p-2.5 pb-[max(14px,calc(env(safe-area-inset-bottom,0px)+10px))]"
                onClick={() => setMobileDetailDate(null)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                {/* Sheet */}
                <div
                  className="relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-[82vh] overflow-hidden animate-slide-up w-full max-w-lg mx-auto border border-gray-150"
                  onClick={e => e.stopPropagation()}
                  style={{ animation: 'slideUpSheet 0.25s ease-out' }}
                >
                  {/* Drag handle */}
                  <div className="flex justify-center pt-2.5 pb-1 select-none">
                    <div className="w-10 h-1 rounded-full bg-gray-300" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm">{sheetDayOfWeek}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {sheetBookings.length > 0
                          ? `${sheetBookings.length} bộ trang phục có lịch thuê`
                          : 'Chưa có lịch thuê hôm này'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileDetailDate(null)}
                      className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  {/* Booking list */}
                  <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2.5 scrollbar-none">
                    {sheetBookings.length > 0 ? (
                      sheetBookings.map((b, bIdx) => {
                        const colors = getCameraColorProps(b.cameraShort);
                        const statusLabel = b.contract.status === 'Active' ? 'Đang thuê' :
                          b.contract.status === 'Completed' ? 'Đã trả' :
                          b.contract.status === 'Cancelled' ? 'Đã hủy' : 'Đã đặt';
                        const statusColor = b.contract.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : b.contract.status === 'Completed'
                          ? 'bg-gray-100 text-gray-600 border-gray-200'
                          : b.contract.status === 'Cancelled'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200';
                        return (
                          <div
                            key={bIdx}
                            className={`p-3 rounded-xl border-0 border-l-4 ${colors.bgClass} ${colors.border} shadow-sm`}
                          >
                            {/* Row 1: Code + Name + Size + Color + Status */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                <span className="font-mono text-[11px] font-black text-gray-800 shrink-0">{b.cameraShort}</span>
                                <span className="text-xs font-bold text-gray-900 truncate">{b.cameraName}</span>
                                <span className="bg-white/90 text-[9.5px] font-black px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                                  {b.isPrinter ? `🖨️ ${b.printCount ?? '?'}t` : `Size ${b.size || 'FS'}`}
                                </span>
                                {b.color && (
                                  <span className="bg-rose-50 text-rose-700 text-[9.5px] font-black px-1.5 py-0.5 rounded border border-rose-200 shrink-0 inline-flex items-center gap-1">
                                    🎨 {b.color}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0 ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>
                            {/* Row 2: Customer info */}
                            <div className="text-[10px] text-gray-600 font-medium flex flex-wrap items-center gap-x-3 gap-y-0.5">
                              <span>👤 {b.contract.customerName}</span>
                              {b.contract.customerPhone && (
                                <a
                                  href={`tel:${b.contract.customerPhone}`}
                                  className="font-mono text-blue-600 underline-offset-2 underline"
                                  onClick={e => e.stopPropagation()}
                                >
                                  📞 {b.contract.customerPhone}
                                </a>
                              )}
                            </div>
                            {/* Row 3: Date range */}
                            {(b.contract.startDate || b.contract.endDate) && (
                              <div className="text-[9.5px] text-gray-500 mt-1 font-mono">
                                📅 {b.contract.startDate} → {b.contract.endDate}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-gray-400 text-xs italic">
                        Ngày này chưa có lịch thuê
                      </div>
                    )}
                  </div>

                  {/* Footer action button */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, startDate: mobileDetailDate!, endDate: mobileDetailDate! }));
                        setShowAddQuickModal(true);
                        setMobileDetailDate(null);
                      }}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-black text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      + Đặt lịch ngày này
                    </button>
                  </div>
                </div>
              </div>
            );
          })(),
          document.body
        )}

        {/* Mobile-Only Interactive Daily Agenda List */}
        {(() => {
          const calendarDaysWithBookings = calendarDays.filter(d => (dayBookingsMap[d.dateString] || []).length > 0);
          return (
            <div className="block md:hidden mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2.5 select-none">
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-orange-600 rounded-sm"></span>
                  Lịch trang phục thuê {viewMode === 'month' ? `tháng ${currentMonth}/${currentYear}` : 'trong tuần'}
                </h3>
                <span className="text-[10px] bg-orange-50 text-orange-700 font-black px-2 py-0.5 rounded-full border border-orange-200 leading-none">
                  {calendarDaysWithBookings.length} ngày có lịch
                </span>
              </div>

              {calendarDaysWithBookings.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 scrollbar-none">
                  {calendarDaysWithBookings.map(({ dateString, day }) => {
                    const dayBookings = dayBookingsMap[dateString] || [];
                    const formattedDate = () => {
                      try {
                        const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                        const d = new Date(dateString);
                        return `${daysOfWeek[d.getDay()]}, ${day < 10 ? '0' + day : day}/${String(d.getMonth() + 1).padStart(2, '0')}`;
                      } catch (e) {
                        return `Ngày ${day}/${currentMonth}`;
                      }
                    };

                    const isSelected = selectedDate === dateString;

                    return (
                      <div
                        key={dateString}
                        onClick={() => handleDayClick(dateString)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-500/20 shadow-xs'
                            : 'bg-gray-50/70 border-gray-200 hover:bg-orange-50/20'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5 leading-none select-none">
                          <span className="text-xs font-black text-gray-855 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-600 animate-pulse' : 'bg-gray-400'}`}></span>
                            {formattedDate()}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 font-mono">
                            {dayBookings.length} bộ thuê
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {dayBookings.map((b, bIdx) => {
                            const colors = getCameraColorProps(b.cameraShort);
                            return (
                              <div
                                key={bIdx}
                                className={`flex items-center justify-between p-2 rounded-lg border-0 border-l-[3.5px] ${colors.bgClass} ${colors.border} shadow-3xs`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono text-[10px] font-black text-gray-800">
                                      {b.cameraShort}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900 truncate">
                                      {b.cameraName}
                                    </span>
                                    <span className="bg-white/90 text-[9px] font-black px-1.5 py-0.2 rounded border border-gray-200">
                                      Size {b.size || 'FS'}
                                    </span>
                                    {b.color && (
                                      <span className="bg-rose-50 text-rose-700 text-[9px] font-black px-1.5 py-0.2 rounded border border-rose-200 inline-flex items-center gap-1">
                                        🎨 {b.color}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-gray-600 font-medium flex items-center gap-2 mt-0.5">
                                    <span>👤 {b.contract.customerName}</span>
                                    {b.contract.customerPhone && (
                                      <span className="font-mono text-gray-500">📞 {b.contract.customerPhone}</span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/80 text-orange-700 border border-orange-200 shrink-0">
                                  {b.contract.status === 'Active' ? 'Đang thuê' : 'Đã đặt'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl text-center select-none">
                  <p className="text-xs text-gray-400 italic font-medium">Khoảng thời gian này trống lịch thuê</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>



      {/* Selected Day Bookings Detail Inspector */}
      <div className="bg-white border border-gray-150/70 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Info className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-gray-900 text-sm sm:text-base select-none">
                Chi tiết đặt lịch ngày {formatDMY(selectedDate)}
              </h3>
              <span className="text-xs text-gray-500">
                {dayBookingsMap[selectedDate]?.length || 0} trang phục có lịch thuê trong ngày
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                startDate: selectedDate,
                endDate: selectedDate
              }));
              setShowAddQuickModal(true);
            }}
            className="text-xs font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-200 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đơn ngày này</span>
          </button>
        </div>

        {dayBookingsMap[selectedDate]?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dayBookingsMap[selectedDate].map((b, idx) => {
              const colors = getCameraColorProps(b.cameraShort);
              return (
                <div key={idx} className="border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-orange-200 transition-all p-3.5 flex flex-col justify-between gap-3 shadow-3xs">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`${colors.tagColor} text-xs font-black px-2 py-0.5 rounded-lg font-mono shrink-0`}>
                          {b.cameraShort}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm truncate">{b.cameraName}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                        b.contract.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        b.contract.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {b.contract.status === 'Active' ? 'Đang thuê' :
                         b.contract.status === 'Overdue' ? 'Quá hạn' : 'Đã xong'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-gray-150 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">{b.isPrinter ? 'Số lượng in:' : 'Kích cỡ (Size):'}</span>
                        <span className={`font-bold ${b.isPrinter ? 'text-rose-700 font-mono' : 'text-slate-900'}`}>
                          {b.isPrinter ? (
                            `🖨️ ${b.printCount ?? '?'} tấm ảnh`
                          ) : (
                            <span className="bg-slate-100 text-slate-800 font-black text-xs px-2 py-0.5 rounded border border-slate-200">
                              Size {b.size || 'Freesize'}
                            </span>
                          )}
                        </span>
                      </div>
                      {b.color && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Màu sắc:</span>
                          <span className="bg-rose-50 text-rose-700 font-bold text-xs px-2 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1">
                            🎨 {b.color}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Thời gian thuê:</span>
                        <span className="font-semibold text-gray-800">
                          {b.contract.startDate === b.contract.endDate
                            ? `${b.contract.startDate} (1 ngày)`
                            : `${b.contract.startDate} → ${b.contract.endDate}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Khách hàng:</span>
                        <span className="font-extrabold text-gray-900">{b.contract.customerName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Thế chấp:</span>
                        <span className="font-medium text-gray-700">
                          {b.contract.customerDocType === 'CCCD_And_1M' ? 'CCCD + 1M' : b.contract.customerDocType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 gap-2">
                    <a
                      href={`tel:${b.contract.customerPhone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-xs text-orange-700 font-mono font-bold transition"
                    >
                      <Phone className="w-3 h-3 text-orange-600" />
                      <span>{b.contract.customerPhone}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border">
                        {b.contract.contractCode}
                      </span>
                      {onDeleteContract && (
                        <button
                          onClick={() => setDeleteConfirmId(b.contract.id)}
                          className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Xóa Hợp Đồng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center select-none space-y-2">
            <p className="text-sm text-gray-500 font-medium">
              Không có lịch đặt nào cho ngày {formatDMY(selectedDate)}. Toàn bộ trang phục sẵn sàng cho thuê!
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  startDate: selectedDate,
                  endDate: selectedDate
                }));
                setShowAddQuickModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition cursor-pointer shadow-3xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo đơn thuê ngay cho ngày này</span>
            </button>
          </div>
        )}
      </div>


      {showAddQuickModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg md:max-w-5xl lg:max-w-6xl w-full overflow-hidden self-center animate-scale-up flex flex-col max-h-[92vh]">
            <div className="bg-orange-600 px-4 py-3 sm:px-6 sm:py-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" /> Đặt Lịch & Tạo Đơn Nhanh
              </h3>
              <button
                onClick={() => setShowAddQuickModal(false)}
                className="text-white/80 hover:text-white font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form 
              onSubmit={handleQuickBookingSubmit} 
              className="p-3 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4 flex-1 overflow-y-auto overscroll-contain modal-scrollable"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-start">
                
                {/* === BƯỚC 1: THÔNG TIN KHÁCH HÀNG & THỜI GIAN THUÊ (Top Left trên PC, Đầu trang trên Mobile) === */}
                <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 space-y-3 sm:space-y-3.5">
                  {/* Khung Thông tin khách hàng & cọc - Viền cam mềm mại, đồng bộ, hoàn toàn không viền đen */}
                  <div className="bg-white border-2 border-orange-200/90 rounded-2xl p-3 sm:p-3.5 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 border-b border-orange-100 pb-2">
                      <User className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wide">Thông tin khách hàng & cọc</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tên khách hàng *</label>
                        {(() => {
                          const inputName = formData.customerName.trim().toLowerCase();
                          const nameSuggestions = inputName.length >= 1
                            ? Array.from(
                                new Map(
                                  [
                                    ...customers.map(c => ({ name: c.name, phone: c.phone })),
                                    ...contracts.map(c => ({ name: c.customerName, phone: c.customerPhone }))
                                  ]
                                  .filter(item => item.name && item.name.toLowerCase().includes(inputName))
                                  .map(item => [item.name.toLowerCase(), item])
                                ).values()
                              ).filter(item => item.name.toLowerCase() !== inputName)
                            : [];

                          return (
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={formData.customerName}
                                onChange={e => {
                                  setFormData({ ...formData, customerName: e.target.value });
                                  setHideCustomerSuggestions(false);
                                }}
                                className="w-full border border-gray-300 rounded-lg p-2 pr-8 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-gray-400 font-medium"
                                placeholder="VD: Nguyễn Văn A"
                              />
                              {formData.customerName && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, customerName: '' });
                                    setHideCustomerSuggestions(true);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
                                  title="Xoá tên"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
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
                                        setFormData({ ...formData, customerName: sug.name, customerPhone: sug.phone || formData.customerPhone });
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
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại *</label>
                        {(() => {
                          const phone = formData.customerPhone.trim();
                          const matchedCustomer = phone.length >= 8
                            ? (customers.find(c => c.phone === phone) ||
                               contracts.reduce((found: any, c) => found || (c.customerPhone === phone ? { name: c.customerName, phone: c.customerPhone } : null), null))
                            : null;
                          return (
                            <div className="relative">
                              <input
                                type="tel"
                                required
                                value={formData.customerPhone}
                                onChange={e => {
                                  const newPhone = e.target.value;
                                  const found = newPhone.trim().length >= 8
                                    ? (customers.find(c => c.phone === newPhone.trim()) ||
                                       contracts.reduce((f: any, c) => f || (c.customerPhone === newPhone.trim() ? { name: c.customerName } : null), null))
                                    : null;
                                  if (found && !formData.customerName) {
                                    setFormData({ ...formData, customerPhone: newPhone, customerName: found.name });
                                  } else {
                                    setFormData({ ...formData, customerPhone: newPhone });
                                  }
                                }}
                                className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-gray-400 font-medium font-mono ${matchedCustomer ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-300'}`}
                                placeholder="VD: 0912345678"
                              />
                              {matchedCustomer && (
                                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                  <span>✓</span>
                                  <span>Khách cũ: <span className="font-bold">{matchedCustomer.name}</span></span>
                                  {formData.customerName !== matchedCustomer.name && (
                                    <button
                                      type="button"
                                      onClick={() => setFormData({ ...formData, customerName: matchedCustomer.name })}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Giấy tờ thế chấp</label>
                        <select
                          value={formData.customerDocType}
                          onChange={e => {
                            const val = e.target.value as any;
                            const nextData = { ...formData, customerDocType: val };
                            if (val === 'CCCD_And_1M') {
                              nextData.depositAmount = 1000000;
                            } else if (val === 'Other') {
                              nextData.depositAmount = 0;
                              setTimeout(() => {
                                quickDocNoteInputRef.current?.focus();
                              }, 60);
                            } else if (val === 'CashDeposit') {
                              nextData.depositAmount = calculatedRecommendedDeposit > 0 ? calculatedRecommendedDeposit : 1000000;
                            } else {
                              nextData.depositAmount = 0;
                            }
                            if (nextData.customerDocNote === 'Giữ CCCD gốc + 1.000.000đ' || 
                                nextData.customerDocNote === 'Giữ CCCD gốc' || 
                                nextData.customerDocNote === 'Giữ GPLX gốc' || 
                                nextData.customerDocNote === 'Giữ Hộ chiếu gốc' || 
                                nextData.customerDocNote === 'Đặt cọc tiền mặt') {
                              nextData.customerDocNote = '';
                            }
                            setFormData(nextData);
                          }}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-gray-700 truncate"
                        >
                          <option value="CCCD">Căn cước công dân (CCCD)</option>
                          <option value="CCCD_And_1M">Giữ CCCD + 1.000.000đ</option>
                          <option value="GPLX">Bằng lái xe (GPLX)</option>
                          <option value="Passport">Hộ chiếu (Passport)</option>
                          <option value="CashDeposit">Đặt cọc tiền mặt</option>
                          <option value="Other">Hình thức khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Ghi chú thế chấp {formData.customerDocType === 'Other' && <span className="text-orange-600 font-bold">* (Viết rõ)</span>}
                        </label>
                        <input
                          ref={quickDocNoteInputRef}
                          type="text"
                          value={formData.customerDocNote}
                          onChange={e => setFormData({ ...formData, customerDocNote: e.target.value })}
                          className={`w-full border rounded-lg p-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                            formData.customerDocType === 'Other' ? 'border-orange-400 bg-orange-50/20' : 'border-gray-300'
                          }`}
                          placeholder={formData.customerDocType === 'Other' ? 'Ghi rõ đồ thế chấp (xe, thẻ SV...)' : 'VD: Wave S BKS 29-X... + Thẻ SV'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Khung Thời gian thuê trang phục */}
                  <div className="bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-white border-2 border-orange-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs space-y-2.5 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                        <CalendarIcon className="w-4 h-4 text-orange-600" />
                        <span>Thời gian thuê trang phục *</span>
                      </label>
                      <span className="text-[11px] font-extrabold text-orange-700 bg-orange-100/90 px-2.5 py-0.5 rounded-full shadow-3xs">
                        📅 Thuê {calculatedDays > 0 ? calculatedDays : 1} ngày
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
                      <div className="w-full min-w-0">
                        <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                          Ngày bắt đầu bàn giao *
                        </label>
                        <div className="relative w-full cursor-pointer group">
                          <div className="w-full h-10 bg-white border border-gray-300 group-hover:border-orange-500 rounded-xl px-2.5 sm:px-3 flex items-center justify-between shadow-2xs transition-colors">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                              <span className="text-xs sm:text-sm font-bold text-gray-850 tracking-wide truncate">
                                {formData.startDate ? formatDMY(formData.startDate) : 'Chọn ngày'}
                              </span>
                            </div>
                            <span className="text-[9.5px] sm:text-[10px] font-semibold text-orange-700 bg-orange-50 group-hover:bg-orange-100 border border-orange-200/80 px-1.5 py-0.5 rounded shrink-0 transition-colors">
                              Đổi
                            </span>
                          </div>
                          <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={e => {
                              const d = e.target.value;
                              setFormData(prev => ({
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
                          <div className="w-full h-10 bg-white border border-gray-300 group-hover:border-orange-500 rounded-xl px-2.5 sm:px-3 flex items-center justify-between shadow-2xs transition-colors">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                              <span className="text-xs sm:text-sm font-bold text-gray-850 tracking-wide truncate">
                                {formData.endDate ? formatDMY(formData.endDate) : 'Chọn ngày'}
                              </span>
                            </div>
                            <span className="text-[9.5px] sm:text-[10px] font-semibold text-orange-700 bg-orange-50 group-hover:bg-orange-100 border border-orange-200/80 px-1.5 py-0.5 rounded shrink-0 transition-colors">
                              Đổi
                            </span>
                          </div>
                          <input
                            type="date"
                            required
                            min={formData.startDate}
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
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
                </div>

                {/* === BƯỚC 2: CHỌN TRANG PHỤC CẦN THUÊ / LỊCH MÁY (Right Column trên PC, Bước 2 trên Mobile) === */}
                <div className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2 space-y-3 sm:space-y-4">
                  {/* Prominent Camera Selection Box (HERO HIGHLIGHT) */}
                  <div className="bg-gradient-to-b from-orange-50/90 via-amber-50/40 to-orange-50/60 border-2 border-orange-300 rounded-2xl p-3 sm:p-4 shadow-sm ring-4 ring-orange-500/10">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-3xs shrink-0">
                      <DressIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-gray-950 uppercase tracking-wide truncate">
                      Chọn trang phục cần thuê *
                    </span>
                  </div>
                  {formData.selectedCameraIds.length > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs flex items-center gap-1 shrink-0 animate-pulse">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Đã chọn: {formData.selectedCameraIds.length} món
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-orange-600 border border-orange-200 shadow-3xs shrink-0">
                      Chưa chọn trang phục nào
                    </span>
                  )}
                </div>

                {/* Quick Search and Size Filter for Outfits */}
                <div className="space-y-1.5 mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={quickOutfitSearch}
                      onChange={e => setQuickOutfitSearch(e.target.value)}
                      placeholder="🔍 Tìm nhanh mẫu đồ, mã số, màu sắc..."
                      className="w-full bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs font-medium"
                    />
                    {quickOutfitSearch && (
                      <button
                        type="button"
                        onClick={() => setQuickOutfitSearch('')}
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
                        const isActive = quickSizeFilter === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setQuickSizeFilter(sz)}
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
                        const isActive = quickAvailabilityFilter === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setQuickAvailabilityFilter(st.id as any)}
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

                <div className="bg-white/95 border border-orange-200/90 rounded-xl p-2 max-h-[300px] lg:max-h-[540px] overflow-y-auto space-y-2 shadow-inner">
                  {(() => {
                    const availableOutfits = cameras
                      .filter(cam => {
                        const isLaundry = cam.cleaningStatus === 'Laundry';
                        const isMending = cam.cleaningStatus === 'Mending';
                        const isRented = cam.status === 'Rented';
                        const isMaint = cam.status === 'Maintenance';
                        const isReady = !isLaundry && !isMending && !isRented && !isMaint;
                        if (quickAvailabilityFilter === 'READY' && !isReady) return false;
                        if (quickAvailabilityFilter === 'BUSY' && isReady) return false;
                        if (quickSizeFilter !== 'ALL') {
                          if (quickSizeFilter === 'Freesize') {
                            const isFs = (cam.availableSizes && cam.availableSizes.some(s => /free|fs/i.test(s))) || (cam.size && /free|fs/i.test(cam.size));
                            if (!isFs) return false;
                          } else {
                            const hasSize = (cam.availableSizes && cam.availableSizes.some(s => s.toUpperCase() === quickSizeFilter.toUpperCase())) || (cam.size && cam.size.toUpperCase().includes(quickSizeFilter.toUpperCase()));
                            if (!hasSize) return false;
                          }
                        }
                        if (quickOutfitSearch.trim()) {
                          const q = quickOutfitSearch.trim().toLowerCase();
                          if (!(cam.name||'').toLowerCase().includes(q) && !(cam.shortName||'').toLowerCase().includes(q) && !(cam.serialNumber||'').toLowerCase().includes(q) && !(cam.color||'').toLowerCase().includes(q) && !(cam.size||'').toLowerCase().includes(q)) return false;
                        }
                        return true;
                      });

                    if (availableOutfits.length === 0) {
                      return (
                        <p className="text-xs text-gray-400 italic text-center py-4">
                          {quickOutfitSearch || quickSizeFilter !== 'ALL' || quickAvailabilityFilter !== 'ALL' ? 'Không tìm thấy trang phục nào phù hợp.' : 'Hiện không có trang phục khả dụng trong kho.'}
                        </p>
                      );
                    }

                    // Check if a cam has booking conflict on currently selected dates
                    const isBookedOnDates = (camId: string): boolean => {
                      if (!formData.startDate) return false;
                      const endD = formData.endDate || formData.startDate;
                      const getDR = (s: string, e: string) => { const d: string[] = []; const l = new Date(s+'T00:00:00'), ed = new Date(e+'T00:00:00'); while(l<=ed){d.push(l.toISOString().split('T')[0]);l.setDate(l.getDate()+1);} return d; };
                      const cDates = getDR(formData.startDate, endD);
                      return contracts.some(c => {
                        if (c.status==='Cancelled') return false;
                        if (!c.items.some((it:any) => it.cameraId===camId)) return false;
                        const eDates = getDR(c.startDate, c.endDate||c.startDate);
                        return cDates.some(d => eDates.includes(d));
                      });
                    };

                    const printerCams = availableOutfits.filter(c => c.category === 'Printer' || Boolean(c.isPrinter));
                    const outfitCams = availableOutfits.filter(c => c.category !== 'Printer' && !c.isPrinter);

                    // Group by shortName (same for all sizes of same model)
                    const groups = new Map<string, typeof outfitCams>();
                    outfitCams.forEach(cam => {
                      const k = cam.shortName || cam.id;
                      if (!groups.has(k)) groups.set(k, []);
                      groups.get(k)!.push(cam);
                    });

                    const SIZE_ORDER = ['XS','S','M','L','XL','XXL','3XL','4XL','Freesize','FS'];

                    return (
                      <>
                        {[...groups.entries()].map(([groupKey, groupCams]) => {
                          const sorted = [...groupCams].sort((a,b) => {
                            const ai = SIZE_ORDER.indexOf(a.size||'FS'), bi = SIZE_ORDER.indexOf(b.size||'FS');
                            return (ai<0?99:ai)-(bi<0?99:bi);
                          });
                          const first = sorted[0];
                          const anySelected = sorted.some(c => formData.selectedCameraIds.includes(c.id));
                          const selectedSizes = sorted.filter(c => formData.selectedCameraIds.includes(c.id));
                          const basePrice = calculatedDays > 0
                            ? `${Math.round(getCameraRateForDuration(first, calculatedDays, false)).toLocaleString()}đ/ngày`
                            : `${(first.price1Day ?? first.dailyRate).toLocaleString()}đ/ngày`;
                          const baseName = first.name.replace(/\s*\(Size\s+\S+\)\s*$/i, '').replace(/\s*\(Freesize\)\s*$/i, '').trim();
                          const displayImage = sorted.find(c => formData.selectedCameraIds.includes(c.id) && c.image)?.image || sorted.find(c => c.image)?.image || first.image;

                          return (
                            <div key={groupKey} className={`p-3 rounded-2xl transition-all border ${anySelected ? 'bg-orange-50/70 border-orange-400 shadow-xs ring-1 ring-orange-300/60' : 'bg-white border-gray-200/90 hover:border-orange-300 hover:shadow-2xs shadow-3xs'}`}>
                              <div className="flex gap-2.5 sm:gap-3 items-start">
                                {/* Thumbnail ảnh đại diện trang phục */}
                                <div 
                                  style={{ width: '3.75rem', height: '4.75rem' }} className="sm:w-16 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shrink-0 relative group/thumb shadow-3xs flex items-center justify-center cursor-pointer"
                                  onClick={(e) => {
                                    if (displayImage) {
                                      e.stopPropagation();
                                      setPreviewImage({ url: displayImage, title: baseName || groupKey });
                                    }
                                  }}
                                  title={displayImage ? "Nhấp để xem ảnh lớn" : undefined}
                                >
                                  {displayImage ? (
                                    <>
                                      <img
                                        src={displayImage}
                                        alt={baseName}
                                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-200"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                      />
                                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] px-1 py-0.2 rounded opacity-0 group-hover/thumb:opacity-100 transition">🔍</span>
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-slate-50">
                                      <span className="text-xl">👗</span>
                                    </div>
                                  )}
                                </div>

                                {/* Thông tin trang phục */}
                                <div className="flex-1 min-w-0">
                                  {/* Dòng 1: Mã sản phẩm (hiển thị nổi bật ở đầu như trước) + Tên trang phục + Giá thuê */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                                      {/* Mã sản phẩm nổi bật ở đầu thẻ như trước */}
                                      <span className={`font-mono text-[10.5px] sm:text-xs font-black px-2 py-0.5 rounded-md border shrink-0 ${
                                        anySelected 
                                          ? 'bg-orange-600 text-white border-orange-600 shadow-3xs' 
                                          : 'bg-gray-100 text-gray-800 border-gray-250 shadow-3xs'
                                      }`}>
                                        #{groupKey}
                                      </span>

                                      {/* Tên trang phục đầy đủ */}
                                      {baseName && baseName !== groupKey && (
                                        <span className={`text-xs sm:text-sm font-extrabold leading-snug ${
                                          anySelected ? 'text-orange-950 font-black' : 'text-gray-900'
                                        }`}>
                                          {baseName}
                                        </span>
                                      )}
                                    </div>

                                    <div className="shrink-0 text-right">
                                      <span className={`font-mono text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-lg inline-block shadow-3xs ${
                                        anySelected 
                                          ? 'bg-orange-600 text-white' 
                                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                                      }`}>
                                        {basePrice}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Dòng 2: Phân loại + Màu sắc (co giãn tự nhiên, không bị cắt chữ) */}
                                  <div className="flex items-center flex-wrap gap-1.5 mt-1.5 mb-1">
                                    {first.category && first.category !== 'Printer' && (
                                      <span className="bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        {first.category}
                                      </span>
                                    )}
                                    {(() => {
                                      const uniqueCols = Array.from(new Set(sorted.map(c => c.color?.trim()).filter(Boolean)));
                                      if (uniqueCols.length === 0) return null;
                                      return (
                                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 shadow-3xs" title={uniqueCols.join(', ')}>
                                          <span>🎨</span>
                                          <span>{uniqueCols.length > 1 ? `${uniqueCols.length} màu: ${uniqueCols.join(', ')}` : uniqueCols[0]}</span>
                                        </span>
                                      );
                                    })()}
                                    {(() => {
                                      const availCount = sorted.filter(c => {
                                        const isMnt = c.status === 'Maintenance';
                                        const isLdry = c.cleaningStatus === 'Laundry';
                                        const isMnd = c.cleaningStatus === 'Mending';
                                        return !isMnt && !isLdry && !isMnd && !isBookedOnDates(c.id);
                                      }).length;
                                      return (
                                        <span className={`text-[10px] font-bold ml-auto ${availCount > 0 ? 'text-emerald-700' : 'text-gray-400'}`}>
                                          {availCount > 0 ? `• Còn ${availCount}/${sorted.length} size` : '• Hết size ngày này'}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>

                              {/* Dòng 3: Danh sách các nút chọn Size */}
                              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                  <span>Chọn size:</span>
                                  <span className="text-[9.5px] font-medium text-gray-400 capitalize">
                                    (Bấm để chọn/bỏ)
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {sorted.map(cam => {
                                    const isSel = formData.selectedCameraIds.includes(cam.id);
                                    const isLdry = cam.cleaningStatus === 'Laundry';
                                    const isMnd = cam.cleaningStatus === 'Mending';
                                    const isMnt = cam.status === 'Maintenance';
                                    const isDateBusy = isBookedOnDates(cam.id);
                                    const isBlocked = isDateBusy || isMnt || isLdry || isMnd;
                                    const szLabel = cam.size || 'FS';
                                    return (
                                      <button
                                        key={cam.id}
                                        type="button"
                                        onClick={() => {
                                          if (isSel) {
                                            setFormData({...formData, selectedCameraIds: formData.selectedCameraIds.filter(id => id !== cam.id)});
                                            return;
                                          }
                                          if (isBlocked) {
                                            const reason = isDateBusy 
                                              ? 'Đã có lịch đặt trong ngày này!' 
                                              : isMnt 
                                              ? 'Đang bảo dưỡng - chưa khả dụng!' 
                                              : isLdry 
                                              ? 'Đang giặt hấp - không thể chọn!' 
                                              : 'Đang sửa chữa - không thể chọn!';
                                            setCustomAlertMessage(`"${itemTitle}" Size ${szLabel}: ${reason}`);
                                            return;
                                          }
                                          setFormData({...formData, selectedCameraIds: [...formData.selectedCameraIds, cam.id]});
                                        }}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all select-none border ${
                                          isSel
                                            ? 'bg-orange-50/95 text-orange-950 border-2 border-orange-500 ring-2 ring-orange-300/80 shadow-xs scale-102 font-black cursor-pointer'
                                            : isBlocked
                                            ? isDateBusy
                                              ? 'bg-red-50 text-red-500 border-red-200 cursor-not-allowed opacity-75'
                                              : isMnt
                                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                              : isLdry
                                              ? 'bg-blue-50 text-blue-700 border-blue-200 cursor-not-allowed opacity-65'
                                              : 'bg-amber-50 text-amber-700 border-amber-200 cursor-not-allowed opacity-65'
                                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-orange-100 hover:border-orange-400 hover:text-orange-950 shadow-3xs cursor-pointer active:scale-97'
                                        }`}
                                      >
                                        {isSel ? (
                                          <Check className="w-3.5 h-3.5 stroke-[3.5] text-orange-600 shrink-0" />
                                        ) : isDateBusy ? (
                                          <span className="text-[10px] shrink-0">📅</span>
                                        ) : isMnt ? (
                                          <span className="text-[10px] shrink-0">✕</span>
                                        ) : isLdry ? (
                                          <span className="text-[10px] shrink-0">🧺</span>
                                        ) : isMnd ? (
                                          <span className="text-[10px] shrink-0">🪡</span>
                                        ) : (
                                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block ring-2 ring-emerald-200" />
                                        )}
                                        <span className="font-extrabold whitespace-nowrap">Size {szLabel}</span>
                                        {cam.color && (
                                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md truncate max-w-[100px] shadow-3xs ${
                                            isSel ? 'bg-white text-orange-950 border border-orange-300' : 'bg-white/90 text-gray-700 border border-gray-200/80'
                                          }`}>
                                            🎨 {cam.color}
                                          </span>
                                        )}
                                        {isDateBusy && (
                                          <span className="text-[9px] font-bold text-red-600 bg-red-100/80 px-1 py-0.2 rounded">
                                            Đã đặt
                                          </span>
                                        )}
                                        {isMnt && (
                                          <span className="text-[9px] font-bold text-gray-500 bg-gray-200/80 px-1 py-0.2 rounded">
                                            Bảo trì
                                          </span>
                                        )}
                                        {!isDateBusy && isLdry && (
                                          <span className="text-[9px] font-bold text-blue-600 bg-blue-100/80 px-1 py-0.2 rounded">
                                            Đang giặt
                                          </span>
                                        )}
                                        {!isDateBusy && isMnd && (
                                          <span className="text-[9px] font-bold text-amber-600 bg-amber-100/80 px-1 py-0.2 rounded">
                                            Đang sửa
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Dòng 4: Tóm tắt khi đã chọn */}
                              {selectedSizes.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-orange-200/80 flex flex-wrap gap-1.5 items-center bg-orange-100/50 -mx-3 -mb-3 p-2.5 rounded-b-2xl">
                                  <span className="text-[10px] text-orange-800 font-black uppercase tracking-wide shrink-0">
                                    ✓ Đã chọn ({selectedSizes.length}):
                                  </span>
                                  {selectedSizes.map(c => (
                                    <span key={c.id} className="text-[10px] font-mono font-black bg-white text-orange-900 px-2 py-0.5 rounded-lg border border-orange-300 shadow-3xs flex items-center gap-1">
                                      <span>Size {c.size || 'FS'}</span>
                                      {c.serialNumber && <span className="text-gray-400 font-normal">#{c.serialNumber}</span>}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Printers stay as individual cards */}
                        {printerCams.map(cam => {
                          const isSelected = formData.selectedCameraIds.includes(cam.id);
                          const printCount = formData.printCounts?.[cam.id] || 5;
                          const printPricing = getPrintPrice(cam, printCount);
                          const isUnavailable = cam.cleaningStatus === 'Laundry' || cam.cleaningStatus === 'Mending' || cam.status === 'Rented' || cam.status === 'Maintenance';
                          const priceLabel = isSelected ? `${printPricing.totalPrice.toLocaleString()}đ (${printCount} tấm)` : '40k/tấm (từ 33k)';
                          return (
                            <div key={cam.id} onClick={() => {
                              if (isUnavailable) { setCustomAlertMessage(`Máy in "${cam.name}" không khả dụng!`); return; }
                              if (isSelected) setFormData({...formData, selectedCameraIds: formData.selectedCameraIds.filter(id => id!==cam.id)});
                              else setFormData({...formData, selectedCameraIds: [...formData.selectedCameraIds, cam.id], printCounts: {...formData.printCounts, [cam.id]: formData.printCounts?.[cam.id]||5}});
                            }} className={`p-2.5 rounded-xl select-none transition-all ${isUnavailable ? 'bg-gray-100/80 border border-gray-200 opacity-65 cursor-not-allowed' : isSelected ? 'bg-orange-50 border-2 border-orange-500 shadow-xs cursor-pointer' : 'bg-white hover:bg-orange-50/40 border border-gray-200 hover:border-orange-200 shadow-3xs cursor-pointer'}`}>
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 ${isUnavailable ? 'border-2 border-gray-300 bg-gray-200' : isSelected ? 'bg-orange-600 text-white' : 'border-2 border-gray-300 bg-white'}`}>
                                    {isUnavailable ? <span className="text-[10px] font-black text-gray-500">✕</span> : isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                                  </div>
                                  {cam.image && (
                                    <img src={cam.image} alt={cam.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                                  )}
                                  <span className={`text-sm font-extrabold truncate ${isUnavailable ? 'text-gray-500' : isSelected ? 'text-orange-950' : 'text-gray-900'}`}>{cam.name}</span>
                                  <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">🖨️ Máy in</span>
                                </div>
                                <span className={`font-mono text-xs font-black shrink-0 px-2 py-0.5 rounded-lg ${isUnavailable ? 'bg-gray-200 text-gray-500' : isSelected ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 border border-orange-200/60'}`}>{priceLabel}</span>
                              </div>
                              {isSelected && (
                                <div onClick={e => e.stopPropagation()} className="mt-2 pt-2 border-t border-orange-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-gray-700">Số lượng in:</span>
                                    <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                                      <button type="button" onClick={() => setFormData(prev => ({...prev, printCounts: {...prev.printCounts, [cam.id]: Math.max(1, printCount-1)}}))} className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100">-</button>
                                      <input type="number" min={1} value={printCount} onChange={e => setFormData(prev => ({...prev, printCounts: {...prev.printCounts, [cam.id]: Math.max(1, parseInt(e.target.value)||1)}}))} className="w-12 text-center text-xs font-bold py-0.5 focus:outline-none border-x border-gray-200" />
                                      <button type="button" onClick={() => setFormData(prev => ({...prev, printCounts: {...prev.printCounts, [cam.id]: printCount+1}}))} className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100">+</button>
                                    </div>
                                    <span className="text-[11px] text-gray-500">tấm</span>
                                  </div>
                                  <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                    {printPricing.unitPrice.toLocaleString()}đ/tấm ({printPricing.tierLabel}) = <strong>{printPricing.totalPrice.toLocaleString()}đ</strong>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* === BƯỚC 3: TIỀN CỌC, GIẢM GIÁ & BÁO GIÁ TẠM TÍNH (Bottom Left trên PC, Bước 3 trên Mobile) === */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 space-y-3 sm:space-y-3.5">

              {/* Money & Deposit section */}
              <div className="bg-amber-50/30 border border-amber-200/60 rounded-2xl p-3 sm:p-3.5 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Cột 1: Cọc thế chấp */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-750">Tiền cọc thế chấp (VND)</label>
                    </div>
                    <MoneyInput
                      value={formData.depositAmount ?? 0}
                      onChange={v => setFormData({ ...formData, depositAmount: v })}
                      placeholder="0"
                      allowZero={true}
                      className="border border-gray-250 bg-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      suffixColor="gray"
                    />
                    {calculatedRecommendedDeposit > 0 && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, depositAmount: calculatedRecommendedDeposit })}
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
                      <label className="text-xs font-bold text-gray-750 whitespace-nowrap">Cọc giữ trang phục (VND)</label>
                      {formData.paidAmount > 0 && calculatedTotal > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          formData.paidAmount === Math.round(calculatedTotal * 0.5)
                            ? 'bg-amber-200/80 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {formData.paidAmount === Math.round(calculatedTotal * 0.5)
                            ? 'Đúng 50%'
                            : `Cọc ${Math.round((formData.paidAmount / calculatedTotal) * 100)}%`}
                        </span>
                      )}
                    </div>
                    <MoneyInput
                      value={formData.paidAmount || 0}
                      onChange={v => setFormData({ ...formData, paidAmount: v })}
                      placeholder="VD: 500.000"
                      className="border border-gray-250 bg-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      suffixColor="gray"
                    />
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paidAmount: Math.round(calculatedTotal * 0.5) })}
                        className={`w-full min-w-0 text-[11px] font-bold py-1 px-1.5 rounded-lg border transition-all cursor-pointer text-center truncate ${
                          formData.paidAmount === Math.round(calculatedTotal * 0.5) && calculatedTotal > 0
                            ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-black'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250'
                        }`}
                        title={`Cọc 50% (${(Math.round(calculatedTotal * 0.5)).toLocaleString()} đ)`}
                      >
                        50% ({(Math.round(calculatedTotal * 0.5)).toLocaleString()}đ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paidAmount: 0 })}
                        className={`w-full min-w-0 text-[11px] font-bold py-1 px-1.5 rounded-lg border transition-all cursor-pointer text-center truncate ${
                          formData.paidAmount === 0
                            ? 'bg-gray-700 border-gray-800 text-white shadow-xs font-black'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-250'
                        }`}
                        title="Không thu cọc giữ đồ (0 đ)"
                      >
                        Không cọc (0đ)
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-600 pt-0.5">
                      {formData.paidAmount > 0 ? (
                        <span>
                          {formData.paidAmount === Math.round(calculatedTotal * 0.5) ? (
                            <span className="text-amber-900 font-semibold">✓ Đã cọc 50% ({(formData.paidAmount).toLocaleString()}đ)</span>
                          ) : (
                            <span className="text-blue-800 font-semibold">✓ Cọc {calculatedTotal > 0 ? Math.round((formData.paidAmount / calculatedTotal) * 100) : 0}% ({(formData.paidAmount).toLocaleString()}đ)</span>
                          )}
                          {calculatedTotal > formData.paidAmount && (
                            <span> · Còn thu: <strong className="text-orange-700 font-bold">{(calculatedTotal - formData.paidAmount).toLocaleString()}đ</strong></span>
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
                      {formData.discountPercent > 0 && totalBeforeDiscount > 0 ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                          -{(totalBeforeDiscount - calculatedTotal).toLocaleString()}đ (-{formData.discountPercent}%)
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
                          value={formData.discountPercent || ''}
                          onChange={e => {
                            const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                            const newFinal = Math.round(totalBeforeDiscount * (1 - val / 100));
                            setFormData(prev => ({
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
                          value={formData.customFinalPrice !== null && formData.customFinalPrice !== undefined ? formData.customFinalPrice : calculatedTotal}
                          onChange={finalPrice => {
                            if (!totalBeforeDiscount || totalBeforeDiscount <= 0) {
                              setFormData(prev => ({ ...prev, discountPercent: 0, customFinalPrice: 0 }));
                              return;
                            }
                            const val = finalPrice ?? 0;
                            let calculatedPct = 0;
                            if (totalBeforeDiscount > 0 && val < totalBeforeDiscount) {
                              const discountAmount = totalBeforeDiscount - val;
                              const rawPct = (discountAmount / totalBeforeDiscount) * 100;
                              calculatedPct = Number(rawPct.toFixed(2));
                            }
                            setFormData(prev => ({
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

                  {/* 6 nút chọn nhanh: 3 cột trên mobile, 6 cột trên PC */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5 mt-2">
                    {[0, 5, 10, 15, 20, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          const newFinal = Math.round(totalBeforeDiscount * (1 - pct / 100));
                          setFormData(prev => ({
                            ...prev,
                            discountPercent: pct,
                            customFinalPrice: newFinal
                          }));
                        }}
                        className={`py-1.5 sm:py-1 text-xs sm:text-[11px] font-bold rounded-lg border transition-all cursor-pointer text-center ${
                          formData.discountPercent === pct
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
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                    className="w-full bg-white border border-gray-250 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none flex-1 min-h-[68px]"
                    placeholder="Ghi chú thêm: giờ lấy đồ, số đo, yêu cầu chỉnh sửa, phụ kiện mượn kèm..."
                  />
                </div>
              </div>

                {/* Calculated price breakdown card */}
                {calculatedDays > 0 && calculatedTotal > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50/40 border border-orange-100/85 rounded-xl p-2.5 sm:p-3 text-xs text-orange-850 flex items-center justify-between gap-3 font-medium shadow-2xs">
                    <div className="min-w-0 flex-1 leading-snug">
                      <span className="font-extrabold text-orange-950">Báo giá tạm tính:</span>{' '}
                      <span>
                        {formData.selectedCameraIds.length} món trang phục &times;{' '}
                        {calculatedDays} ngày (Đã áp dụng giảm giá)
                      </span>
                    </div>
                    <div className="font-mono font-black text-sm sm:text-base text-orange-700 shrink-0 whitespace-nowrap text-right">
                      {calculatedTotal.toLocaleString()}&nbsp;đ
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 sm:pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddQuickModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-650 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleQuickBookingSubmit(undefined, true)}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Lưu & Xuất hóa đơn</span>
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-orange-600 text-white font-bold px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm hover:bg-orange-700 transition-all cursor-pointer text-center whitespace-nowrap shadow-sm"
              >
                Xác nhận đặt lịch
              </button>
            </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Quick Invoice Receipt Modal for BookingCalendar */}
      {quickReceiptContract && typeof document !== 'undefined' && createPortal(
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
                  <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">Hợp đồng {quickReceiptContract.contractCode}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 truncate">Lập lúc: {new Date(quickReceiptContract.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button
                onClick={() => setQuickReceiptContract(null)}
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
              <div id="calendar-contract-receipt-capture" className="bg-white p-3 sm:p-4 rounded-2xl space-y-3 font-sans text-gray-900 w-full box-border">
                {/* Visual Invoice Title for image export */}
                <div className="text-center space-y-1 border-b border-gray-200 pb-2.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-900 uppercase tracking-wide">
                    HÓA ĐƠN BÀN GIAO & THANH TOÁN
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-[10.5px] sm:text-[11px] text-gray-500 font-mono whitespace-nowrap">
                    <span>Mã HĐ: <strong className="text-orange-600 font-bold">{quickReceiptContract.contractCode}</strong></span>
                    <span className="text-gray-300 font-normal">•</span>
                    <span>Ngày lập: {new Date(quickReceiptContract.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                {/* Section 1: Customer details & Timings in Compact Layout */}
                <div className="bg-slate-50/80 p-2.5 sm:p-3 border border-slate-200/80 rounded-xl" style={{overflow: 'visible'}}>
                  {/* Customer Info, Timing & QR Code Row */}
                  <div className="flex flex-row flex-nowrap gap-2 sm:gap-3 items-start justify-between">
                    {/* Customer Info & Timings */}
                    <div className="space-y-1.5 min-w-0 flex-1 overflow-hidden">
                      <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">THÔNG TIN KHÁCH THUÊ</h4>
                      <div>
                        <p className="font-black text-gray-900 text-sm sm:text-base leading-tight truncate">{quickReceiptContract.customerName}</p>
                        <p className="text-[11px] sm:text-xs text-gray-600 font-mono font-bold mt-0.5">SĐT: {quickReceiptContract.customerPhone}</p>
                      </div>

                      {/* Thế chấp (ngay dưới SĐT) */}
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-lg text-amber-950 max-w-full">
                          <span className="text-[9.5px] font-extrabold text-amber-800 uppercase shrink-0">Thế chấp:</span>
                          <span className="text-[10.5px] font-bold font-mono text-gray-800 truncate">
                            {quickReceiptContract.customerDocType === 'Other'
                              ? (quickReceiptContract.customerDocNote?.trim() || 'Tài sản khác')
                              : `${renderDocTypeLabel(quickReceiptContract.customerDocType)}${
                                  quickReceiptContract.customerDocNote?.trim() && 
                                  !['Giữ CCCD gốc + 1.000.000đ', 'Giữ CCCD gốc', 'Giữ GPLX gốc', 'Giữ Hộ chiếu gốc', 'Đặt cọc tiền mặt'].includes(quickReceiptContract.customerDocNote.trim())
                                    ? ` (${quickReceiptContract.customerDocNote.trim()})`
                                    : ''
                                }`}
                          </span>
                        </div>
                      </div>

                      {/* Thời hạn thuê lồng ghép gọn gàng */}
                      <div className="bg-white/90 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Bắt đầu:</span>
                          <strong className="font-bold font-mono text-gray-900 whitespace-nowrap">{formatDMY(quickReceiptContract.startDate)}</strong>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Hạn trả:</span>
                          <strong className="font-bold font-mono text-orange-600 whitespace-nowrap">{formatDMY(quickReceiptContract.endDate)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Block on the Right */}
                    <div 
                      className="shrink-0 flex flex-col items-center bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200/90 w-[114px] sm:w-[126px]" 
                      style={{ borderRadius: '12px', boxShadow: 'none' }}
                    >
                      {/* Header row */}
                      <div className={`w-full flex items-center ${isExportingReceipt ? 'justify-center' : 'justify-between'} mb-1 px-0.5`}>
                        <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase text-gray-700 tracking-wider whitespace-nowrap">
                          QR THANH TOÁN
                        </span>
                        {!isExportingReceipt && (
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
                          if (!isExportingReceipt) {
                            setBankDraft(bankConfig);
                            setShowBankSettings(true);
                          }
                        }}
                        className={`w-full mt-1 pt-1 border-t border-dashed border-gray-200 flex flex-col items-center justify-center text-center ${!isExportingReceipt ? 'cursor-pointer hover:bg-orange-50/70 p-0.5 rounded-lg transition' : ''}`}
                        title="Bấm để cài đặt Số tài khoản & Tên tài khoản"
                      >
                        <div className="w-full flex items-center justify-center gap-0.5 flex-wrap leading-tight">
                          <span className="text-[8px] sm:text-[8.5px] font-bold text-gray-400 uppercase tracking-tight">STK:</span>
                          <span 
                            className="text-[9.5px] sm:text-[10.5px] font-black font-mono text-gray-900 tracking-tight select-all break-all"
                            title="Số tài khoản"
                          >
                            {bankConfig.accountNo?.trim() || 'Chưa nhập'}
                          </span>
                        </div>
                        <div className="w-full mt-0.5">
                          <span 
                            className="text-[8px] sm:text-[8.5px] font-extrabold uppercase text-gray-700 tracking-tight leading-tight line-clamp-1 truncate max-w-full block" 
                            title={bankConfig.accountName || 'Tên chủ tài khoản'}
                          >
                            {bankConfig.accountName?.trim() || '(Bấm thêm tên)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Items Detail - ONLY item name, no price */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">DANH SÁCH TRANG PHỤC & PHỤ KIỆN</h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                    {quickReceiptContract.items.map((i, idx) => {
                      const matchedCam = cameras.find(c => c.id === i.cameraId || c.name.toLowerCase() === i.cameraName.toLowerCase());
                      const displaySize = i.size || matchedCam?.size;
                      const displayColor = i.color || matchedCam?.color;
                      return (
                        <div key={idx} className="p-2.5 px-3.5 flex items-center text-xs sm:text-sm bg-white">
                          <div className="font-bold text-gray-900 truncate flex-1 min-w-0 flex items-center gap-2">
                            {matchedCam?.image ? (
                              <img src={matchedCam.image} alt="" className="w-6 h-7 rounded object-cover border border-gray-200 shrink-0" />
                            ) : (
                              <span className="text-orange-500 text-xs shrink-0">👗</span>
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
                              <span className="text-gray-500 font-mono text-[11px] font-medium">({i.quantity} món)</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Financial Summary Block */}
                <div className="bg-gradient-to-br from-orange-50/60 to-amber-50/40 border border-orange-200/80 p-3.5 sm:p-4 rounded-xl space-y-2.5">
                  {quickReceiptContract.discountPercent ? (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600 font-medium">Giảm giá tự động:</span>
                      <span className="font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs shrink-0">-{quickReceiptContract.discountPercent}%</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                    <span className="text-gray-700 font-semibold">Tổng tiền thuê dự kiến:</span>
                    <span className="font-black text-gray-900 text-sm sm:text-base font-mono shrink-0">{quickReceiptContract.totalPrice.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/60 pt-2 text-gray-700 gap-2">
                    <span>Trị giá cọc thế chấp (VNĐ cọc):</span>
                    <span className="font-bold text-gray-800 font-mono shrink-0">{quickReceiptContract.depositAmount.toLocaleString()}đ</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/60 pt-2 text-gray-700 gap-2">
                    <span className="font-medium text-amber-900">Khách cọc đặt giữ đồ trước ({quickReceiptContract.totalPrice > 0 ? Math.round((quickReceiptContract.paidAmount / quickReceiptContract.totalPrice) * 100) : 0}%):</span>
                    <span className="font-bold text-amber-700 font-mono shrink-0">{quickReceiptContract.paidAmount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-200/60 pt-2 text-gray-700 gap-2">
                    <span>Thực tế khách đã thanh toán:</span>
                    <span className="font-bold text-gray-400 font-mono shrink-0">0đ <span className="text-[10px] font-normal">(Chưa cọc)</span></span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm border-t border-orange-300 pt-2 font-bold text-gray-900 gap-2">
                    <span>Còn lại cần thanh toán khi nhận đồ:</span>
                    <span className="text-rose-600 text-sm sm:text-base font-black font-mono shrink-0">{(quickReceiptContract.totalPrice - quickReceiptContract.paidAmount).toLocaleString()}đ</span>
                  </div>
                </div>

                {/* Section: Lưu ý & Quy định thuê trang phục (Có thể chỉnh sửa) */}
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-wide">
                      <ShieldAlert className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Lưu ý & Quy định thuê trang phục</span>
                    </div>
                    {!isExportingReceipt && (
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
            </div>

            {/* Print Simulate buttons - Centered */}
            <div className="bg-gray-50 px-4 sm:px-5 py-3.5 flex flex-wrap gap-2.5 justify-center items-center border-t border-gray-150 shrink-0">
              <button
                type="button"
                className="bg-white hover:bg-gray-100 border border-gray-250 text-gray-750 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-4xs min-h-[38px] whitespace-nowrap"
                onClick={() => handlePrintReceipt('calendar-contract-receipt-capture')}
                title="In hóa đơn hợp đồng bản cứng ra máy in"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>In Hóa Đơn (Bản cứng)</span>
              </button>

              <button
                type="button"
                disabled={isExportingReceipt}
                onClick={() => handleExportReceiptImage('calendar-contract-receipt-capture', `${quickReceiptContract.contractCode}_thong_tin_thue.png`)}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-4xs border border-transparent min-h-[38px]"
              >
                <ImageIcon className="w-4 h-4" /> {isExportingReceipt ? 'Đang tạo...' : 'Xuất ảnh Hợp đồng'}
              </button>

              <button
                type="button"
                onClick={() => setQuickReceiptContract(null)}
                className="bg-gray-800 text-white hover:bg-gray-900 border border-transparent font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer text-center min-h-[38px]"
              >
                Đóng
              </button>
            </div>
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
              Bạn có chắc chắn muốn xóa vĩnh viễn hợp đồng này? Hành động này sẽ cập nhật lại trạng thái trang phục và hồ sơ khách hàng, bản ghi này sẽ bị gỡ bỏ hoàn toàn khỏi hệ thống.
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
            <div className="flex items-center gap-2.5 text-amber-600">
              <span className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </span>
              <h4 className="font-bold text-base text-gray-900">Trùng lịch / Cảnh báo</h4>
            </div>
            <p className="text-sm text-gray-650 leading-relaxed font-sans">{customAlertMessage}</p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCustomAlertMessage(null)}
                className="bg-amber-500 text-white font-medium px-5 py-2 rounded-xl text-sm hover:bg-amber-600 transition-all cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Bank & QR Settings Modal */}
      {showBankSettings && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-fade-in">
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

      {/* Image Zoom Preview Modal */}
      {previewImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-up border border-gray-150 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <h4 className="text-sm font-extrabold text-gray-900 truncate pr-2 flex items-center gap-1.5">
                <span>👗</span>
                <span className="truncate">{previewImage.title}</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition flex items-center justify-center cursor-pointer text-base"
              >
                ✕
              </button>
            </div>
            <div className="p-3 overflow-auto flex items-center justify-center bg-slate-900/5">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

