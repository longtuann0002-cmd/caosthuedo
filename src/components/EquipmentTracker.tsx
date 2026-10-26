import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, RentalContract } from '../types';
import MoneyInput from './MoneyInput';
import { DressIcon } from './DressIcon';
import { Search, Plus, Filter, Camera as CameraIcon, CheckCircle, Flame, Server, ShieldCheck, RefreshCw, Trash2, Edit2, ChevronLeft, ChevronRight, Download, FileSpreadsheet, Image as ImageIcon, Upload, Link as LinkIcon, Sparkles, Clock, ArrowLeft, ArrowRight, GripVertical, Layers, LayoutGrid, List, X } from 'lucide-react';
import { getInitialTieredPrices } from '../utils/pricing';
import { matchCamera } from '../utils/searchUtils';
import { useScrollLock } from '../utils/useScrollLock';

export interface OutfitGroupItem {
  groupKey: string;
  representativeCam: Camera;
  cleanName: string;
  baseSerial: string;
  shortName: string;
  category: Camera['category'];
  gender: string;
  image: string;
  description: string;
  items: Camera[];
  totalPurchase: number;
  totalRevenue: number;
  overallRoiPercent: number | null;
  isBreakeven: boolean;
  readyCount: number;
  laundryCount: number;
  mendingCount: number;
  rentedCount: number;
  maintenanceCount: number;
}

export const getOutfitGroupKey = (cam: Camera): string => {
  if (cam.category === 'Printer' || cam.isPrinter) return `printer-${cam.id}`;
  if (cam.shortName && cam.shortName.trim()) {
    return `sn-${cam.shortName.trim().toLowerCase()}`;
  }
  const baseSerial = cam.serialNumber
    ? cam.serialNumber.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().toLowerCase()
    : '';
  if (baseSerial) return `ser-${baseSerial}`;

  const cleanName = cam.name
    ? cam.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim().toLowerCase()
    : '';
  if (cleanName) return `name-${cleanName}`;

  return cam.id;
};

interface EquipmentTrackerProps {
  cameras: Camera[];
  onAddCamera: (camera: Camera) => void;
  onUpdateCamera: (camera: Camera) => void;
  onDeleteCamera: (id: string) => void;
  onReorderCameras?: (cameras: Camera[]) => void;
  currentUserRole?: string;
  contracts?: RentalContract[];
  initialSearchQuery?: string;
  systemDate?: string;
}

export default function EquipmentTracker({
  cameras,
  onAddCamera,
  onUpdateCamera,
  onDeleteCamera,
  onReorderCameras,
  currentUserRole,
  contracts = [],
  initialSearchQuery,
  systemDate = '2026-06-17'
}: EquipmentTrackerProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');
  const [cleaningFilter, setCleaningFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grouped' | 'individual'>(() => {
    return (localStorage.getItem('outfit_inventory_view_mode') as 'grouped' | 'individual') || 'grouped';
  });

  const handleSetViewMode = (mode: 'grouped' | 'individual') => {
    setViewMode(mode);
    try {
      localStorage.setItem('outfit_inventory_view_mode', mode);
    } catch {}
  };

  const [mobileLayout, setMobileLayout] = useState<'1-col' | '2-col'>(() => {
    return (localStorage.getItem('outfit_mobile_layout') as '1-col' | '2-col') || '2-col';
  });

  const handleSetMobileLayout = (layout: '1-col' | '2-col') => {
    setMobileLayout(layout);
    try {
      localStorage.setItem('outfit_mobile_layout', layout);
    } catch {}
  };

  const [selectedGroupSizes, setSelectedGroupSizes] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Detail Bottom Sheet Modal state
  const [detailGroupKey, setDetailGroupKey] = useState<string | null>(null);
  const [detailCameraId, setDetailCameraId] = useState<string | null>(null);

  // Lock body scroll whenever modal is open
  useScrollLock(Boolean(showAddModal || cameraToDelete || detailGroupKey || detailCameraId));
  const [expandedPrices, setExpandedPrices] = useState<Record<string, boolean>>({});

  const togglePricingExpanded = (id: string) => {
    setExpandedPrices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reordering & Drag-and-Drop states
  const [draggedCamId, setDraggedCamId] = useState<string | null>(null);
  const [dragOverCamId, setDragOverCamId] = useState<string | null>(null);

  const handleMoveCamera = (camId: string, direction: 'left' | 'right') => {
    const currentIndex = cameras.findIndex(c => c.id === camId);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= cameras.length) return;

    const newCameras = [...cameras];
    const [moved] = newCameras.splice(currentIndex, 1);
    newCameras.splice(targetIndex, 0, moved);

    if (onReorderCameras) {
      onReorderCameras(newCameras);
    }
  };

  const handleDragStart = (e: React.DragEvent, camId: string) => {
    e.dataTransfer.setData('text/plain', camId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCamId(camId);
  };

  const handleDragOver = (e: React.DragEvent, camId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCamId !== camId) {
      setDragOverCamId(camId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCamId: string) => {
    e.preventDefault();
    const sourceId = draggedCamId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetCamId) {
      setDraggedCamId(null);
      setDragOverCamId(null);
      return;
    }

    const sourceIndex = cameras.findIndex(c => c.id === sourceId);
    const targetIndex = cameras.findIndex(c => c.id === targetCamId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newCameras = [...cameras];
      const [moved] = newCameras.splice(sourceIndex, 1);
      newCameras.splice(targetIndex, 0, moved);

      if (onReorderCameras) {
        onReorderCameras(newCameras);
      }
    }

    setDraggedCamId(null);
    setDragOverCamId(null);
  };

  const handleDragEnd = () => {
    setDraggedCamId(null);
    setDragOverCamId(null);
  };

  // Form states including tiered pricing fields & fashion attributes
  const [formState, setFormState] = useState({
    name: '',
    shortName: '',
    category: 'Váy' as Camera['category'],
    isPrinter: false,
    purchasePrice: 0,
    dailyRate: 0,
    price1Day: 0,
    price2Days: 0,
    price3Days: 0,
    price4DaysPlus: 0,
    depositAmount: 0,
    status: 'Available' as Camera['status'],
    serialNumber: '',
    description: '',
    image: '',
    size: 'M',
    selectedSizes: ['M'] as string[],
    splitBySize: false,
    sizeColorMap: {} as Record<string, string>, // màu riêng cho từng size khi tách
    sizeImageMap: {} as Record<string, string>, // ảnh riêng cho từng size khi tách
    sizeQtyMap: {} as Record<string, number>, // số lượng chiếc cho từng size
    sizeColorVariants: {} as Record<string, string[]>, // màu riêng cho từng chiếc trong cùng size
    color: '',
    gender: 'Nữ' as 'Nữ' | 'Nam' | 'Unisex',
    cleaningStatus: 'Clean' as 'Clean' | 'Laundry' | 'Mending',
    measurements: '',
    includedAccessories: '',
    brand: '',
    type: '',
    printPrice1To2: 0,
    printPrice3To9: 0,
    printPrice10Plus: 0,
  });

  const filteredCameras = useMemo(() => {
    const result = cameras.filter(c => {
      const query = searchQuery.trim();
      const matchesSearch = matchCamera(c, query).matched;

      const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter || (categoryFilter === 'Váy' && (c.category === 'Váy' || c.category === 'Váy cưới' || c.category === 'Đầm'));
      const matchesStatus = statusFilter === 'ALL' || (
        statusFilter === 'Available'
          ? (c.status === 'Available' && (c.cleaningStatus === 'Clean' || !c.cleaningStatus))
          : statusFilter === 'Maintenance'
          ? (c.status === 'Maintenance' || c.cleaningStatus === 'Laundry' || c.cleaningStatus === 'Mending')
          : c.status === statusFilter
      );
      const matchesSize = sizeFilter === 'ALL' || (
        sizeFilter === 'Freesize'
          ? (c.availableSizes?.some(s => /free|fs/i.test(s)) || (c.size && /free|fs/i.test(c.size)))
          : (c.availableSizes?.some(s => s.toUpperCase() === sizeFilter.toUpperCase()) || (c.size && c.size.toUpperCase().includes(sizeFilter.toUpperCase())))
      );
      const matchesCleaning = cleaningFilter === 'ALL' || c.cleaningStatus === cleaningFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesSize && matchesCleaning;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      return result.sort((a, b) => matchCamera(b, q).score - matchCamera(a, q).score);
    }

    return result;
  }, [cameras, searchQuery, categoryFilter, statusFilter, sizeFilter, cleaningFilter]);

  // Calculate dynamic device count for each category
  // Gợi ý những giá trị đã từng nhập trước đó cho 4 trường chi tiết
  const detailSuggestions = useMemo(() => {
    const measurementsSet = new Set<string>();
    const accessoriesSet = new Set<string>();
    const typeSet = new Set<string>();
    const brandSet = new Set<string>();

    // 1. Trích xuất từ toàn bộ danh sách trang phục hiện có trong kho
    cameras.forEach(cam => {
      if (cam.measurements?.trim()) measurementsSet.add(cam.measurements.trim());
      if (cam.includedAccessories?.trim()) {
        accessoriesSet.add(cam.includedAccessories.trim());
        cam.includedAccessories.split(/[,+]/).forEach(item => {
          const t = item.trim();
          if (t.length > 1) accessoriesSet.add(t);
        });
      }
      if (cam.type?.trim()) {
        typeSet.add(cam.type.trim());
        cam.type.split(/[,+]/).forEach(item => {
          const t = item.trim();
          if (t.length > 1) typeSet.add(t);
        });
      }
      if (cam.brand?.trim()) brandSet.add(cam.brand.trim());
    });

    // 2. Lấy thêm từ lịch sử localStorage
    try {
      const getLocal = (key: string): string[] => {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : [];
      };
      getLocal('caos_history_measurements').forEach(x => { if (x?.trim()) measurementsSet.add(x.trim()); });
      getLocal('caos_history_accessories').forEach(x => { if (x?.trim()) accessoriesSet.add(x.trim()); });
      getLocal('caos_history_types').forEach(x => { if (x?.trim()) typeSet.add(x.trim()); });
      getLocal('caos_history_brands').forEach(x => { if (x?.trim()) brandSet.add(x.trim()); });
    } catch {
      // ignore
    }

    return {
      measurements: Array.from(measurementsSet).filter(Boolean),
      includedAccessories: Array.from(accessoriesSet).filter(Boolean),
      type: Array.from(typeSet).filter(Boolean),
      brand: Array.from(brandSet).filter(Boolean),
    };
  }, [cameras]);

  const categoryCounts = useMemo(() => {
    return {
      ALL: cameras.length,
      'Váy': cameras.filter(c => c.category === 'Váy' || c.category === 'Váy cưới' || c.category === 'Đầm').length,
      'Áo dài': cameras.filter(c => c.category === 'Áo dài').length,
      'Dạ hội': cameras.filter(c => c.category === 'Dạ hội').length,
      'Concept': cameras.filter(c => c.category === 'Concept').length,
      'Phụ kiện': cameras.filter(c => c.category === 'Phụ kiện').length,
      'Chụp ảnh': cameras.filter(c => c.category === 'Chụp ảnh').length,
      'Khác': cameras.filter(c => c.category === 'Khác').length,
    } as Record<string, number>;
  }, [cameras]);

  // Tính tổng doanh thu tích luỹ của từng camera từ contracts
  const cameraRevenueMap = useMemo(() => {
    const revMap: Record<string, number> = {};
    contracts.forEach(contract => {
      if (contract.status === 'Cancelled') return;
      contract.items.forEach(item => {
        const estPrice = (item.dailyRate || 0) * (item.quantity || 1);
        const discountPct = contract.discountPercent || 0;
        const discountedEst = Math.round(estPrice * (1 - discountPct / 100));
        let revenue = discountedEst;
        if (contract.totalPrice > 0 && contract.paidAmount !== undefined) {
          revenue = Math.round((discountedEst / contract.totalPrice) * contract.paidAmount);
        }
        revMap[item.cameraId] = (revMap[item.cameraId] || 0) + revenue;
      });
    });
    return revMap;
  }, [contracts]);

  const filteredOutfitGroups = useMemo<OutfitGroupItem[]>(() => {
    const groupsMap = new Map<string, OutfitGroupItem>();
    const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Freesize', 'FS'];

    filteredCameras.forEach(cam => {
      const key = getOutfitGroupKey(cam);
      if (!groupsMap.has(key)) {
        const cleanName = cam.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || cam.name;
        const baseSerial = cam.serialNumber.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim() || cam.serialNumber;

        groupsMap.set(key, {
          groupKey: key,
          representativeCam: cam,
          cleanName,
          baseSerial,
          shortName: cam.shortName || '',
          category: cam.category,
          gender: cam.gender || 'Nữ',
          image: cam.image,
          description: cam.description || '',
          items: [],
          totalPurchase: 0,
          totalRevenue: 0,
          overallRoiPercent: null,
          isBreakeven: false,
          readyCount: 0,
          laundryCount: 0,
          mendingCount: 0,
          rentedCount: 0,
          maintenanceCount: 0,
        });
      }

      groupsMap.get(key)!.items.push(cam);
    });

    return Array.from(groupsMap.values()).map(group => {
      // Sort items by size
      group.items.sort((a, b) => {
        const sA = (a.size || 'FS').toUpperCase();
        const sB = (b.size || 'FS').toUpperCase();
        const iA = SIZE_ORDER.indexOf(sA);
        const iB = SIZE_ORDER.indexOf(sB);
        return (iA < 0 ? 99 : iA) - (iB < 0 ? 99 : iB);
      });

      const first = group.items[0];
      if (first) {
        group.image = first.image || group.image;
        group.gender = first.gender || group.gender;
      }

      group.readyCount = group.items.filter(c => c.status === 'Available' && (!c.cleaningStatus || c.cleaningStatus === 'Clean')).length;
      group.laundryCount = group.items.filter(c => c.cleaningStatus === 'Laundry').length;
      group.mendingCount = group.items.filter(c => c.cleaningStatus === 'Mending').length;
      group.rentedCount = group.items.filter(c => c.status === 'Rented').length;
      group.maintenanceCount = group.items.filter(c => c.status === 'Maintenance').length;

      group.totalPurchase = group.items.reduce((sum, c) => sum + (c.purchasePrice || 0), 0);
      group.totalRevenue = group.items.reduce((sum, c) => sum + (cameraRevenueMap[c.id] || 0), 0);
      group.overallRoiPercent = group.totalPurchase > 0 ? Math.round((group.totalRevenue / group.totalPurchase) * 100) : null;
      group.isBreakeven = group.overallRoiPercent !== null && group.overallRoiPercent >= 100;

      return group;
    });
  }, [filteredCameras, cameraRevenueMap]);

  // Pagination Configuration
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // default 10 outfits per page (optimizes 2-col mobile & 5-col desktop)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sizeFilter, cleaningFilter, viewMode]);

  const totalPages = viewMode === 'grouped'
    ? (Math.ceil(filteredOutfitGroups.length / itemsPerPage) || 1)
    : (Math.ceil(filteredCameras.length / itemsPerPage) || 1);

  const paginatedCameras = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCameras.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCameras, currentPage, itemsPerPage]);

  const paginatedOutfitGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOutfitGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOutfitGroups, currentPage, itemsPerPage]);

  const detailGroup = useMemo(() => {
    if (!detailGroupKey) return null;
    return filteredOutfitGroups.find(g => g.groupKey === detailGroupKey) || null;
  }, [detailGroupKey, filteredOutfitGroups]);

  const detailCamera = useMemo(() => {
    if (!detailCameraId) return null;
    return cameras.find(c => c.id === detailCameraId) || null;
  }, [detailCameraId, cameras]);

  const handleMoveGroup = (groupIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? groupIndex - 1 : groupIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredOutfitGroups.length) return;

    const currentGroup = filteredOutfitGroups[groupIndex];
    const targetGroup = filteredOutfitGroups[targetIndex];

    const currentCamIds = currentGroup.items.map(c => c.id);
    const targetCamIds = targetGroup.items.map(c => c.id);

    const targetFirstIndex = cameras.findIndex(c => targetCamIds.includes(c.id));
    if (targetFirstIndex === -1) return;

    const newCameras = cameras.filter(c => !currentCamIds.includes(c.id));
    newCameras.splice(targetFirstIndex, 0, ...currentGroup.items);

    if (onReorderCameras) {
      onReorderCameras(newCameras);
    }
  };

  const handleAddSizeToGroup = (group: OutfitGroupItem) => {
    const rep = group.representativeCam;
    const existingSizes = group.items.map(i => (i.size || '').toUpperCase()).filter(Boolean);
    
    const candidateSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Freesize'];
    const nextSize = candidateSizes.find(s => !existingSizes.includes(s.toUpperCase())) || 'XL';
    
    const p1 = rep.price1Day ?? rep.dailyRate;
    const p2_daily = Math.max(0, p1 - 30000);
    const p4_daily = Math.max(0, p1 - 40000);
    const p3_daily = p4_daily;

    setFormState({
      name: group.cleanName,
      shortName: group.shortName,
      category: group.category,
      isPrinter: false,
      purchasePrice: rep.purchasePrice || 500000,
      dailyRate: rep.dailyRate,
      price1Day: p1,
      price2Days: Math.round((rep.price2Days ?? ((p1 + p2_daily) / 2)) * 2),
      price3Days: Math.round((rep.price3Days ?? ((p1 + p2_daily + p3_daily) / 3)) * 3),
      price4DaysPlus: rep.price4DaysPlus ?? p4_daily,
      depositAmount: rep.depositAmount || 1500000,
      status: 'Available',
      serialNumber: `${group.baseSerial}-${nextSize === 'Freesize' ? 'FS' : nextSize}`,
      description: rep.description || '',
      image: rep.image || '',
      size: nextSize,
      selectedSizes: [nextSize],
      splitBySize: false,
      sizeColorMap: { [nextSize]: rep.color || '' },
      sizeImageMap: {},
      sizeQtyMap: {},
      sizeColorVariants: {},
      color: rep.color || '',
      gender: (rep.gender as any) || 'Nữ',
      cleaningStatus: 'Clean',
      measurements: rep.measurements || '',
      includedAccessories: rep.includedAccessories || '',
      brand: rep.brand || '',
      type: rep.type || '',
      printPrice1To2: 40000,
      printPrice3To9: 35000,
      printPrice10Plus: 33000,
    });
    setEditingCamera(null);
    setShowAddModal(true);
  };

  const handleOpenAddModal = () => {
    setFormState({
      name: '',
      shortName: '',
      category: 'Váy',
      isPrinter: false,
      purchasePrice: 0,
      dailyRate: 0,
      price1Day: 0,
      price2Days: 0,
      price3Days: 0,
      price4DaysPlus: 0,
      depositAmount: 0,
      status: 'Available',
      serialNumber: '',
      description: '',
      image: '',
      size: 'M',
      selectedSizes: ['M'],
      splitBySize: false,
      sizeColorMap: {},
      sizeImageMap: {},
      sizeQtyMap: {},
      sizeColorVariants: {},
      color: '',
      gender: 'Nữ',
      cleaningStatus: 'Clean',
      measurements: '',
      includedAccessories: '',
      brand: '',
      type: '',
      printPrice1To2: 0,
      printPrice3To9: 0,
      printPrice10Plus: 0,
    });
    setEditingCamera(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (cam: Camera) => {
    const p1 = cam.price1Day ?? cam.dailyRate;
    const p2_daily = Math.max(0, p1 - 30000);
    const p4_daily = Math.max(0, p1 - 40000);
    const p3_daily = p4_daily;

    const rawSizes = cam.availableSizes && cam.availableSizes.length > 0
      ? cam.availableSizes
      : (cam.size ? cam.size.split(',').map(s => s.trim()).filter(Boolean) : ['M']);

    setFormState({
      name: cam.name,
      shortName: cam.serialNumber || cam.shortName || '',
      category: cam.category,
      isPrinter: cam.category === 'Printer' || Boolean(cam.isPrinter),
      purchasePrice: cam.purchasePrice ?? (cam.depositAmount ? cam.depositAmount : cam.dailyRate * 5),
      dailyRate: cam.dailyRate,
      price1Day: p1,
      price2Days: Math.round((cam.price2Days ?? ((p1 + p2_daily) / 2)) * 2),
      price3Days: Math.round((cam.price3Days ?? ((p1 + p2_daily + p3_daily) / 3)) * 3),
      price4DaysPlus: cam.price4DaysPlus ?? p4_daily,
      depositAmount: cam.depositAmount ?? (cam.category === 'Printer' ? 1000000 : 1500000),
      status: cam.status,
      serialNumber: cam.serialNumber,
      description: cam.description || '',
      image: cam.image || '',
      size: cam.size || 'M',
      selectedSizes: rawSizes.length > 0 ? rawSizes : ['M'],
      splitBySize: false,
      sizeColorMap: (rawSizes.length > 0 ? rawSizes : ['M']).reduce((acc, s) => ({ ...acc, [s]: cam.color || '' }), {}),
      sizeImageMap: {},
      sizeQtyMap: {},
      sizeColorVariants: {},
      color: cam.color || '',
      gender: (cam.gender as any) || 'Nữ',
      cleaningStatus: (cam.cleaningStatus as any) || 'Clean',
      measurements: cam.measurements || '',
      includedAccessories: cam.includedAccessories || '',
      brand: cam.brand || '',
      type: cam.type || '',
      printPrice1To2: cam.printPrice1To2 ?? 40000,
      printPrice3To9: cam.printPrice3To9 ?? 35000,
      printPrice10Plus: cam.printPrice10Plus ?? 33000,
    });
    setEditingCamera(cam);
    setShowAddModal(true);
  };

  const handleCycleCleaningStatus = (cam: Camera, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cycleMap: Record<string, Camera['cleaningStatus']> = {
      'Clean': 'Laundry',
      'Laundry': 'Mending',
      'Mending': 'Clean'
    };
    const current = cam.cleaningStatus || 'Clean';
    const nextCleaning = cycleMap[current] || 'Clean';
    onUpdateCamera({
      ...cam,
      cleaningStatus: nextCleaning
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveShortName = (formState.serialNumber || formState.shortName || '').trim();
    if (!formState.name || !formState.serialNumber) {
      setValidationError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)!');
      return;
    }

    // Default image fallback based on category for fashion
    const categoryDefaultImages: Record<string, string> = {
      'Áo dài': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
      'Concept': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600',
      'Dạ hội': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600',
      'Chụp ảnh': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      'Phụ kiện': 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600',
      'Khác': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
    };
    // Lưu lịch sử các giá trị đã nhập để gợi ý lần sau
    try {
      const saveHistory = (key: string, val?: string) => {
        if (!val || !val.trim()) return;
        const current: string[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = [val.trim(), ...current.filter(item => item !== val.trim())].slice(0, 30);
        localStorage.setItem(key, JSON.stringify(updated));
      };
      saveHistory('caos_history_measurements', formState.measurements);
      saveHistory('caos_history_accessories', formState.includedAccessories);
      saveHistory('caos_history_types', formState.type);
      saveHistory('caos_history_brands', formState.brand);
    } catch {
      // ignore
    }

    const imageRef = formState.image || categoryDefaultImages[formState.category] || 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600';
    
    const sizesToSave = formState.selectedSizes.length > 0 ? formState.selectedSizes : ['M'];
    const sizeString = sizesToSave.join(', ');

    // Chia 2 cho giá ngày thứ 2, chia 3 cho ngày thứ 3 để có đơn giá/ngày đúng
    const savedFormState = {
      ...formState,
      shortName: effectiveShortName,
      size: sizeString,
      availableSizes: sizesToSave,
      isPrinter: formState.category === 'Printer',
      price2Days: formState.price2Days / 2,
      price3Days: formState.price3Days / 3
    };

    if (editingCamera) {
      if (sizesToSave.length > 1) {
        // Người dùng chọn nhiều size khi sửa -> Cập nhật chiếc hiện tại với size đầu tiên và tự động tạo thêm sản phẩm mới cho các size còn lại
        const firstSize = sizesToSave[0];
        const firstSizeCode = firstSize === 'Freesize' ? 'FS' : firstSize;
        const rawSerial = (formState.serialNumber || `SP-${Date.now().toString().slice(-4)}`).trim();
        const baseSerial = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || rawSerial;
        const cleanName = savedFormState.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || savedFormState.name;
        const firstColor = (formState.sizeColorMap[firstSize] && formState.sizeColorMap[firstSize].trim()) || savedFormState.color || '';
        const firstImg = (formState.sizeImageMap[firstSize] && formState.sizeImageMap[firstSize].trim()) || imageRef;

        onUpdateCamera({
          ...editingCamera,
          ...savedFormState,
          name: `${cleanName} (${firstSize === 'Freesize' ? 'Freesize' : `Size ${firstSize}`})`,
          serialNumber: `${baseSerial}-${firstSizeCode}`,
          size: firstSize,
          availableSizes: [firstSize],
          color: firstColor,
          image: firstImg
        });

        // Tạo sản phẩm riêng cho các size còn lại
        sizesToSave.slice(1).forEach((sz, idx) => {
          const sizeCode = sz === 'Freesize' ? 'FS' : sz;
          const sizeColor = (formState.sizeColorMap[sz] && formState.sizeColorMap[sz].trim()) || savedFormState.color || '';
          const sizeImg = (formState.sizeImageMap[sz] && formState.sizeImageMap[sz].trim()) || imageRef;
          onAddCamera({
            ...savedFormState,
            id: `outfit-${Date.now()}-${idx + 1}`,
            name: `${cleanName} (${sz === 'Freesize' ? 'Freesize' : `Size ${sz}`})`,
            serialNumber: `${baseSerial}-${sizeCode}`,
            size: sz,
            availableSizes: [sz],
            color: sizeColor,
            image: sizeImg
          });
        });
      } else {
        const singleSize = sizesToSave[0] || 'Freesize';
        const rawSerial = (formState.serialNumber || `SP-${Date.now().toString().slice(-4)}`).trim();
        const cleanName = savedFormState.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || savedFormState.name;
        const sizeColor = (formState.sizeColorMap[singleSize] && formState.sizeColorMap[singleSize].trim()) || savedFormState.color || '';
        const sizeImg = (formState.sizeImageMap[singleSize] && formState.sizeImageMap[singleSize].trim()) || imageRef;

        onUpdateCamera({
          ...editingCamera,
          ...savedFormState,
          name: `${cleanName} (${singleSize === 'Freesize' ? 'Freesize' : `Size ${singleSize}`})`,
          serialNumber: rawSerial,
          size: singleSize,
          availableSizes: [singleSize],
          color: sizeColor,
          image: sizeImg
        });
      }
    } else {
      // New: Tự động tách thành từng sản phẩm riêng nếu chọn từ 2 size trở lên
      if (sizesToSave.length > 1) {
        const rawSerial = (formState.serialNumber || `SP-${Date.now().toString().slice(-4)}`).trim();
        const baseSerial = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || rawSerial;
        let globalIdx = 0;
        sizesToSave.forEach((sz) => {
          const sizeCode = sz === 'Freesize' ? 'FS' : sz;
          const sizeSpecificImg = (formState.sizeImageMap[sz] && formState.sizeImageMap[sz].trim()) || imageRef;
          const qty = formState.sizeQtyMap[sz] || 1;
          const colorVariants = formState.sizeColorVariants[sz] || [(formState.sizeColorMap[sz] || savedFormState.color || '')];
          for (let q = 0; q < qty; q++) {
            const pieceColor = (colorVariants[q] !== undefined ? colorVariants[q] : colorVariants[0]) || savedFormState.color || '';
            const suffix = qty > 1 ? `${baseSerial}-${sizeCode}-${q + 1}` : `${baseSerial}-${sizeCode}`;
            const newCam: Camera = {
              ...savedFormState,
              id: `outfit-${Date.now()}-${globalIdx}`,
              name: `${savedFormState.name} (${sz === 'Freesize' ? 'Freesize' : `Size ${sz}`})`,
              serialNumber: suffix,
              size: sz,
              availableSizes: [sz],
              color: pieceColor,
              image: sizeSpecificImg
            };
            onAddCamera(newCam);
            globalIdx++;
          }
        });
      } else {
        // Chỉ chọn 1 size duy nhất (VD: Freesize hoặc Size M)
        const singleSize = sizesToSave[0] || 'Freesize';
        const rawSerial = (formState.serialNumber || `SP-${Date.now().toString().slice(-4)}`).trim();
        const sizeColor = (formState.sizeColorMap[singleSize] && formState.sizeColorMap[singleSize].trim()) || savedFormState.color || '';
        const sizeSpecificImg = (formState.sizeImageMap[singleSize] && formState.sizeImageMap[singleSize].trim()) || imageRef;
        const singleQty = formState.sizeQtyMap[singleSize] || 1;
        const singleColorVariants = formState.sizeColorVariants[singleSize] || [sizeColor];
        for (let q = 0; q < singleQty; q++) {
          const pieceColor = (singleColorVariants[q] !== undefined ? singleColorVariants[q] : singleColorVariants[0]) || sizeColor;
          const suffix = singleQty > 1 ? `${rawSerial}-${q + 1}` : rawSerial;
          const newCam: Camera = {
            id: `outfit-${Date.now()}-${q}`,
            ...savedFormState,
            serialNumber: suffix,
            size: singleSize,
            availableSizes: [singleSize],
            color: pieceColor,
            image: sizeSpecificImg
          };
          onAddCamera(newCam);
        }
      }
    }
    setShowAddModal(false);
    setValidationError(null);
  };

  const toggleMaintenance = (cam: Camera) => {
    const updatedStatus = cam.status === 'Maintenance' ? 'Available' : 'Maintenance';
    onUpdateCamera({
      ...cam,
      status: updatedStatus
    });
  };

  const handleExportCSV = () => {
    // UTF-8 BOM to prevent font error in Excel for Vietnamese characters
    const BOM = '\uFEFF';
    
    // CSV Header
    const headers = ['Mã Hệ Thống', 'Tên Trang Phục', 'Tên Viết Tắt', 'Danh Mục', 'Kích Cỡ', 'Màu Sắc', 'Dành Cho', 'Mã Tag (S/N)', 'Giá Thuê/Ngày (VND)', 'Trạng Thái Thuê', 'Tình Trạng Vệ Sinh', 'Mô Tả'];
    
    // Rows using filteredCameras
    const rows = filteredCameras.map(cam => {
      let statusVN = cam.status === 'Available' ? 'Sẵn sàng' : cam.status === 'Rented' ? 'Đang thuê' : 'Đang bảo dưỡng/giặt';
      let cleaningVN = cam.cleaningStatus === 'Clean' ? 'Đã giặt sạch' : cam.cleaningStatus === 'Laundry' ? 'Đang giặt hấp' : 'Đang sửa may';

      return [
        cam.id,
        `"${cam.name.replace(/"/g, '""')}"`,
        `"${cam.shortName.replace(/"/g, '""')}"`,
        cam.category,
        cam.size || 'Freesize',
        `"${(cam.color || '').replace(/"/g, '""')}"`,
        cam.gender || 'Nữ',
        `"${cam.serialNumber.replace(/"/g, '""')}"`,
        cam.dailyRate,
        statusVN,
        cleaningVN,
        `"${(cam.description || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_tu_do_trang_phuc_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and filter tools */}
      <div className="bg-white border border-gray-150 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          <div className="space-y-0.5">
            <h2 className="text-[15px] sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 select-none">
              <DressIcon className="text-orange-600 w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" /> Quản Lý Kho Trang Phục & Tủ Đồ Cho Thuê
            </h2>
            <p className="text-[11.5px] sm:text-xs text-gray-500 leading-normal">
              Theo dõi tình trạng sẵn sàng của áo dài, cổ phục, concept chụp ảnh, đầm dạ hội và phụ kiện cho thuê, kích cỡ và quy trình giặt hấp bảo dưỡng.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            {/* View Mode Toggle: Gộp theo mẫu vs Tách từng chiếc */}
            <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg sm:rounded-xl border border-gray-250 shadow-3xs">
              <button
                type="button"
                onClick={() => handleSetViewMode('grouped')}
                className={`px-2.5 py-1.5 rounded-md sm:rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
                title="Gộp các trang phục cùng mẫu / cùng mã thành 1 thẻ gọn gàng"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Gộp mẫu ({filteredOutfitGroups.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetViewMode('individual')}
                className={`px-2.5 py-1.5 rounded-md sm:rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'individual'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
                title="Hiển thị tách rời từng chiếc / từng size riêng biệt"
              >
                <span>Tách lẻ ({filteredCameras.length})</span>
              </button>
            </div>

            {/* Mobile Layout Switcher: 1 Cột (Chữ to) vs 2 Cột (Gọn) */}
            <div className="inline-flex sm:hidden items-center p-0.5 bg-gray-100 rounded-lg border border-gray-250 shadow-3xs">
              <button
                type="button"
                onClick={() => handleSetMobileLayout('1-col')}
                className={`px-2 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mobileLayout === '1-col'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Chế độ 1 cột: Chữ to rõ, thông tin thoáng đãng, dễ đọc nhất"
              >
                <List className="w-3.5 h-3.5" />
                <span>1 Cột To</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetMobileLayout('2-col')}
                className={`px-2 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mobileLayout === '2-col'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Chế độ 2 cột: Xem lướt nhiều mẫu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>2 Cột</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="bg-slate-50 border border-gray-200 text-gray-700 font-bold px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] flex items-center justify-center gap-1.5 hover:bg-slate-100 hover:text-gray-900 transition-all cursor-pointer shadow-4xs"
              title="Xuất định dạng CSV tải về"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> Xuất CSV
            </button>
            {currentUserRole === 'admin' && (
              <button
                onClick={handleOpenAddModal}
                className="bg-orange-600 text-white font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] flex items-center justify-center gap-1.5 hover:bg-orange-700 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Thêm trang phục
              </button>
            )}
          </div>
        </div>

        {/* Search & Filters: 1 row on Desktop (lg:grid-cols-4), 2 cols on Mobile to prevent text truncation */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {/* Search Bar */}
          <div className="relative col-span-2 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm tên trang phục, tag (VC-01), size, màu..."
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

          {/* Category Filter */}
          <div className="relative col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-orange-600">
              <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full pl-7.5 pr-6 py-2 text-xs sm:text-sm font-medium border border-gray-250 rounded-xl bg-gray-50/80 hover:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 cursor-pointer appearance-none truncate shadow-3xs"
              title="Lọc theo phân loại trang phục"
            >
              <option value="ALL">Tất cả phân loại ({categoryCounts.ALL})</option>
              <option value="Váy">Váy / Đầm ({categoryCounts['Váy'] || 0})</option>
              <option value="Áo dài">Áo dài ({categoryCounts['Áo dài'] || 0})</option>
              <option value="Dạ hội">Đầm dạ hội ({categoryCounts['Dạ hội'] || 0})</option>
              <option value="Concept">Cổ phục & Concept ({categoryCounts['Concept'] || 0})</option>
              <option value="Phụ kiện">Phụ kiện ({categoryCounts['Phụ kiện'] || 0})</option>
              <option value="Chụp ảnh">Chụp ảnh & Cosplay ({categoryCounts['Chụp ảnh'] || 0})</option>
              <option value="Khác">Khác ({categoryCounts['Khác'] || 0})</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400 text-[10px] sm:text-xs">
              ▼
            </div>
          </div>

          {/* Size Filter */}
          <div className="relative col-span-1 sm:col-span-1 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
              className="w-full pl-7.5 pr-6 py-2 text-xs sm:text-sm font-medium border border-gray-250 rounded-xl bg-gray-50/80 hover:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 cursor-pointer appearance-none truncate shadow-3xs"
              title="Lọc theo kích cỡ trang phục"
            >
              <option value="ALL">Tất cả kích cỡ</option>
              <option value="XS">Size XS</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
              <option value="XXL">Size XXL</option>
              <option value="Freesize">Freesize</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400 text-[10px] sm:text-xs">
              ▼
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative col-span-1 sm:col-span-1 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-blue-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-7.5 pr-6 py-2 text-xs sm:text-sm font-medium border border-gray-250 rounded-xl bg-gray-50/80 hover:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 cursor-pointer appearance-none truncate shadow-3xs"
              title="Lọc theo trạng thái"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Available">✓ Sẵn sàng</option>
              <option value="Rented">⏳ Đang thuê</option>
              <option value="Maintenance">🧺 Giặt / sửa</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400 text-[10px] sm:text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Dynamic Category Pill Filters with mobile scroll */}
        <div className="pt-3 border-t border-gray-100/80">
          <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-2 select-none sm:hidden">
            Lọc theo loại trang phục:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:flex-wrap">
            <span className="hidden sm:inline text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 select-none shrink-0">
              Phân loại:
            </span>
            {[
              { id: 'ALL', name: 'Tất cả', fullName: 'Tất cả trang phục', count: categoryCounts.ALL, color: 'bg-orange-600 border-orange-600 text-white' },
              { id: 'Váy', name: 'Váy', fullName: 'Váy thời trang & Váy cưới', count: categoryCounts['Váy'] || 0, color: 'bg-rose-600 border-rose-600 text-white' },
              { id: 'Áo dài', name: 'Áo dài', fullName: 'Áo dài truyền thống & Cách tân', count: categoryCounts['Áo dài'] || 0, color: 'bg-pink-600 border-pink-600 text-white' },
              { id: 'Dạ hội', name: 'Dạ hội', fullName: 'Đầm dạ hội tiệc tối', count: categoryCounts['Dạ hội'] || 0, color: 'bg-amber-600 border-amber-600 text-white' },
              { id: 'Concept', name: 'Concept', fullName: 'Cổ phục & Concept chụp ảnh', count: categoryCounts['Concept'] || 0, color: 'bg-purple-600 border-purple-600 text-white' },
              { id: 'Phụ kiện', name: 'Phụ kiện', fullName: 'Phụ kiện đi kèm', count: categoryCounts['Phụ kiện'] || 0, color: 'bg-emerald-600 border-emerald-600 text-white' },
              { id: 'Chụp ảnh', name: 'Chụp ảnh', fullName: 'Trang phục chụp ảnh & Cosplay', count: categoryCounts['Chụp ảnh'] || 0, color: 'bg-cyan-600 border-cyan-600 text-white' },
              { id: 'Khác', name: 'Khác', fullName: 'Trang phục khác', count: categoryCounts['Khác'] || 0, color: 'bg-slate-600 border-slate-600 text-white' },
            ].map(cat => {
              const isSelected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                    isSelected
                      ? `${cat.color} shadow-xs scale-102`
                      : 'bg-gray-55/60 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="sm:hidden">{cat.name}</span>
                  <span className="hidden sm:inline">{cat.fullName}</span>
                  <span className={`px-1.5 py-0.2 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Equipment Grid Layout: dynamic 1-col or 2-cols on mobile, 3 cols on tablet, 4-5 cols on desktop */}
      <div className={`grid ${mobileLayout === '1-col' ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4`}>
        {viewMode === 'grouped' ? (
          paginatedOutfitGroups.map((group, groupIndex) => {
            const activeCam = group.items.find(c => c.id === selectedGroupSizes[group.groupKey]) || group.items[0];
            const isFirst = groupIndex === 0;
            const isLast = groupIndex === filteredOutfitGroups.length - 1;
            const purchase = group.totalPurchase;
            const revenue = group.totalRevenue;
            const roiPercent = group.overallRoiPercent;
            const isBreakeven = group.isBreakeven;
            const remaining = purchase > revenue ? purchase - revenue : 0;
            const dailyR = activeCam.dailyRate > 0 ? activeCam.dailyRate : (group.items[0]?.dailyRate || 100000);
            const estRentalsLeft = remaining > 0 && dailyR > 0 ? Math.ceil(remaining / dailyR) : 0;

            const isDraggingThis = draggedCamId === activeCam.id;
            const isDragTarget = dragOverCamId === activeCam.id && !isDraggingThis;

            return (
              <div 
                key={group.groupKey}
                onDragOver={(e) => handleDragOver(e, activeCam.id)}
                onDrop={(e) => handleDrop(e, activeCam.id)}
                onClick={() => setDetailGroupKey(group.groupKey)}
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative cursor-pointer group select-none ${
                  isDraggingThis ? 'opacity-35 border-dashed border-orange-500 scale-[0.98]' :
                  isDragTarget ? 'border-orange-500 ring-2 ring-orange-400/60 scale-[1.01] shadow-lg' :
                  'border-gray-200/90 hover:border-orange-400'
                }`}
              >
                <div>
                  {/* Product Image strictly 4:5 Aspect Ratio (Dáng dọc thời trang 4:5) */}
                  <div className="w-full aspect-[4/5] overflow-hidden relative bg-gray-100">
                    <img
                      src={activeCam.image || group.image}
                      alt={group.cleanName}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Top-left: Category & ShortName & Sizes count badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 max-w-[90%] flex-wrap z-10 pointer-events-none">
                      {currentUserRole === 'admin' && (
                        <div
                          draggable={true}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, activeCam.id);
                          }}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-black/60 hover:bg-orange-600 pointer-events-auto backdrop-blur-xs text-white p-1 rounded-full cursor-grab active:cursor-grabbing inline-flex items-center justify-center transition-colors shadow-sm shrink-0"
                          title="Kéo & thả để đổi vị trí thứ tự mẫu áo"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] sm:text-[11px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wide truncate max-w-[120px] shadow-xs">
                        {group.category === 'Áo dài' ? '🌸 Áo Dài' :
                         group.category === 'Concept' ? '👘 Concept' :
                         group.category === 'Dạ hội' ? '✨ Dạ Hội' :
                         group.category === 'Chụp ảnh' ? '📸 Chụp Ảnh' :
                         group.category === 'Phụ kiện' ? '🎀 Phụ Kiện' :
                         group.category === 'Khác' ? '👗 Khác' :
                         group.category === 'Printer' ? '🖨️ In ảnh' : group.category}
                      </span>
                      {group.shortName && (
                        <span className="bg-orange-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md truncate max-w-[90px] shadow-xs">
                          {group.shortName}
                        </span>
                      )}
                      <span className="bg-amber-500 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        {group.items.length} size
                      </span>
                    </div>
                  
                    {/* Bottom: Status Overlay Badge */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-end z-10 pointer-events-none">
                      {(() => {
                        if (group.readyCount === group.items.length) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-emerald-600/95 text-white backdrop-blur-xs">
                              ✓ Sẵn sàng ({group.items.length}/{group.items.length})
                            </span>
                          );
                        }
                        if (group.readyCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-emerald-600/95 text-white backdrop-blur-xs">
                              ✓ Còn {group.readyCount}/{group.items.length}
                            </span>
                          );
                        }
                        if (group.laundryCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-blue-700/95 text-white backdrop-blur-xs">
                              🧺 Đang giặt ({group.laundryCount})
                            </span>
                          );
                        }
                        if (group.mendingCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-amber-700/95 text-white backdrop-blur-xs">
                              🪡 Đang sửa ({group.mendingCount})
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-purple-700/95 text-white backdrop-blur-xs">
                            ⏳ Đang kín lịch
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Product text details - Siêu gọn, không bao giờ bị rớt dòng */}
                  <div className="p-2.5 sm:p-3 space-y-1.5">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors line-clamp-1" title={group.cleanName}>
                        {group.cleanName}
                      </h3>
                      <div className="text-gray-400 font-mono text-[10.5px] sm:text-xs mt-0.5 flex justify-between items-center">
                        <span className="truncate">Mã: <b className="text-gray-700">{group.baseSerial}</b></span>
                        {group.gender && (
                          <span className={`text-[9.5px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${group.gender === 'Nữ' ? 'bg-pink-50 text-pink-700 border border-pink-100' : group.gender === 'Nam' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-600'}`}>
                            {group.gender}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price row - 1 dòng duy nhất, to rõ */}
                    <div className="pt-0.5 flex items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-black text-orange-600 font-mono">
                          {(activeCam.price1Day ?? activeCam.dailyRate).toLocaleString()}đ
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">/ngày</span>
                      </div>
                      {roiPercent !== null && (
                        <span className={`text-[9.5px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          isBreakeven ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {isBreakeven ? '✓ Hòa vốn' : `${roiPercent}% vốn`}
                        </span>
                      )}
                    </div>

                    {/* Quick Size & Color summary */}
                    <div className="flex items-center gap-1 flex-wrap text-[10px] sm:text-[11px] pt-0.5">
                      <span className="font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                        {group.items.length > 1
                          ? `Size: ${group.items.map(i => i.size || 'FS').join(', ')}`
                          : `Size ${activeCam.size || 'FS'}`}
                      </span>
                      {activeCam.color && (
                        <span className="text-gray-500 bg-gray-50 border border-gray-200/60 px-1.5 py-0.5 rounded truncate max-w-[90px]">
                          🎨 {activeCam.color}
                        </span>
                      )}
                    </div>

                    {/* Touch Cue */}
                    <div className="pt-1 mt-1 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700">
                      <span>Chi tiết & bảng giá</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Footer Admin Bar: Reorder & Quick Tools */}
                {currentUserRole === 'admin' ? (
                  <div 
                    onClick={e => e.stopPropagation()} 
                    className="px-2 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-1 text-xs"
                  >
                    <div className="flex items-center gap-0.5 bg-white border border-gray-250 rounded-lg p-0.5 shadow-3xs shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveGroup(groupIndex, 'left')}
                        disabled={isFirst}
                        className="p-1 text-gray-500 hover:text-orange-600 disabled:opacity-20 cursor-pointer rounded"
                        title="Đẩy lên trước"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[9.5px] font-mono font-bold text-gray-600 px-0.5">#{groupIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleMoveGroup(groupIndex, 'right')}
                        disabled={isLast}
                        className="p-1 text-gray-500 hover:text-orange-600 disabled:opacity-20 cursor-pointer rounded"
                        title="Đẩy về sau"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(activeCam)}
                        className="p-1 sm:p-1.5 bg-white border border-gray-300 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer shadow-3xs"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-3 h-3 text-gray-700" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (activeCam.cleaningStatus === 'Laundry' || activeCam.cleaningStatus === 'Mending') {
                            onUpdateCamera({ ...activeCam, cleaningStatus: 'Clean' });
                          } else {
                            onUpdateCamera({ ...activeCam, cleaningStatus: 'Laundry' });
                          }
                        }}
                        className={`text-[9.5px] sm:text-[10px] px-1.5 py-1 font-bold rounded-lg border transition-colors cursor-pointer shadow-3xs ${
                          activeCam.cleaningStatus === 'Laundry' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                        }`}
                        title={activeCam.cleaningStatus === 'Laundry' ? 'Đã giặt xong' : 'Gửi đi giặt'}
                      >
                        {activeCam.cleaningStatus === 'Laundry' ? '✨Xong' : '🧺Giặt'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-2 py-1 bg-gray-50 border-t border-gray-200 text-right">
                    <span className="text-[10px] text-gray-400 font-semibold">Chạm để xem chi tiết</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          paginatedCameras.map(cam => {
            const globalIndex = cameras.findIndex(c => c.id === cam.id);
            const isFirst = globalIndex === 0;
            const isLast = globalIndex === cameras.length - 1;
            const isDraggingThis = draggedCamId === cam.id;
            const isDragTarget = dragOverCamId === cam.id && !isDraggingThis;

            const purchase = cam.purchasePrice || 0;
            const revenue = cameraRevenueMap[cam.id] || 0;
            const roiPercent = purchase > 0 ? Math.round((revenue / purchase) * 100) : null;
            const isBreakeven = roiPercent !== null && roiPercent >= 100;

            const rawSizes = (cam.availableSizes && cam.availableSizes.length > 0)
              ? cam.availableSizes
              : (cam.size ? cam.size.split(',').map(s => s.trim()).filter(Boolean) : []);

            return (
              <div 
                key={cam.id}
                onDragOver={(e) => handleDragOver(e, cam.id)}
                onDrop={(e) => handleDrop(e, cam.id)}
                onClick={() => setDetailCameraId(cam.id)}
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative cursor-pointer group select-none ${
                  isDraggingThis ? 'opacity-35 border-dashed border-orange-500 scale-[0.98]' :
                  isDragTarget ? 'border-orange-500 ring-2 ring-orange-400/60 scale-[1.01] shadow-lg' :
                  'border-gray-200/90 hover:border-orange-400'
                }`}
              >
                <div>
                  {/* Product Image strictly 4:5 Aspect Ratio (Dáng dọc thời trang 4:5) */}
                  <div className="w-full aspect-[4/5] overflow-hidden relative bg-gray-100">
                    <img
                      src={cam.image}
                      alt={cam.name}
                      className="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Top-left: Category & ShortName & Drag Handle */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 max-w-[90%] flex-wrap z-10">
                      {currentUserRole === 'admin' && (
                        <div
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, cam.id)}
                          onDragEnd={handleDragEnd}
                          className="bg-black/60 hover:bg-orange-600 backdrop-blur-xs text-white p-1 rounded-full cursor-grab active:cursor-grabbing inline-flex items-center justify-center transition-colors shadow-sm shrink-0"
                          title="Kéo & thả để đổi vị trí thứ tự trang phục"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] sm:text-[11px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wide truncate max-w-[120px] shadow-xs">
                        {cam.category === 'Áo dài' ? '🌸 Áo Dài' :
                         cam.category === 'Concept' ? '👘 Concept' :
                         cam.category === 'Dạ hội' ? '✨ Dạ Hội' :
                         cam.category === 'Chụp ảnh' ? '📸 Chụp Ảnh' :
                         cam.category === 'Phụ kiện' ? '🎀 Phụ Kiện' :
                         cam.category === 'Khác' ? '👗 Khác' :
                         cam.category === 'Printer' ? '🖨️ In ảnh' : cam.category}
                      </span>
                      {cam.shortName && (
                        <span className="bg-orange-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md truncate max-w-[90px] shadow-xs">
                          {cam.shortName}
                        </span>
                      )}
                    </div>
                  
                    {/* Bottom: Status Overlay Badge */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-end z-10 pointer-events-none">
                      {(() => {
                        const isLaundry = cam.cleaningStatus === 'Laundry';
                        const isMending = cam.cleaningStatus === 'Mending';
                        const isRented = cam.status === 'Rented';
                        const isMaintenance = cam.status === 'Maintenance';

                        if (isRented) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-purple-700/95 text-white backdrop-blur-xs">
                              ⏳ Đang thuê
                            </span>
                          );
                        }
                        if (isLaundry) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-blue-700/95 text-white backdrop-blur-xs">
                              🧺 Đang giặt
                            </span>
                          );
                        }
                        if (isMending) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-amber-700/95 text-white backdrop-blur-xs">
                              🪡 Đang sửa
                            </span>
                          );
                        }
                        if (isMaintenance) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-rose-700/95 text-white backdrop-blur-xs">
                              🛠️ Bảo trì
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-emerald-600/95 text-white backdrop-blur-xs">
                            ✓ Sẵn sàng
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Product text details */}
                  <div className="p-3 sm:p-4 space-y-2.5">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-1" title={cam.name}>{cam.name}</h3>
                      <div className="text-gray-500 font-mono text-[11px] sm:text-xs mt-1 flex justify-between items-center">
                        <span>Mã: <b className="text-gray-800">{cam.serialNumber}</b></span>
                        {cam.gender && <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${cam.gender === 'Nữ' ? 'bg-pink-50 text-pink-700 border border-pink-200' : cam.gender === 'Nam' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700'}`}>{cam.gender}</span>}
                      </div>
                    </div>

                    {/* Price row - 1 dòng duy nhất, to rõ */}
                    <div className="pt-0.5 flex items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-black text-orange-600 font-mono">
                          {cam.category === 'Printer'
                            ? `${(cam.printPrice1To2 ?? 40000).toLocaleString()}đ`
                            : `${(cam.price1Day ?? cam.dailyRate).toLocaleString()}đ`}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                          {cam.category === 'Printer' ? '/tấm' : '/ngày'}
                        </span>
                      </div>
                      {roiPercent !== null && (
                        <span className={`text-[9.5px] sm:text-[10px] font-bold px-1 py-0.2 rounded shrink-0 ${
                          isBreakeven ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {isBreakeven ? '✓ Hòa vốn' : `${roiPercent}% vốn`}
                        </span>
                      )}
                    </div>

                    {/* Quick Size & Color summary */}
                    <div className="flex items-center gap-1 flex-wrap text-[10px] sm:text-[11px] pt-0.5">
                      {rawSizes.length > 0 && (
                        <span className="font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          Size: {rawSizes.join(' · ')}
                        </span>
                      )}
                      {cam.color && (
                        <span className="text-gray-500 bg-gray-50 border border-gray-200/60 px-1.5 py-0.5 rounded truncate max-w-[90px]">
                          🎨 {cam.color}
                        </span>
                      )}
                    </div>

                    {/* Touch Cue */}
                    <div className="pt-1 mt-1 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700">
                      <span>Chi tiết & bảng giá</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Quick Status and Admin tools bar */}
                <div onClick={e => e.stopPropagation()} className="px-2.5 sm:px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-1.5">
                  {currentUserRole === 'admin' ? (
                    <>
                      {/* Reorder Buttons: Left & Right */}
                      <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1 shadow-3xs shrink-0" title="Đổi vị trí trang phục trong danh sách">
                        <button
                          type="button"
                          onClick={() => handleMoveCamera(cam.id, 'left')}
                          disabled={isFirst}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 disabled:pointer-events-none rounded transition cursor-pointer"
                          title="Di chuyển lên trước (←)"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-600 px-1 select-none" title={`Vị trí thứ ${globalIndex + 1} trên tổng ${cameras.length} trang phục`}>
                          #{globalIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveCamera(cam.id, 'right')}
                          disabled={isLast}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 disabled:pointer-events-none rounded transition cursor-pointer"
                          title="Di chuyển về sau (→)"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => handleOpenEditModal(cam)}
                          className="text-gray-700 hover:text-orange-600 p-1.5 bg-white border border-gray-300 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer shadow-3xs"
                          title="Sửa thông tin (Admin)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (cam.cleaningStatus === 'Laundry' || cam.cleaningStatus === 'Mending') {
                              onUpdateCamera({ ...cam, cleaningStatus: 'Clean' });
                            } else if (cam.status === 'Maintenance') {
                              onUpdateCamera({ ...cam, status: 'Available' });
                            } else {
                              onUpdateCamera({ ...cam, cleaningStatus: 'Laundry' });
                            }
                          }}
                          className={`text-[10px] sm:text-xs px-2 py-1.5 font-bold rounded-lg transition-all cursor-pointer shadow-3xs whitespace-nowrap ${
                            cam.cleaningStatus === 'Laundry'
                              ? 'bg-blue-50 border border-blue-300 text-blue-800 hover:bg-blue-100'
                              : cam.cleaningStatus === 'Mending'
                              ? 'bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100'
                              : cam.status === 'Maintenance'
                              ? 'bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100'
                              : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                          title={
                            cam.cleaningStatus === 'Laundry' ? 'Bấm để hoàn tất: Đã giặt sạch thơm (Sẵn sàng)' :
                            cam.cleaningStatus === 'Mending' ? 'Bấm để hoàn tất: Đã sửa xong (Sẵn sàng)' :
                            cam.status === 'Maintenance' ? 'Bấm để hoàn tất bảo trì' :
                            'Gửi trang phục đi giặt hấp'
                          }
                        >
                          {cam.cleaningStatus === 'Laundry' ? '✨Giặt' :
                           cam.cleaningStatus === 'Mending' ? '✨Sửa' :
                           cam.status === 'Maintenance' ? '✓BT' :
                           '🧺'}
                        </button>

                        <button
                          onClick={() => {
                            if (cam.status === 'Rented') {
                              setDeleteError(`Trang phục "${cam.name}" đang trong trạng thái ĐANG THUÊ. Vui lòng hoàn tất hợp đồng thu hồi trang phục trước khi xóa khỏi hệ thống.`);
                              setCameraToDelete(cam);
                            } else {
                              setDeleteError(null);
                              setCameraToDelete(cam);
                            }
                          }}
                          className="text-gray-500 hover:text-red-650 p-1.5 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all cursor-pointer shadow-3xs"
                          title="Xóa trang phục"
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-200/50 px-2 rounded-md py-1 uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-550 shrink-0" /> Chế độ xem (Staff)
                      </span>

                      <button
                        onClick={() => toggleMaintenance(cam)}
                        className={`text-xs px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                          cam.status === 'Maintenance'
                            ? 'bg-emerald-55 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={cam.status === 'Maintenance' ? 'Hoàn tất giặt hấp' : 'Báo cần giặt hấp / May sửa'}
                      >
                        {cam.status === 'Maintenance' ? 'Xong giặt/Sửa' : '🧺 Cần giặt/Sửa'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        {((viewMode === 'grouped' && filteredOutfitGroups.length === 0) || (viewMode === 'individual' && filteredCameras.length === 0)) && (
          <div className="col-span-full bg-white border border-gray-150 p-12 text-center rounded-2xl text-gray-400 italic font-medium">
            Không tìm thấy trang phục nào trùng khớp với bộ lọc của bạn.
          </div>
        )}
      </div>

      {/* Pagination controls for equipment */}
      {totalPages > 1 && (
        <div className="bg-white border border-gray-150 p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-3 shadow-2xs select-none">
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            <span className="text-xs text-gray-500 font-medium text-center">
              {viewMode === 'grouped' ? (
                <>
                  Hiển thị từ <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> tới <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredOutfitGroups.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredOutfitGroups.length}</span> mẫu trang phục (<span className="font-bold text-orange-600">{filteredCameras.length}</span> chiếc/size)
                </>
              ) : (
                <>
                  Hiển thị từ <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> tới <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredCameras.length)}</span> trong tổng số <span className="font-bold text-gray-800">{filteredCameras.length}</span> trang phục
                </>
              )}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 font-bold">Hiển thị:</span>
              {[10, 15, 20].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    itemsPerPage === n
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
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

      {/* Outfit Detail Bottom Sheet / Modal */}
      {(detailGroup || detailCamera) && typeof document !== 'undefined' && createPortal(
        (() => {
          const isGroup = Boolean(detailGroup);
          const group = detailGroup;
          const activeCam: Camera | undefined = isGroup && group
            ? (group.items.find(c => c.id === selectedGroupSizes[group.groupKey]) || group.items[0])
            : (detailCamera || undefined);

          if (!activeCam) return null;

          const title = isGroup && group ? group.cleanName : activeCam.name;
          const category = activeCam.category;
          const gender = activeCam.gender || 'Nữ';
          const purchase = isGroup && group ? group.totalPurchase : (activeCam.purchasePrice || 0);
          const revenue = isGroup && group ? group.totalRevenue : (cameraRevenueMap[activeCam.id] || 0);
          const roiPercent = isGroup && group
            ? group.overallRoiPercent
            : (purchase > 0 ? Math.round((revenue / purchase) * 100) : null);
          const isBreakeven = roiPercent !== null && roiPercent >= 100;
          const remaining = purchase > revenue ? purchase - revenue : 0;
          const p1 = activeCam.price1Day ?? activeCam.dailyRate;
          const estRentalsLeft = remaining > 0 && p1 > 0 ? Math.ceil(remaining / p1) : 0;

          // Tiered pricing
          const p2_daily = Math.max(0, p1 - 30000);
          const p4_daily = Math.max(0, p1 - 40000);
          const p3_daily = p4_daily;
          const total2Days = Math.round((activeCam.price2Days ?? ((p1 + p2_daily) / 2)) * 2);
          const total3Days = Math.round((activeCam.price3Days ?? ((p1 + p2_daily + p3_daily) / 3)) * 3);
          const rateFrom4Days = activeCam.price4DaysPlus ?? p4_daily;

          const closeDetail = () => {
            setDetailGroupKey(null);
            setDetailCameraId(null);
          };

          return (
            <div 
              className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center animate-fade-in"
              onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
              }}
            >
              {/* Dark backdrop */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={closeDetail}
              />

              {/* Bottom Sheet / Modal Dialog */}
              <div 
                className="relative bg-white w-full sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-300"
                onClick={e => e.stopPropagation()}
              >
                {/* Mobile drag handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

                {/* Header */}
                <div className="px-5 py-3 border-b border-gray-150 flex items-center justify-between gap-3 shrink-0 bg-white">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-orange-50 text-orange-700 text-[10.5px] font-bold px-2 py-0.5 rounded-md border border-orange-200">
                        {category}
                      </span>
                      {activeCam.shortName && (
                        <span className="bg-gray-100 text-gray-700 text-[10.5px] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                          {activeCam.shortName}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${gender === 'Nữ' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'}`}>
                        {gender}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 truncate mt-1" title={title}>
                      {title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeDetail}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer shrink-0"
                    title="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-4 overscroll-contain">
                  {/* Top Product Card: Image + Key Information */}
                  <div className="flex gap-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-3">
                    <div className="w-28 sm:w-32 aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 shrink-0 shadow-xs border border-gray-200">
                      <img 
                        src={activeCam.image || (group ? group.image : '')} 
                        alt={title}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1.5">
                      <div>
                        <div className="text-xs text-gray-500 font-mono">
                          Mã tem: <b className="text-gray-900 font-bold">{activeCam.serialNumber}</b>
                        </div>
                        {activeCam.color && (
                          <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                            <span>Màu sắc:</span>
                            <span className="font-bold text-gray-800">🎨 {activeCam.color}</span>
                          </div>
                        )}
                        <div className="mt-1">
                          {(() => {
                            if (activeCam.status === 'Rented') return <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">⏳ Đang thuê</span>;
                            if (activeCam.cleaningStatus === 'Laundry') return <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">🧺 Đang gửi giặt</span>;
                            if (activeCam.cleaningStatus === 'Mending') return <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">🪡 Đang sửa đồ</span>;
                            if (activeCam.status === 'Maintenance') return <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">🛠️ Bảo trì</span>;
                            return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">✓ Sẵn sàng cho thuê</span>;
                          })()}
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-200/80">
                        <div className="text-[11px] text-gray-500 uppercase font-bold">Giá thuê ngày:</div>
                        <div className="text-lg sm:text-xl font-black text-orange-600 font-mono">
                          {category === 'Printer'
                            ? `${(activeCam.printPrice1To2 ?? 40000).toLocaleString()}đ / tấm`
                            : `${p1.toLocaleString()}đ / ngày`}
                        </div>
                        {activeCam.depositAmount !== undefined && activeCam.depositAmount > 0 && (
                          <div className="text-[11px] text-gray-500 font-mono">
                            Cọc: <b className="text-gray-700">{activeCam.depositAmount.toLocaleString()}đ</b>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Size selector if Group mode */}
                  {isGroup && group && group.items.length > 1 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>CHỌN SIZE ĐỂ XEM CHI TIẾT TỪNG TEM ({group.items.length} size):</span>
                        <span className="text-orange-600 font-black">Size {activeCam.size || 'FS'}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {group.items.map(item => {
                          const isSel = item.id === activeCam.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedGroupSizes(prev => ({ ...prev, [group.groupKey]: item.id }))}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSel
                                  ? 'bg-orange-50 border-2 border-orange-500 ring-2 ring-orange-300/80 shadow-xs'
                                  : 'bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-sm text-gray-900">Size {item.size || 'FS'}</span>
                                <span className={`w-2 h-2 rounded-full ${
                                  item.status === 'Rented' ? 'bg-purple-500' :
                                  item.cleaningStatus === 'Laundry' ? 'bg-blue-500' :
                                  item.cleaningStatus === 'Mending' ? 'bg-amber-500' :
                                  item.status === 'Maintenance' ? 'bg-rose-500' : 'bg-emerald-500'
                                }`} />
                              </div>
                              <div className="text-[11px] font-mono text-gray-500 truncate mt-1">
                                {item.serialNumber}
                              </div>
                              {item.color && (
                                <div className="text-[10.5px] text-gray-600 truncate">
                                  🎨 {item.color}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tiered Pricing Table */}
                  {category !== 'Printer' ? (
                    <div className="bg-orange-50/50 border border-orange-200/90 rounded-2xl p-3.5 space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-orange-950 flex items-center justify-between">
                        <span>BẢNG GIÁ THUÊ THEO SỐ NGÀY</span>
                        <span className="text-[11px] text-orange-600 font-bold">Càng thuê lâu càng rẻ</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="bg-white border border-orange-200 rounded-xl p-2 shadow-2xs">
                          <div className="text-[11px] text-gray-500 font-bold">1 ngày</div>
                          <div className="text-sm font-black text-gray-900 font-mono mt-0.5">{p1.toLocaleString()}đ</div>
                          <div className="text-[10px] text-gray-400">gốc / ngày</div>
                        </div>

                        <div className="bg-white border border-orange-200 rounded-xl p-2 shadow-2xs">
                          <div className="text-[11px] text-gray-500 font-bold">2 ngày</div>
                          <div className="text-sm font-black text-gray-900 font-mono mt-0.5">{total2Days.toLocaleString()}đ</div>
                          <div className="text-[10px] text-orange-600 font-semibold">~{Math.round(total2Days / 2).toLocaleString()}đ/ng</div>
                        </div>

                        <div className="bg-white border border-orange-200 rounded-xl p-2 shadow-2xs">
                          <div className="text-[11px] text-gray-500 font-bold">3 ngày</div>
                          <div className="text-sm font-black text-gray-900 font-mono mt-0.5">{total3Days.toLocaleString()}đ</div>
                          <div className="text-[10px] text-orange-600 font-semibold">~{Math.round(total3Days / 3).toLocaleString()}đ/ng</div>
                        </div>

                        <div className="bg-orange-100/90 border border-orange-300 rounded-xl p-2 shadow-2xs">
                          <div className="text-[11px] text-orange-950 font-bold">Từ 4 ngày</div>
                          <div className="text-sm font-black text-orange-700 font-mono mt-0.5">{rateFrom4Days.toLocaleString()}đ</div>
                          <div className="text-[10px] text-orange-800 font-bold">mỗi ngày tiếp</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-3.5 space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-rose-950">
                        BẢNG GIÁ IN ẢNH
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white border border-rose-200 rounded-xl p-2">
                          <div className="text-[11px] text-gray-500 font-bold">1 - 2 tấm</div>
                          <div className="text-sm font-black text-rose-700 font-mono mt-0.5">{(activeCam.printPrice1To2 ?? 40000).toLocaleString()}đ</div>
                        </div>
                        <div className="bg-white border border-rose-200 rounded-xl p-2">
                          <div className="text-[11px] text-gray-500 font-bold">3 - 9 tấm</div>
                          <div className="text-sm font-black text-rose-700 font-mono mt-0.5">{(activeCam.printPrice3To9 ?? 35000).toLocaleString()}đ</div>
                        </div>
                        <div className="bg-rose-100 border border-rose-300 rounded-xl p-2">
                          <div className="text-[11px] text-rose-950 font-bold">Từ 10 tấm</div>
                          <div className="text-sm font-black text-rose-800 font-mono mt-0.5">{(activeCam.printPrice10Plus ?? 33000).toLocaleString()}đ</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROI / Break-even section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700 flex items-center gap-1">
                        <span>💎 Vốn nhập:</span>
                        <b className="font-mono text-gray-900">{purchase > 0 ? `${purchase.toLocaleString()}đ` : '—'}</b>
                        {isGroup && group && <span className="text-gray-400">({group.items.length} size)</span>}
                      </span>
                      {roiPercent !== null && (
                        <span className={`px-2 py-0.5 rounded-md font-black text-xs ${
                          isBreakeven ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {isBreakeven ? `✓ Đã hòa vốn (${roiPercent}%)` : `Hoàn vốn: ${roiPercent}%`}
                        </span>
                      )}
                    </div>

                    {purchase > 0 && (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isBreakeven ? 'bg-emerald-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(roiPercent || 0, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-0.5">
                          <span>Đã thu về: <b className="text-gray-900 font-mono font-bold">{revenue.toLocaleString()}đ</b></span>
                          <span>
                            {isBreakeven ? (
                              <b className="text-emerald-700 font-mono font-bold">+{(revenue - purchase).toLocaleString()}đ lãi</b>
                            ) : (
                              <span>Cần thêm: ~<b className="text-orange-600 font-mono font-bold">{estRentalsLeft}</b> lượt thuê</span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {(activeCam.description || (group && group.description)) && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-1 text-xs">
                      <div className="font-bold text-gray-700">Mô tả & ghi chú phụ kiện:</div>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                        {activeCam.description || (group ? group.description : '')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 shrink-0">
                  {currentUserRole === 'admin' ? (
                    <>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            closeDetail();
                            handleOpenEditModal(activeCam);
                          }}
                          className="px-3 py-2 bg-white border border-gray-300 hover:bg-orange-50 hover:text-orange-600 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-3xs cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sửa đồ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeCam.cleaningStatus === 'Laundry' || activeCam.cleaningStatus === 'Mending') {
                              onUpdateCamera({ ...activeCam, cleaningStatus: 'Clean' });
                            } else {
                              onUpdateCamera({ ...activeCam, cleaningStatus: 'Laundry' });
                            }
                          }}
                          className={`px-3 py-2 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-3xs cursor-pointer transition-colors border ${
                            activeCam.cleaningStatus === 'Laundry'
                              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          {activeCam.cleaningStatus === 'Laundry' ? '✨ Xong giặt' : '🧺 Gửi giặt'}
                        </button>

                        {isGroup && group && (
                          <button
                            type="button"
                            onClick={() => {
                              closeDetail();
                              handleAddSizeToGroup(group);
                            }}
                            className="px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs rounded-xl flex items-center gap-1 shadow-3xs cursor-pointer hover:bg-orange-600 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm Size</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            closeDetail();
                            setCameraToDelete(activeCam);
                          }}
                          className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-200"
                          title="Xóa trang phục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={closeDetail}
                        className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs ml-auto"
                      >
                        Đóng
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Đã xem xong
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* Camera Add/Edit Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden self-center border border-gray-100 animate-scale-up flex flex-col max-h-[90vh]">
            <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <DressIcon className="w-5 h-5" /> {editingCamera ? 'Cập Nhật Trang Phục' : 'Thêm Trang Phục Mới Vào Tủ Đồ'}
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
              onSubmit={handleSubmit} 
              className="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain modal-scrollable"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span>⚠</span> {validationError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tên trang phục đầy đủ *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="VD: Áo dài tơ tằm thêu tay hoa sen tứ thân truyền thống"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phân loại trang phục *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Váy', label: 'Váy', icon: '👗' },
                    { id: 'Áo dài', label: 'Áo dài', icon: '🌸' },
                    { id: 'Dạ hội', label: 'Dạ hội', icon: '✨' },
                    { id: 'Concept', label: 'Concept', icon: '👘' },
                    { id: 'Phụ kiện', label: 'Phụ kiện', icon: '🎀' },
                    { id: 'Chụp ảnh', label: 'Chụp ảnh', icon: '📸' },
                    { id: 'Khác', label: 'Khác', icon: '🏷️' },
                  ].map(cat => {
                    const isSelected = formState.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormState(prev => ({
                          ...prev,
                          category: cat.id as any,
                          isPrinter: cat.id === 'Printer',
                          depositAmount: cat.id === 'Printer' && prev.depositAmount === 5000000 ? 1000000 : prev.depositAmount,
                          dailyRate: cat.id === 'Printer' && prev.dailyRate === 290000 ? 40000 : prev.dailyRate,
                          price1Day: cat.id === 'Printer' && prev.price1Day === 290000 ? 40000 : prev.price1Day,
                        }))}
                        className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-w-0 ${
                          isSelected
                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-black ring-2 ring-orange-200 shadow-3xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl">{cat.icon}</span>
                        <span className="text-xs sm:text-sm font-black whitespace-nowrap truncate w-full px-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mã Tag / Số hiệu (S/N) *</label>
                <input
                  type="text"
                  required
                  value={formState.serialNumber}
                  onChange={e => setFormState({ ...formState, serialNumber: e.target.value, shortName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono font-bold"
                  placeholder="VD: ĐL K01, VC-01, AD-05, DH-02..."
                />
                <p className="text-[11px] text-gray-400 mt-1">Mã ngắn gắn trên tem mác / móc áo để nhận diện và hiển thị nhanh trên lịch</p>
              </div>

              {/* Gender & Cleaning Status row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Dành cho giới tính</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'Nữ', label: 'Nữ 👩' },
                      { id: 'Nam', label: 'Nam 👨' },
                      { id: 'Unisex', label: 'Unisex 🚻' }
                    ].map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormState({ ...formState, gender: g.id as any })}
                        className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-bold transition cursor-pointer border text-center whitespace-nowrap ${
                          formState.gender === g.id
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tình trạng vệ sinh & Giặt hấp</label>
                  <select
                    value={formState.cleaningStatus}
                    onChange={e => setFormState({ ...formState, cleaningStatus: e.target.value as any })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-gray-750"
                  >
                    <option value="Clean">✨ Đã giặt sạch thơm (Sẵn sàng)</option>
                    <option value="Laundry">🧺 Đang giặt hấp khử khuẩn (Laundry)</option>
                    <option value="Mending">🪡 Đang sửa may / Đính đá (Mending)</option>
                  </select>
                </div>
              </div>


              {/* Khối Kích cỡ & Tự động tạo sản phẩm riêng theo từng Size/Màu */}
              <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-200/80 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span>Kích cỡ (Size) *</span>
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-100/90 px-2 py-0.5 rounded-full">
                        Chọn size để tự động tạo từng chiếc
                      </span>
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          const newSizes = ['S', 'M', 'L'];
                          const nextColorMap = { ...formState.sizeColorMap };
                          newSizes.forEach(s => {
                            if (!nextColorMap[s]) nextColorMap[s] = formState.color || '';
                          });
                          setFormState(prev => ({
                            ...prev,
                            selectedSizes: newSizes,
                            size: newSizes.join(', '),
                            sizeColorMap: nextColorMap,
                            sizeQtyMap: {}
                          }));
                        }}
                        className="text-orange-600 hover:text-orange-800 font-bold hover:underline cursor-pointer"
                      >
                        S-M-L
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                          const nextColorMap = { ...formState.sizeColorMap };
                          newSizes.forEach(s => {
                            if (!nextColorMap[s]) nextColorMap[s] = formState.color || '';
                          });
                          setFormState(prev => ({
                            ...prev,
                            selectedSizes: newSizes,
                            size: newSizes.join(', '),
                            sizeColorMap: nextColorMap,
                            sizeQtyMap: {}
                          }));
                        }}
                        className="text-orange-600 hover:text-orange-800 font-bold hover:underline cursor-pointer"
                      >
                        Tất cả
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextColorMap = { ...formState.sizeColorMap };
                          if (!nextColorMap['Freesize']) nextColorMap['Freesize'] = formState.color || '';
                          setFormState(prev => ({
                            ...prev,
                            selectedSizes: ['Freesize'],
                            size: 'Freesize',
                            sizeColorMap: nextColorMap
                          }));
                        }}
                        className="text-orange-600 hover:text-orange-800 font-bold hover:underline cursor-pointer"
                      >
                        Chỉ Freesize
                      </button>
                    </div>
                  </div>

                  {/* Size buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Freesize'].map(sz => {
                      const isSelected = formState.selectedSizes.includes(sz);
                      const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Freesize'];
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            let nextSizes: string[];
                            if (isSelected) {
                              nextSizes = formState.selectedSizes.filter(s => s !== sz);
                              if (nextSizes.length === 0) nextSizes = [sz]; // luôn giữ ít nhất 1 size
                            } else {
                              nextSizes = [...formState.selectedSizes, sz];
                            }
                            nextSizes.sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
                            const nextColorMap = { ...formState.sizeColorMap };
                            if (!nextColorMap[sz]) {
                              nextColorMap[sz] = formState.color || '';
                            }
                            setFormState(prev => ({
                              ...prev,
                              selectedSizes: nextSizes,
                              size: nextSizes.join(', '),
                              sizeColorMap: nextColorMap
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center gap-1 ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs ring-2 ring-orange-200'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {isSelected && <span className="text-[10px]">✓</span>}
                          <span>{sz}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BẢNG PHÂN LOẠI CHI TIẾT TỪNG CHIẾC (LIVE PREVIEW & CHỌN MÀU TỪNG SIZE) */}
                <div className="bg-white rounded-xl border border-orange-200/90 shadow-2xs overflow-hidden">
                  <div className="bg-orange-100/60 px-3 py-2 border-b border-orange-200/80 flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-black text-orange-950 flex items-center gap-1.5">
                      <span>⚡ Danh sách sản phẩm sẽ tự động tạo ({formState.selectedSizes.reduce((acc, sz) => acc + (formState.sizeQtyMap[sz] || 1), 0)} chiếc):</span>
                    </span>
                    <span className="text-[10.5px] text-orange-800/80 font-medium italic">
                      Mỗi size được cấp mã tag riêng & chọn màu độc lập
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
                    {formState.selectedSizes.map(sz => {
                      const sizeCode = sz === 'Freesize' ? 'FS' : sz;
                      const rawSerial = (formState.serialNumber || '').trim();
                      const cleanBase = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '');
                      const displaySerial = rawSerial
                        ? (formState.selectedSizes.length > 1 ? `${cleanBase}-${sizeCode}` : rawSerial)
                        : `VD: V01-${sizeCode}`;
                      const currentColor = formState.sizeColorMap[sz] !== undefined && formState.sizeColorMap[sz] !== ''
                        ? formState.sizeColorMap[sz]
                        : (formState.color || '');
                      const currentSizeImg = formState.sizeImageMap[sz] || '';

                      return (
                        <div key={sz} className="p-3 flex flex-col gap-2.5 hover:bg-orange-50/20 transition">
                          {/* Header row: Size badge + Clean Tag preview + Current Color pill */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-orange-50/50 p-2 rounded-lg border border-orange-100/90">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black bg-orange-600 text-white px-2.5 py-1 rounded-md shadow-2xs min-w-[55px] text-center">
                                {sz}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-800 font-mono">
                                  Mã: <strong className={rawSerial ? "text-orange-700" : "text-gray-400 italic"}>{displaySerial}</strong>
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {sz === 'Freesize' ? 'Kiểu dáng Freesize' : `Kích cỡ chuẩn ${sz}`}
                                </span>
                              </div>
                            </div>

                            {/* Current color badge pill */}
                            <div className="inline-flex items-center gap-1.5 bg-white border border-orange-200/90 px-2.5 py-1 rounded-full text-[11px] font-bold text-orange-950 shadow-2xs self-start sm:self-auto">
                              <span className={`w-2.5 h-2.5 rounded-full ${currentColor ? 'bg-orange-500 ring-1 ring-orange-300' : 'bg-gray-300'} shrink-0`}></span>
                              {(() => {
                                const qty2 = formState.sizeQtyMap[sz] || 1;
                                const allColors = (formState.sizeColorVariants[sz] || [currentColor]).filter(Boolean);
                                if (allColors.length > 1) {
                                  return <span className="text-[10px]">{allColors.map((col, i) => <span key={i} className="font-black text-orange-700">{i > 0 ? ' · ' : ''}{col || '?'}</span>)}</span>;
                                }
                                return currentColor
                                  ? <span>Màu: <strong className="text-orange-700 font-black">{currentColor}</strong></span>
                                  : <span className="text-gray-400 font-medium italic">Chưa nhập màu</span>;
                              })()}
                            </div>
                          </div>


                          {/* Số lượng + Màu riêng từng chiếc */}
                          {(() => {
                            const qty = formState.sizeQtyMap[sz] || 1;
                            const variants = formState.sizeColorVariants[sz] || [formState.sizeColorMap[sz] || ''];
                            const COLORS = [
                              { name: '⚪ Trắng', full: 'Trắng tinh khôi' }, { name: '🔴 Đỏ', full: 'Đỏ đô' },
                              { name: '⚫ Đen', full: 'Đen tuyền' }, { name: '🌾 Be', full: 'Be sữa' },
                              { name: '🌸 Hồng', full: 'Hồng phấn' }, { name: '🔵 Xanh', full: 'Xanh pastel' },
                              { name: '🟡 Vàng', full: 'Vàng đồng' }, { name: '🟣 Tím', full: 'Tím mộng mơ' },
                              { name: '🟤 Nâu', full: 'Nâu tây' }
                            ];
                            return (
                              <div className="space-y-2">
                                {/* Header: Số lượng điều chỉnh */}
                                <div className="flex items-center gap-2 bg-blue-50/60 border border-blue-200/70 rounded-lg px-2.5 py-1.5">
                                  <span className="text-[11px] font-bold text-blue-700 shrink-0">📦 Số lượng Size {sz}:</span>
                                  <div className="flex items-center gap-1.5 ml-auto">
                                    <button type="button"
                                      onClick={() => {
                                        const newQty = Math.max(1, qty - 1);
                                        const newVariants = variants.slice(0, newQty);
                                        setFormState(prev => ({
                                          ...prev,
                                          sizeQtyMap: { ...prev.sizeQtyMap, [sz]: newQty },
                                          sizeColorVariants: { ...prev.sizeColorVariants, [sz]: newVariants }
                                        }));
                                      }}
                                      className="w-6 h-6 rounded-md bg-white border border-blue-200 text-blue-700 font-black text-sm flex items-center justify-center hover:bg-blue-100 transition cursor-pointer"
                                    >−</button>
                                    <span className="text-sm font-black text-blue-800 min-w-[20px] text-center">{qty}</span>
                                    <button type="button"
                                      onClick={() => {
                                        const newQty = qty + 1;
                                        const newVariants = [...variants, variants[0] || ''];
                                        setFormState(prev => ({
                                          ...prev,
                                          sizeQtyMap: { ...prev.sizeQtyMap, [sz]: newQty },
                                          sizeColorVariants: { ...prev.sizeColorVariants, [sz]: newVariants }
                                        }));
                                      }}
                                      className="w-6 h-6 rounded-md bg-white border border-blue-200 text-blue-700 font-black text-sm flex items-center justify-center hover:bg-blue-100 transition cursor-pointer"
                                    >+</button>
                                  </div>
                                  <span className="text-[10px] text-blue-600/80 font-medium">chiếc</span>
                                </div>
                                {/* Từng chiếc: màu riêng */}
                                {Array.from({ length: qty }).map((_, qIdx) => {
                                  const pieceColor = variants[qIdx] ?? (formState.sizeColorMap[sz] || '');
                                  return (
                                    <div key={qIdx} className="space-y-1.5 bg-gray-50/80 border border-gray-200/80 rounded-lg p-2.5">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-[11px] font-bold text-gray-700 shrink-0 flex items-center gap-1">
                                          <span>🎨 {qty > 1 ? `Chiếc ${qIdx + 1} – Màu:` : `Màu sắc Size ${sz}:`}</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={pieceColor}
                                          onChange={e => {
                                            const val = e.target.value;
                                            const updated = [...(formState.sizeColorVariants[sz] || Array(qty).fill(''))];
                                            updated[qIdx] = val;
                                            setFormState(prev => ({
                                              ...prev,
                                              sizeColorVariants: { ...prev.sizeColorVariants, [sz]: updated },
                                              sizeColorMap: { ...prev.sizeColorMap, [sz]: qIdx === 0 ? val : (prev.sizeColorMap[sz] || '') }
                                            }));
                                          }}
                                          placeholder="Gõ màu tùy ý (VD: Đỏ đô, Be sữa...)"
                                          className="flex-1 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-850 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1 flex-wrap pl-0.5">
                                        <span className="text-[10px] text-gray-400 font-medium shrink-0">Chọn nhanh:</span>
                                        {COLORS.map(col => {
                                          const isActive = pieceColor === col.full;
                                          return (
                                            <button key={col.name} type="button"
                                              onClick={() => {
                                                const updated = [...(formState.sizeColorVariants[sz] || Array(qty).fill(''))];
                                                updated[qIdx] = col.full;
                                                setFormState(prev => ({
                                                  ...prev,
                                                  sizeColorVariants: { ...prev.sizeColorVariants, [sz]: updated },
                                                  sizeColorMap: { ...prev.sizeColorMap, [sz]: qIdx === 0 ? col.full : (prev.sizeColorMap[sz] || '') }
                                                }));
                                              }}
                                              className={`text-[10px] px-2 py-0.5 rounded-md transition cursor-pointer font-bold border ${isActive ? 'bg-orange-600 text-white border-orange-600 shadow-2xs ring-1 ring-orange-300' : 'bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-800 border-gray-200'}`}
                                              title={`Chọn màu ${col.full}`}
                                            >{col.name}</button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {/* Image row for this specific size / color */}
                          <div className="flex items-center gap-2 pt-1 border-t border-dashed border-gray-150 text-xs">
                            <div className="w-9 h-9 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                              {currentSizeImg ? (
                                <img src={currentSizeImg} alt={`Ảnh Size ${sz}`} className="w-full h-full object-cover" />
                              ) : formState.image ? (
                                <img src={formState.image} alt="Ảnh mặc định" className="w-full h-full object-cover opacity-60" title="Đang dùng ảnh chung" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              )}
                            </div>

                            <input
                              type="url"
                              value={currentSizeImg}
                              onChange={e => {
                                const val = e.target.value;
                                setFormState(prev => ({
                                  ...prev,
                                  sizeImageMap: {
                                    ...prev.sizeImageMap,
                                    [sz]: val
                                  }
                                }));
                              }}
                              placeholder={`URL ảnh riêng cho Size ${sz} / màu này (để trống sẽ dùng ảnh chung)...`}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-mono text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />

                            <label className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-300 rounded-lg text-[10.5px] font-bold cursor-pointer transition">
                              <Upload className="w-3 h-3" />
                              <span className="hidden sm:inline">Tải ảnh</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const img = new Image();
                                      img.onload = () => {
                                        const maxW = 600;
                                        const scale = img.width > maxW ? maxW / img.width : 1;
                                        const canvas = document.createElement('canvas');
                                        canvas.width = Math.round(img.width * scale);
                                        canvas.height = Math.round(img.height * scale);
                                        const ctx = canvas.getContext('2d')!;
                                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                        const compImg = canvas.toDataURL('image/jpeg', 0.7);
                                        setFormState(prev => ({
                                          ...prev,
                                          sizeImageMap: {
                                            ...prev.sizeImageMap,
                                            [sz]: compImg
                                          }
                                        }));
                                      };
                                      img.src = ev.target?.result as string;
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                  e.target.value = '';
                                }}
                              />
                            </label>

                            {currentSizeImg && (
                              <button
                                type="button"
                                onClick={() => setFormState(prev => {
                                  const next = { ...prev.sizeImageMap };
                                  delete next[sz];
                                  return { ...prev, sizeImageMap: next };
                                })}
                                className="text-gray-400 hover:text-red-500 text-xs px-1"
                                title="Bỏ ảnh riêng, dùng ảnh chung"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Measurements & Accessories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Số đo chuẩn tham khảo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Số đo chuẩn tham khảo</label>
                    {detailSuggestions.measurements.length > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60">
                        ⚡ Có gợi ý
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    list="suggest-measurements"
                    value={formState.measurements}
                    onChange={e => setFormState({ ...formState, measurements: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Ngực 86 - Eo 66 - Mông 92, dài 140cm"
                  />
                  <datalist id="suggest-measurements">
                    {detailSuggestions.measurements.map((m, idx) => (
                      <option key={idx} value={m} />
                    ))}
                  </datalist>
                  {detailSuggestions.measurements.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5 max-h-16 overflow-y-auto">
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">Đã nhập:</span>
                      {detailSuggestions.measurements.slice(0, 5).map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormState(prev => ({ ...prev, measurements: m }))}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer font-medium truncate max-w-[170px] ${
                            formState.measurements === m
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-bold'
                              : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border-gray-200'
                          }`}
                          title={m}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phụ kiện đi kèm mặc định */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Phụ kiện đi kèm mặc định</label>
                    {detailSuggestions.includedAccessories.length > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60">
                        ⚡ Có gợi ý
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    list="suggest-accessories"
                    value={formState.includedAccessories}
                    onChange={e => setFormState({ ...formState, includedAccessories: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Voan dài 3m, vương miện, nơ cổ chú rể..."
                  />
                  <datalist id="suggest-accessories">
                    {detailSuggestions.includedAccessories.map((acc, idx) => (
                      <option key={idx} value={acc} />
                    ))}
                  </datalist>
                  {detailSuggestions.includedAccessories.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5 max-h-16 overflow-y-auto">
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">Đã nhập:</span>
                      {detailSuggestions.includedAccessories.slice(0, 6).map((acc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormState(prev => {
                              const current = prev.includedAccessories?.trim() || '';
                              if (!current) return { ...prev, includedAccessories: acc };
                              if (current.includes(acc)) return prev;
                              return { ...prev, includedAccessories: `${current}, ${acc}` };
                            });
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer font-medium truncate max-w-[150px] ${
                            formState.includedAccessories?.includes(acc)
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-bold'
                              : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border-gray-200'
                          }`}
                          title={`Bấm để thêm: ${acc}`}
                        >
                          + {acc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Fabric & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chất liệu vải / Kiểu dáng */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Chất liệu vải / Kiểu dáng</label>
                    {detailSuggestions.type.length > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60">
                        ⚡ Có gợi ý
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    list="suggest-types"
                    value={formState.type}
                    onChange={e => setFormState({ ...formState, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Lụa satin, Ren thêu hoa chìm, Gấm..."
                  />
                  <datalist id="suggest-types">
                    {detailSuggestions.type.map((tp, idx) => (
                      <option key={idx} value={tp} />
                    ))}
                  </datalist>
                  {detailSuggestions.type.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5 max-h-16 overflow-y-auto">
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">Đã nhập:</span>
                      {detailSuggestions.type.slice(0, 6).map((tp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormState(prev => {
                              const current = prev.type?.trim() || '';
                              if (!current) return { ...prev, type: tp };
                              if (current.includes(tp)) return prev;
                              return { ...prev, type: `${current}, ${tp}` };
                            });
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer font-medium truncate max-w-[150px] ${
                            formState.type?.includes(tp)
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-bold'
                              : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border-gray-200'
                          }`}
                          title={`Bấm để thêm: ${tp}`}
                        >
                          {tp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thương hiệu / Xưởng thiết kế */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Thương hiệu / Xưởng thiết kế</label>
                    {detailSuggestions.brand.length > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60">
                        ⚡ Có gợi ý
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    list="suggest-brands"
                    value={formState.brand}
                    onChange={e => setFormState({ ...formState, brand: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Caos Atelier, Hàng may đo cao cấp..."
                  />
                  <datalist id="suggest-brands">
                    {detailSuggestions.brand.map((b, idx) => (
                      <option key={idx} value={b} />
                    ))}
                  </datalist>
                  {detailSuggestions.brand.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5 max-h-16 overflow-y-auto">
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">Đã nhập:</span>
                      {detailSuggestions.brand.slice(0, 5).map((b, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormState(prev => ({ ...prev, brand: b }))}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer font-medium truncate max-w-[150px] ${
                            formState.brand === b
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-bold'
                              : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border-gray-200'
                          }`}
                          title={b}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Cover Image Link / Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">
                    Ảnh bìa trang phục (Link URL hoặc Tải ảnh)
                  </label>
                  {formState.image && (
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, image: '' }))}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer transition"
                    >
                      ✕ Xóa ảnh
                    </button>
                  )}
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden shrink-0 flex items-center justify-center relative shadow-3xs">
                    {formState.image ? (
                      <img
                        src={formState.image}
                        alt="Xem trước ảnh bìa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-1 p-2 text-center">
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                        <span className="text-[9px] font-semibold">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <input
                        type="url"
                        value={formState.image}
                        onChange={e => setFormState(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                        placeholder="Dán link ảnh URL (VD: https://...)"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-bold transition cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính / điện thoại</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const img = new Image();
                                img.onload = () => {
                                  const maxW = 600;
                                  const scale = img.width > maxW ? maxW / img.width : 1;
                                  const canvas = document.createElement('canvas');
                                  canvas.width = Math.round(img.width * scale);
                                  canvas.height = Math.round(img.height * scale);
                                  const ctx = canvas.getContext('2d')!;
                                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  setFormState(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.7) }));
                                };
                                img.src = ev.target?.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <span className="text-[10px] text-gray-400">hoặc dán đường dẫn ảnh trực tiếp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiered Pricing Section: Dedicated for Printer VS Regular for Cameras */}
              {formState.category === 'Printer' ? (
                <div className="bg-rose-50/50 p-3.5 sm:p-4 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-rose-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🖨️</span>
                      <div>
                        <label className="block text-xs font-black text-rose-950 uppercase tracking-wide">
                          BẢNG GIÁ IN ẢNH THEO SỐ LƯỢNG TẤM
                        </label>
                        <span className="text-[10.5px] text-rose-700 font-medium">Đơn giá tự động nhảy theo đúng số lượng tấm ảnh in</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-3xs space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700">1 - 2 tấm (Chuẩn)</label>
                        <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">40K</span>
                      </div>
                      <MoneyInput
                        value={formState.printPrice1To2}
                        onChange={v => setFormState(prev => ({ ...prev, printPrice1To2: v, dailyRate: v, price1Day: v }))}
                        className="border border-gray-250 bg-white rounded-lg p-2 text-xs font-bold text-rose-900 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        suffixColor="rose"
                        placeholder="40.000"
                      />
                      <span className="text-[9.5px] text-gray-400 block text-right font-medium">40.000đ / tấm</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-3xs space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700">3 - 9 tấm (Ưu đãi)</label>
                        <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">35K</span>
                      </div>
                      <MoneyInput
                        value={formState.printPrice3To9}
                        onChange={v => setFormState(prev => ({ ...prev, printPrice3To9: v }))}
                        className="border border-gray-250 bg-white rounded-lg p-2 text-xs font-bold text-rose-900 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        suffixColor="rose"
                        placeholder="35.000"
                      />
                      <span className="text-[9.5px] text-gray-400 block text-right font-medium">35.000đ / tấm</span>
                    </div>

                    <div className="bg-rose-100/60 p-2.5 rounded-xl border border-rose-300 shadow-3xs space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-rose-950">Từ 10 tấm trở lên</label>
                        <span className="text-[9.5px] font-extrabold text-white bg-rose-600 px-1.5 py-0.2 rounded">33K</span>
                      </div>
                      <MoneyInput
                        value={formState.printPrice10Plus}
                        onChange={v => setFormState(prev => ({ ...prev, printPrice10Plus: v }))}
                        className="border border-rose-300 bg-white rounded-lg p-2 text-xs font-black text-rose-900 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        suffixColor="rose"
                        placeholder="33.000"
                      />
                      <span className="text-[9.5px] text-rose-700 block text-right font-bold">33.000đ / tấm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-150 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-extrabold text-orange-950 truncate">
                      BẢNG GIÁ THEO NGÀY (CHÍNH XÁC THEO TỪNG MỐC)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const p1 = formState.price1Day || formState.dailyRate || 290000;
                        const p2_daily = Math.max(0, p1 - 30000);
                        const p4_daily = Math.max(0, p1 - 40000);
                        const p3_daily = p4_daily;

                        setFormState(prev => ({
                          ...prev,
                          price1Day: p1,
                          dailyRate: p1,
                          price2Days: p1 + p2_daily,
                          price3Days: p1 + p2_daily + p3_daily,
                          price4DaysPlus: p4_daily
                        }));
                      }}
                      className="text-[10px] text-orange-850 font-bold bg-orange-100 hover:bg-orange-200 border border-orange-200 px-2 py-0.5 rounded-full transition cursor-pointer shrink-0 flex items-center gap-1"
                      title="Tự động tính các mốc giá theo giá 1 ngày"
                    >
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      <span>Tính giá lũy tiến</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá thuê 1 ngày (Chuẩn)</label>
                        <MoneyInput
                          value={formState.price1Day}
                          onChange={v => setFormState(prev => ({ ...prev, price1Day: v, dailyRate: v }))}
                          className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
                          placeholder="VD: 350.000"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá thuê 2 ngày (VND)</label>
                        <MoneyInput
                          value={formState.price2Days}
                          onChange={v => setFormState(prev => ({ ...prev, price2Days: v }))}
                          className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
                          placeholder="VD: 650.000"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá thuê 3 ngày (VND)</label>
                        <MoneyInput
                          value={formState.price3Days}
                          onChange={v => setFormState(prev => ({ ...prev, price3Days: v }))}
                          className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
                          placeholder="VD: 950.000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá từ ngày thứ 4 trở đi (VND/ngày)</label>
                      <MoneyInput
                        value={formState.price4DaysPlus}
                        onChange={v => setFormState(prev => ({ ...prev, price4DaysPlus: v }))}
                        className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        suffixColor="gray"
                        placeholder="VD: 300.000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Original Purchase Price / Capital Investment */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>💎 Giá gốc / Vốn nhập đồ (VNĐ)</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Tự động chuyển vào Khoản chi & Doanh thu
                  </span>
                </div>
                <MoneyInput
                  value={formState.purchasePrice || 0}
                  onChange={v => setFormState({ ...formState, purchasePrice: v })}
                  placeholder="VD: 1.200.000"
                  className="border border-emerald-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-gray-800 font-bold"
                  suffixColor="emerald"
                />
                <p className="text-[10.5px] text-emerald-700/90 leading-tight">
                  💡 Chi phí mua/may mẫu này sẽ tự động được ghi nhận vào mục <b>Khoản chi</b> và tính vào chi phí ở mục <b>Doanh thu</b> của tiệm.
                </p>
              </div>

              {/* Deposit Money Option */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-950">
                    Trị giá cọc trang phục quy định (VNĐ)
                  </label>
                  <span className="text-[10px] text-amber-800 font-semibold">Tự động điền khi tạo đơn</span>
                </div>
                <MoneyInput
                  value={formState.depositAmount || 0}
                  onChange={v => setFormState({ ...formState, depositAmount: v })}
                  placeholder="VD: 2.000.000"
                  className="border border-amber-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-gray-800"
                  suffixColor="amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Trạng thái cho thuê</label>
                <select
                  value={formState.status}
                  onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-gray-750"
                >
                  <option value="Available">Sẵn sàng cho thuê (Available)</option>
                  <option value="Rented">Đang được khách thuê (Rented)</option>
                  <option value="Maintenance">Đang giặt hấp / May sửa (Maintenance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ghi chú tình trạng / Phụ kiện kèm theo</label>
                <textarea
                  value={formState.conditionNotes}
                  onChange={e => setFormState({ ...formState, conditionNotes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                  placeholder="VD: Đồ kèm voan cô dâu, vương miện và tùng váy xếp ly. Tình trạng vải mới 99%, đính đá thủ công..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-650 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white font-medium px-5 py-2 rounded-xl text-sm hover:bg-orange-700 transition-all cursor-pointer"
                >
                  {editingCamera ? 'Lưu thay đổi' : 'Thêm vào tủ đồ'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Delete Confirmation Modal */}
      {cameraToDelete && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-scale-up">
            <div className="bg-rose-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                ⚠️ Xác nhận xóa trang phục
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCameraToDelete(null);
                  setDeleteError(null);
                }}
                className="text-white hover:text-rose-100 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 border-t border-gray-50">
              {deleteError ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 text-amber-850 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                    {deleteError}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCameraToDelete(null);
                        setDeleteError(null);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs px-4 py-2.5 rounded-lg border border-gray-200 transition-all cursor-pointer"
                    >
                      Đã hiểu và Đóng lại
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-650 text-sm font-medium leading-relaxed">
                    Bạn có chắc chắn muốn xóa trang phục <strong className="text-red-700 font-black">{cameraToDelete.name}</strong> (S/N: {cameraToDelete.serialNumber}) ra khỏi hệ thống quản lý kho?
                  </p>
                  <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-xl text-xs text-gray-500 leading-relaxed font-semibold">
                    🔍 <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Tên trang phục trong các hợp đồng trong quá khứ vẫn sẽ được giữ nguyên dạng văn bản thô để đảm bảo tính minh bạch hóa đơn.
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCameraToDelete(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-lg border border-gray-200 transition-all cursor-pointer"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteCamera(cameraToDelete.id);
                        setCameraToDelete(null);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-rose-600 transition-all shadow-xs cursor-pointer"
                    >
                      Xác nhận xóa hoàn toàn
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


