import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, RentalContract } from '../types';
import MoneyInput from './MoneyInput';
import { DressIcon } from './DressIcon';
import { Search, Plus, Filter, Camera as CameraIcon, CheckCircle, Flame, Server, ShieldCheck, RefreshCw, Trash2, Edit2, ChevronLeft, ChevronRight, Download, FileSpreadsheet, Image as ImageIcon, Upload, Link as LinkIcon, Sparkles, Clock, ArrowLeft, ArrowRight, GripVertical, Layers, LayoutGrid, List } from 'lucide-react';
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

  // Lock body scroll whenever modal is open
  useScrollLock(Boolean(showAddModal || cameraToDelete));
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
    category: 'Áo dài' as Camera['category'],
    isPrinter: false,
    purchasePrice: 1200000,
    dailyRate: 350000,
    price1Day: 350000,
    price2Days: 650000,
    price3Days: 950000,
    price4DaysPlus: 300000,
    depositAmount: 1500000,
    status: 'Available' as Camera['status'],
    serialNumber: '',
    description: '',
    image: '',
    size: 'M',
    selectedSizes: ['M'] as string[],
    splitBySize: false,
    sizeColorMap: {} as Record<string, string>, // màu riêng cho từng size khi tách
    sizeImageMap: {} as Record<string, string>, // ảnh riêng cho từng size khi tách
    color: 'Trắng Tinh Khôi',
    gender: 'Nữ' as 'Nữ' | 'Nam' | 'Unisex',
    cleaningStatus: 'Clean' as 'Clean' | 'Laundry' | 'Mending',
    measurements: '',
    includedAccessories: '',
    brand: '',
    type: '',
    printPrice1To2: 40000,
    printPrice3To9: 35000,
    printPrice10Plus: 33000,
  });

  const filteredCameras = useMemo(() => {
    const result = cameras.filter(c => {
      const query = searchQuery.trim();
      const matchesSearch = matchCamera(c, query).matched;

      const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
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
  const categoryCounts = useMemo(() => {
    return {
      ALL: cameras.length,
      'Áo dài': cameras.filter(c => c.category === 'Áo dài').length,
      'Concept': cameras.filter(c => c.category === 'Concept').length,
      'Dạ hội': cameras.filter(c => c.category === 'Dạ hội').length,
      'Chụp ảnh': cameras.filter(c => c.category === 'Chụp ảnh').length,
      'Phụ kiện': cameras.filter(c => c.category === 'Phụ kiện').length,
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
      sizeColorMap: { [nextSize]: rep.color || 'Trắng tinh khôi' },
      sizeImageMap: {},
      color: rep.color || 'Trắng tinh khôi',
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
      category: 'Áo dài',
      isPrinter: false,
      purchasePrice: 1200000,
      dailyRate: 350000,
      price1Day: 350000,
      price2Days: 650000,
      price3Days: 950000,
      price4DaysPlus: 300000,
      depositAmount: 1500000,
      status: 'Available',
      serialNumber: 'VC-',
      description: '',
      image: '',
      size: 'M',
      selectedSizes: ['M'],
      splitBySize: false,
      sizeColorMap: { 'M': 'Trắng tinh khôi' },
      sizeImageMap: {},
      color: 'Trắng tinh khôi',
      gender: 'Nữ',
      cleaningStatus: 'Clean',
      measurements: '',
      includedAccessories: '',
      brand: 'Caos Atelier',
      type: 'Lụa Satin / Ren đính đá',
      printPrice1To2: 40000,
      printPrice3To9: 35000,
      printPrice10Plus: 33000,
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
      shortName: cam.shortName,
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
      sizeColorMap: (rawSizes.length > 0 ? rawSizes : ['M']).reduce((acc, s) => ({ ...acc, [s]: cam.color || 'Trắng tinh khôi' }), {}),
      sizeImageMap: {},
      color: cam.color || 'Trắng tinh khôi',
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
    if (!formState.name || !formState.shortName || !formState.serialNumber) {
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
    const imageRef = formState.image || categoryDefaultImages[formState.category] || 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600';
    
    const sizesToSave = formState.selectedSizes.length > 0 ? formState.selectedSizes : ['M'];
    const sizeString = sizesToSave.join(', ');

    // Chia 2 cho giá ngày thứ 2, chia 3 cho ngày thứ 3 để có đơn giá/ngày đúng
    const savedFormState = {
      ...formState,
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
        const rawSerial = (formState.serialNumber || 'VC-01').trim();
        const baseSerial = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || 'VC-01';
        const cleanName = savedFormState.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || savedFormState.name;
        const firstColor = (formState.sizeColorMap[firstSize] && formState.sizeColorMap[firstSize].trim()) || savedFormState.color || 'Trắng tinh khôi';
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
          const sizeColor = (formState.sizeColorMap[sz] && formState.sizeColorMap[sz].trim()) || savedFormState.color || 'Trắng tinh khôi';
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
        const rawSerial = (formState.serialNumber || 'VC-01').trim();
        const cleanName = savedFormState.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || savedFormState.name;
        const sizeColor = (formState.sizeColorMap[singleSize] && formState.sizeColorMap[singleSize].trim()) || savedFormState.color || 'Trắng tinh khôi';
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
        const rawSerial = (formState.serialNumber || 'VC-01').trim();
        const baseSerial = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || 'VC-01';
        sizesToSave.forEach((sz, idx) => {
          const sizeCode = sz === 'Freesize' ? 'FS' : sz;
          const sizeColor = (formState.sizeColorMap[sz] && formState.sizeColorMap[sz].trim()) || savedFormState.color || 'Trắng tinh khôi';
          const sizeSpecificImg = (formState.sizeImageMap[sz] && formState.sizeImageMap[sz].trim()) || imageRef;
          const newCam: Camera = {
            ...savedFormState,
            id: `outfit-${Date.now()}-${idx}`,
            name: `${savedFormState.name} (${sz === 'Freesize' ? 'Freesize' : `Size ${sz}`})`,
            serialNumber: `${baseSerial}-${sizeCode}`,
            size: sz,
            availableSizes: [sz],
            color: sizeColor,
            image: sizeSpecificImg
          };
          onAddCamera(newCam);
        });
      } else {
        // Chỉ chọn 1 size duy nhất (VD: Freesize hoặc Size M)
        const singleSize = sizesToSave[0] || 'Freesize';
        const rawSerial = (formState.serialNumber || 'VC-01').trim();
        const sizeColor = (formState.sizeColorMap[singleSize] && formState.sizeColorMap[singleSize].trim()) || savedFormState.color || 'Trắng tinh khôi';
        const sizeSpecificImg = (formState.sizeImageMap[singleSize] && formState.sizeImageMap[singleSize].trim()) || imageRef;
        const newCam: Camera = {
          id: `outfit-${Date.now()}`,
          ...savedFormState,
          serialNumber: rawSerial,
          size: singleSize,
          availableSizes: [singleSize],
          color: sizeColor,
          image: sizeSpecificImg
        };
        onAddCamera(newCam);
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
              <option value="Áo dài">Áo dài ({categoryCounts['Áo dài'] || 0})</option>
              <option value="Concept">Cổ phục & Concept ({categoryCounts['Concept'] || 0})</option>
              <option value="Dạ hội">Đầm dạ hội ({categoryCounts['Dạ hội'] || 0})</option>
              <option value="Chụp ảnh">Chụp ảnh & Cosplay ({categoryCounts['Chụp ảnh'] || 0})</option>
              <option value="Phụ kiện">Phụ kiện ({categoryCounts['Phụ kiện'] || 0})</option>
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
              { id: 'Áo dài', name: 'Áo dài', fullName: 'Áo dài truyền thống & Cách tân', count: categoryCounts['Áo dài'] || 0, color: 'bg-pink-600 border-pink-600 text-white' },
              { id: 'Concept', name: 'Concept', fullName: 'Cổ phục & Concept chụp ảnh', count: categoryCounts['Concept'] || 0, color: 'bg-purple-600 border-purple-600 text-white' },
              { id: 'Dạ hội', name: 'Dạ hội', fullName: 'Đầm dạ hội tiệc tối', count: categoryCounts['Dạ hội'] || 0, color: 'bg-amber-600 border-amber-600 text-white' },
              { id: 'Chụp ảnh', name: 'Chụp ảnh', fullName: 'Trang phục chụp ảnh & Cosplay', count: categoryCounts['Chụp ảnh'] || 0, color: 'bg-cyan-600 border-cyan-600 text-white' },
              { id: 'Phụ kiện', name: 'Phụ kiện', fullName: 'Phụ kiện đi kèm', count: categoryCounts['Phụ kiện'] || 0, color: 'bg-emerald-600 border-emerald-600 text-white' },
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
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative ${
                  isDraggingThis ? 'opacity-35 border-dashed border-orange-500 scale-[0.98]' :
                  isDragTarget ? 'border-orange-500 ring-2 ring-orange-400/60 scale-[1.01] shadow-lg' :
                  'border-gray-200/90 hover:border-orange-300'
                }`}
              >
                <div>
                  {/* Product Image strictly 4:5 Aspect Ratio (Dáng dọc thời trang 4:5) */}
                  <div className="w-full aspect-[4/5] overflow-hidden relative bg-gray-100">
                    <img
                      src={activeCam.image || group.image}
                      alt={group.cleanName}
                      className="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Top-left: Category & ShortName & Sizes count badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 max-w-[90%] flex-wrap z-10">
                      {currentUserRole === 'admin' && (
                        <div
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, activeCam.id)}
                          onDragEnd={handleDragEnd}
                          className="bg-black/60 hover:bg-orange-600 backdrop-blur-xs text-white p-1 rounded-full cursor-grab active:cursor-grabbing inline-flex items-center justify-center transition-colors shadow-sm shrink-0"
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
                              ✓ Sẵn sàng ({group.items.length}/{group.items.length} size)
                            </span>
                          );
                        }
                        if (group.readyCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-emerald-600/95 text-white backdrop-blur-xs">
                              ✓ Còn {group.readyCount}/{group.items.length} size
                            </span>
                          );
                        }
                        if (group.laundryCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-blue-700/95 text-white backdrop-blur-xs">
                              🧺 Đang giặt ({group.laundryCount} size)
                            </span>
                          );
                        }
                        if (group.mendingCount > 0) {
                          return (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md shadow-md bg-amber-700/95 text-white backdrop-blur-xs">
                              🪡 Đang sửa ({group.mendingCount} size)
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

                  {/* Product text details */}
                  <div className="p-3 sm:p-4 space-y-2.5">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-1" title={group.cleanName}>
                        {group.cleanName}
                      </h3>
                      <div className="text-gray-500 font-mono text-[11px] sm:text-xs mt-1 flex justify-between items-center">
                        <span>Mã: <b className="text-gray-800">{group.baseSerial}</b></span>
                        {group.gender && (
                          <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${group.gender === 'Nữ' ? 'bg-pink-50 text-pink-700 border border-pink-200' : group.gender === 'Nam' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700'}`}>
                            {group.gender}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Size & Color selector pills */}
                    <div className="space-y-1.5 bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 shadow-inner">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase text-gray-500 tracking-wider">
                        <span>Chọn size:</span>
                        <span className="text-orange-600 font-black capitalize">
                          Size {activeCam.size || 'FS'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map(cam => {
                          const isCurrent = cam.id === activeCam.id;
                          const isLdry = cam.cleaningStatus === 'Laundry';
                          const isMnd = cam.cleaningStatus === 'Mending';
                          const isRnt = cam.status === 'Rented';
                          const isMnt = cam.status === 'Maintenance';
                          const szLabel = cam.size || 'FS';

                          return (
                            <button
                              key={cam.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroupSizes(prev => ({ ...prev, [group.groupKey]: cam.id }));
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-orange-50 text-orange-950 border-2 border-orange-500 ring-2 ring-orange-300/80 shadow-xs scale-102 font-black'
                                  : 'bg-white text-gray-700 border-gray-250 hover:bg-orange-50/50 hover:border-orange-300'
                              }`}
                              title={`Bấm để chọn xem & thao tác Size ${szLabel}`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                isCurrent ? 'bg-orange-600' : isLdry ? 'bg-blue-500' : isMnd ? 'bg-amber-500' : isRnt ? 'bg-purple-500' : isMnt ? 'bg-rose-500' : 'bg-emerald-500'
                              }`} />
                              <span>Size {szLabel}</span>
                              {cam.color && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[85px] shadow-3xs ${
                                  isCurrent ? 'bg-white text-orange-950 border border-orange-300' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  🎨 {cam.color}
                                </span>
                              )}
                              {isLdry && <span className="text-[10px] text-blue-600">🧺</span>}
                              {isMnd && <span className="text-[10px] text-amber-600">🪡</span>}
                              {isRnt && <span className="text-[10px] text-purple-600">⏳</span>}
                              {isMnt && <span className="text-[10px] text-rose-600">🛠️</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Status of currently selected size */}
                      <div className="pt-1.5 mt-1 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500">
                        <span className="font-mono">Mã tem: <b className="text-gray-800">{activeCam.serialNumber}</b></span>
                        {(() => {
                          if (activeCam.status === 'Rented') return <span className="text-purple-700 font-bold bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">⏳ Đang thuê</span>;
                          if (activeCam.cleaningStatus === 'Laundry') return <span className="text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">🧺 Đang giặt</span>;
                          if (activeCam.cleaningStatus === 'Mending') return <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">🪡 Đang sửa</span>;
                          if (activeCam.status === 'Maintenance') return <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">🛠️ Bảo trì</span>;
                          return <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">✓ Sẵn sàng</span>;
                        })()}
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {activeCam.description || group.description || 'Chưa cung cấp mô tả chi tiết cho trang phục.'}
                    </p>

                    {/* Vốn nhập & Tiến độ hoàn vốn (ROI & Break-even) */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 sm:p-2.5 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] sm:text-xs">
                        <span className="text-gray-600 font-semibold flex items-center gap-1 truncate">
                          <span>💎 Vốn:</span>
                          <span className="font-mono font-bold text-gray-900 truncate" title={`Tổng vốn cả mẫu ${group.items.length} size`}>
                            {purchase > 0 ? `${purchase.toLocaleString()}đ` : '—'}
                          </span>
                          <span className="text-[10px] text-gray-400">({group.items.length} size)</span>
                        </span>
                        {roiPercent !== null && (
                          <span className={`px-1.5 py-0.5 rounded-md font-black text-[10px] sm:text-[11px] self-start sm:self-auto shrink-0 ${
                            isBreakeven
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {isBreakeven ? `✓ ${roiPercent}% Hoàn vốn` : `${roiPercent}% Hoàn vốn`}
                          </span>
                        )}
                      </div>

                      {/* Mini Progress Bar */}
                      {purchase > 0 && (
                        <div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isBreakeven ? 'bg-emerald-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${Math.min(roiPercent || 0, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-500 mt-1 font-medium">
                            <span className="truncate">Thu: <b className="text-gray-800 font-mono">{revenue.toLocaleString()}đ</b></span>
                            <span className="shrink-0">
                              {isBreakeven ? (
                                <span className="text-emerald-700 font-bold font-mono">+{(revenue - purchase).toLocaleString()}đ</span>
                              ) : (
                                <span>~<b className="text-orange-600 font-mono font-bold">{estRentalsLeft}</b> lượt nữa</span>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Tiered Rates info */}
                    <div className="bg-orange-50/60 border border-orange-200/90 rounded-xl p-2.5">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider">Giá thuê:</span>
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black text-orange-600 font-mono">
                            {(activeCam.price1Day ?? activeCam.dailyRate).toLocaleString()}đ
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">/ngày</span>
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-orange-200/60 flex items-center justify-between text-[10.5px] sm:text-xs">
                        <span className="text-gray-700 font-medium truncate">
                          Từ 4 ngày: <b className="font-mono font-bold text-orange-700">{(activeCam.price4DaysPlus ?? Math.max(0, (activeCam.price1Day ?? activeCam.dailyRate) - 40000)).toLocaleString()}đ</b>/ng
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePricingExpanded(group.groupKey)}
                          className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 ml-auto"
                        >
                          <span>{expandedPrices[group.groupKey] ? 'Thu gọn ▲' : 'Bảng giá ▼'}</span>
                        </button>
                      </div>
                      {expandedPrices[group.groupKey] && (
                        <div className="mt-2 pt-2 border-t border-orange-200/70 space-y-1 text-xs">
                          {(() => {
                            const p1 = activeCam.price1Day ?? activeCam.dailyRate;
                            const p2_daily = Math.max(0, p1 - 30000);
                            const p4_daily = Math.max(0, p1 - 40000);
                            const p3_daily = p4_daily;
                            const total2Days = Math.round((activeCam.price2Days ?? ((p1 + p2_daily) / 2)) * 2);
                            const total3Days = Math.round((activeCam.price3Days ?? ((p1 + p2_daily + p3_daily) / 3)) * 3);
                            const rateFrom4Days = activeCam.price4DaysPlus ?? p4_daily;

                            return (
                              <>
                                <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                  <span className="text-gray-600">1 ngày:</span>
                                  <span className="font-mono font-bold text-gray-800">{p1.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                  <span className="text-gray-600">2 ngày:</span>
                                  <span className="font-mono font-bold text-gray-800">{total2Days.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                  <span className="text-gray-600">3 ngày:</span>
                                  <span className="font-mono font-bold text-gray-800">{total3Days.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between items-center bg-orange-100/80 px-2.5 py-1 rounded border border-orange-200 font-medium">
                                  <span className="text-orange-950 font-bold">Từ 4 ngày:</span>
                                  <span className="font-mono font-black text-orange-600">{rateFrom4Days.toLocaleString()}đ/ng</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Status and Admin tools bar */}
                <div className="px-2.5 sm:px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-1.5">
                  {currentUserRole === 'admin' ? (
                    <>
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1 shadow-3xs shrink-0" title="Đổi vị trí mẫu áo trong kho">
                        <button
                          type="button"
                          onClick={() => handleMoveGroup(groupIndex, 'left')}
                          disabled={isFirst}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 disabled:pointer-events-none rounded transition cursor-pointer"
                          title="Di chuyển lên trước (←)"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-600 px-1 select-none" title={`Vị trí mẫu thứ ${groupIndex + 1}`}>
                          #{groupIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveGroup(groupIndex, 'right')}
                          disabled={isLast}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 disabled:pointer-events-none rounded transition cursor-pointer"
                          title="Di chuyển về sau (→)"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick Add Size to this model */}
                      <button
                        type="button"
                        onClick={() => handleAddSizeToGroup(group)}
                        className="text-[11px] sm:text-xs font-bold text-orange-700 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-200 hover:border-orange-600 px-2 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1 shrink-0"
                        title={`Thêm size mới cho mẫu "${group.cleanName}"`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Size</span>
                      </button>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => handleOpenEditModal(activeCam)}
                          className="text-gray-700 hover:text-orange-600 p-1.5 bg-white border border-gray-300 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer shadow-3xs"
                          title={`Sửa thông tin Size ${activeCam.size} (Admin)`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (activeCam.cleaningStatus === 'Laundry' || activeCam.cleaningStatus === 'Mending') {
                              onUpdateCamera({ ...activeCam, cleaningStatus: 'Clean' });
                            } else if (activeCam.status === 'Maintenance') {
                              onUpdateCamera({ ...activeCam, status: 'Available' });
                            } else {
                              onUpdateCamera({ ...activeCam, cleaningStatus: 'Laundry' });
                            }
                          }}
                          className={`text-[10px] sm:text-xs px-2 py-1.5 font-bold rounded-lg transition-all cursor-pointer shadow-3xs whitespace-nowrap ${
                            activeCam.cleaningStatus === 'Laundry'
                              ? 'bg-blue-50 border border-blue-300 text-blue-800 hover:bg-blue-100'
                              : activeCam.cleaningStatus === 'Mending'
                              ? 'bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100'
                              : activeCam.status === 'Maintenance'
                              ? 'bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100'
                              : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                          title={
                            activeCam.cleaningStatus === 'Laundry' ? 'Bấm để hoàn tất: Đã giặt sạch thơm' :
                            activeCam.cleaningStatus === 'Mending' ? 'Bấm để hoàn tất: Đã sửa xong' :
                            activeCam.status === 'Maintenance' ? 'Bấm để hoàn tất bảo trì' :
                            `Gửi Size ${activeCam.size} đi giặt hấp`
                          }
                        >
                          {activeCam.cleaningStatus === 'Laundry' ? '✨Giặt' :
                           activeCam.cleaningStatus === 'Mending' ? '✨Sửa' :
                           activeCam.status === 'Maintenance' ? '✓BT' :
                           '🧺'}
                        </button>

                        <button
                          onClick={() => {
                            if (activeCam.status === 'Rented') {
                              setDeleteError(`Trang phục "${activeCam.name}" đang trong trạng thái ĐANG THUÊ. Vui lòng hoàn tất hợp đồng thu hồi trước khi xóa.`);
                              setCameraToDelete(activeCam);
                            } else {
                              setDeleteError(null);
                              setCameraToDelete(activeCam);
                            }
                          }}
                          className="text-gray-500 hover:text-red-650 p-1.5 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all cursor-pointer shadow-3xs"
                          title={`Xóa Size ${activeCam.size} khỏi kho`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-gray-600 bg-gray-200/60 px-2.5 py-1 rounded-md uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-500 shrink-0" /> Chế độ xem (Staff)
                      </span>

                      <button
                        onClick={() => toggleMaintenance(activeCam)}
                        className={`text-xs px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                          activeCam.status === 'Maintenance'
                            ? 'bg-emerald-55 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={activeCam.status === 'Maintenance' ? 'Hoàn tất giặt hấp' : 'Báo cần giặt hấp / May sửa'}
                      >
                        {activeCam.status === 'Maintenance' ? 'Xong giặt/Sửa' : '🧺 Cần giặt/Sửa'}
                      </button>
                    </>
                  )}
                </div>
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

            return (
              <div 
                key={cam.id}
                onDragOver={(e) => handleDragOver(e, cam.id)}
                onDrop={(e) => handleDrop(e, cam.id)}
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative ${
                  isDraggingThis ? 'opacity-35 border-dashed border-orange-500 scale-[0.98]' :
                  isDragTarget ? 'border-orange-500 ring-2 ring-orange-400/60 scale-[1.01] shadow-lg' :
                  'border-gray-200/90 hover:border-orange-300'
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

                    {/* Fashion attributes row: size + color + cleaning */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      {(() => {
                        const rawSizes = (cam.availableSizes && cam.availableSizes.length > 0)
                          ? cam.availableSizes
                          : (cam.size ? cam.size.split(',').map(s => s.trim()).filter(Boolean) : []);
                        if (rawSizes.length === 0) return null;
                        return (
                          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                            <span className="text-xs font-bold text-slate-500">Size</span>
                            <div className="flex items-center gap-1">
                              {rawSizes.map(sz => (
                                <span
                                  key={sz}
                                  className="text-xs font-black bg-white text-slate-900 px-1.5 py-0.2 rounded shadow-2xs border border-slate-200"
                                >
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      {cam.color && (
                        <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200 truncate max-w-[130px]" title={cam.color}>
                          🎨 {cam.color}
                        </span>
                      )}
                      {cam.cleaningStatus && cam.cleaningStatus !== 'Clean' && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${cam.cleaningStatus === 'Laundry' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {cam.cleaningStatus === 'Laundry' ? '🧺 Đang giặt' : '🪡 Đang sửa'}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-xs line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {cam.description || 'Chưa cung cấp mô tả chi tiết cho trang phục.'}
                    </p>

                    {/* Vốn nhập & Tiến độ hoàn vốn (ROI & Break-even) */}
                    {(() => {
                      const purchase = cam.purchasePrice || 0;
                      const revenue = cameraRevenueMap[cam.id] || 0;
                      const roiPercent = purchase > 0 ? Math.round((revenue / purchase) * 100) : null;
                      const isBreakeven = roiPercent !== null && roiPercent >= 100;
                      const remaining = purchase > revenue ? purchase - revenue : 0;
                      const estRentalsLeft = remaining > 0 && cam.dailyRate > 0 ? Math.ceil(remaining / cam.dailyRate) : 0;

                      return (
                        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 sm:p-2.5 space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] sm:text-xs">
                            <span className="text-gray-600 font-semibold flex items-center gap-1 truncate">
                              <span>💎 Vốn:</span>
                              <span className="font-mono font-bold text-gray-900 truncate">
                                {purchase > 0 ? `${purchase.toLocaleString()}đ` : '—'}
                              </span>
                            </span>
                            {roiPercent !== null && (
                              <span className={`px-1.5 py-0.5 rounded-md font-black text-[10px] sm:text-[11px] self-start sm:self-auto shrink-0 ${
                                isBreakeven
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}>
                                {isBreakeven ? `✓ ${roiPercent}% Hoàn vốn` : `${roiPercent}% Hoàn vốn`}
                              </span>
                            )}
                          </div>

                          {/* Mini Progress Bar */}
                          {purchase > 0 && (
                            <div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isBreakeven ? 'bg-emerald-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${Math.min(roiPercent || 0, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-500 mt-1 font-medium">
                                <span className="truncate">Thu: <b className="text-gray-800 font-mono">{revenue.toLocaleString()}đ</b></span>
                                <span className="shrink-0">
                                  {isBreakeven ? (
                                    <span className="text-emerald-700 font-bold font-mono">+{(revenue - purchase).toLocaleString()}đ</span>
                                  ) : (
                                    <span>~<b className="text-orange-600 font-mono font-bold">{estRentalsLeft}</b> lượt nữa</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Dynamic Tiered Rates info - Unified Responsive (No overlap on Mobile or Desktop) */}
                    {cam.category === 'Printer' ? (
                      <div className="bg-rose-50/60 border border-rose-200/90 rounded-xl p-2.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-[10px] sm:text-[11px] text-rose-800 font-bold uppercase tracking-wider">In ảnh:</span>
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-rose-600 font-mono">
                              {(cam.printPrice1To2 ?? 40000).toLocaleString()}đ
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500">/tấm</span>
                          </div>
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-rose-200/60 flex items-center justify-between text-[10.5px] sm:text-xs">
                          <span className="text-rose-900 font-medium">10+ tấm: <b>{(cam.printPrice10Plus ?? 33000).toLocaleString()}đ</b></span>
                          <button
                            type="button"
                            onClick={() => togglePricingExpanded(cam.id)}
                            className="text-rose-700 hover:text-rose-900 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <span>{expandedPrices[cam.id] ? 'Thu gọn ▲' : 'Bảng giá ▼'}</span>
                          </button>
                        </div>
                        {expandedPrices[cam.id] && (
                          <div className="mt-2 pt-2 border-t border-rose-200/70 space-y-1 text-xs">
                            <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-rose-100">
                              <span className="text-gray-600">1 - 2 tấm:</span>
                              <span className="font-mono font-bold text-rose-700">{(cam.printPrice1To2 ?? 40000).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-rose-100">
                              <span className="text-gray-600">3 - 9 tấm:</span>
                              <span className="font-mono font-bold text-rose-700">{(cam.printPrice3To9 ?? 35000).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center bg-rose-100/80 px-2.5 py-1 rounded border border-rose-200 font-medium">
                              <span className="text-rose-950 font-bold">Từ 10 tấm:</span>
                              <span className="font-mono font-black text-rose-700">{(cam.printPrice10Plus ?? 33000).toLocaleString()}đ</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-orange-50/60 border border-orange-200/90 rounded-xl p-2.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider">Giá thuê:</span>
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-orange-600 font-mono">
                              {(cam.price1Day ?? cam.dailyRate).toLocaleString()}đ
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">/ngày</span>
                          </div>
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-orange-200/60 flex items-center justify-between text-[10.5px] sm:text-xs">
                          <span className="text-gray-700 font-medium truncate">
                            Từ 4 ngày: <b className="font-mono font-bold text-orange-700">{(cam.price4DaysPlus ?? Math.max(0, (cam.price1Day ?? cam.dailyRate) - 40000)).toLocaleString()}đ</b>/ng
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePricingExpanded(cam.id)}
                            className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 ml-auto"
                          >
                            <span>{expandedPrices[cam.id] ? 'Thu gọn ▲' : 'Bảng giá ▼'}</span>
                          </button>
                        </div>
                        {expandedPrices[cam.id] && (
                          <div className="mt-2 pt-2 border-t border-orange-200/70 space-y-1 text-xs">
                            {(() => {
                              const p1 = cam.price1Day ?? cam.dailyRate;
                              const p2_daily = Math.max(0, p1 - 30000);
                              const p4_daily = Math.max(0, p1 - 40000);
                              const p3_daily = p4_daily;
                              const total2Days = Math.round((cam.price2Days ?? ((p1 + p2_daily) / 2)) * 2);
                              const total3Days = Math.round((cam.price3Days ?? ((p1 + p2_daily + p3_daily) / 3)) * 3);
                              const rateFrom4Days = cam.price4DaysPlus ?? p4_daily;

                              return (
                                <>
                                  <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                    <span className="text-gray-600">1 ngày:</span>
                                    <span className="font-mono font-bold text-gray-800">{p1.toLocaleString()}đ</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                    <span className="text-gray-600">2 ngày:</span>
                                    <span className="font-mono font-bold text-gray-800">{total2Days.toLocaleString()}đ</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-orange-100">
                                    <span className="text-gray-600">3 ngày:</span>
                                    <span className="font-mono font-bold text-gray-800">{total3Days.toLocaleString()}đ</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-orange-100/80 px-2.5 py-1 rounded border border-orange-200 font-medium">
                                    <span className="text-orange-950 font-bold">Từ 4 ngày:</span>
                                    <span className="font-mono font-black text-orange-600">{rateFrom4Days.toLocaleString()}đ/ng</span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Status and Admin tools bar */}
                <div className="px-2.5 sm:px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-1.5">
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

      {/* Camera Add/Edit Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] animate-fade-in"
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden self-center border border-gray-100 animate-scale-up flex flex-col max-h-[90vh]">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { id: 'Áo dài', label: 'Áo dài', sub: 'Tết / Cưới / Lễ', icon: '🌸' },
                    { id: 'Concept', label: 'Concept', sub: 'Cổ phục / Nàng thơ', icon: '👘' },
                    { id: 'Dạ hội', label: 'Dạ hội', sub: 'Tiệc tối / Event', icon: '✨' },
                    { id: 'Chụp ảnh', label: 'Chụp ảnh', sub: 'Cosplay / Kỷ yếu', icon: '📸' },
                    { id: 'Phụ kiện', label: 'Phụ kiện', sub: 'Mấn / Nơ / Túi', icon: '🎀' },
                    { id: 'Khác', label: 'Khác', sub: 'Trang phục khác', icon: '👗' },
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
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold ring-2 ring-orange-200 shadow-3xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-medium'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs leading-tight font-bold">{cat.label}</span>
                        <span className="text-[9.5px] text-gray-400 font-normal">{cat.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tên viết tắt (Shorthand) *</label>
                  <input
                    type="text"
                    required
                    value={formState.shortName}
                    onChange={e => setFormState({ ...formState, shortName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Váy Công Chúa VC01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mã Tag / Số hiệu (S/N) *</label>
                  <input
                    type="text"
                    required
                    value={formState.serialNumber}
                    onChange={e => setFormState({ ...formState, serialNumber: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: VC-01, VEST-02, AD-05"
                  />
                </div>
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
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border text-center ${
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
                            if (!nextColorMap[s]) nextColorMap[s] = formState.color || 'Trắng tinh khôi';
                          });
                          setFormState(prev => ({
                            ...prev,
                            selectedSizes: newSizes,
                            size: newSizes.join(', '),
                            sizeColorMap: nextColorMap
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
                            if (!nextColorMap[s]) nextColorMap[s] = formState.color || 'Trắng tinh khôi';
                          });
                          setFormState(prev => ({
                            ...prev,
                            selectedSizes: newSizes,
                            size: newSizes.join(', '),
                            sizeColorMap: nextColorMap
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
                          if (!nextColorMap['Freesize']) nextColorMap['Freesize'] = formState.color || 'Trắng tinh khôi';
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
                              nextColorMap[sz] = formState.color || 'Trắng tinh khôi';
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
                      <span>⚡ Danh sách sản phẩm sẽ tự động tạo ({formState.selectedSizes.length} chiếc):</span>
                    </span>
                    <span className="text-[10.5px] text-orange-800/80 font-medium italic">
                      Mỗi size được cấp mã tag riêng & chọn màu độc lập
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
                    {formState.selectedSizes.map(sz => {
                      const sizeCode = sz === 'Freesize' ? 'FS' : sz;
                      const rawSerial = (formState.serialNumber || 'VC-01').trim();
                      const cleanBase = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || 'VC-01';
                      const displaySerial = formState.selectedSizes.length > 1
                        ? `${cleanBase}-${sizeCode}`
                        : rawSerial;
                      const currentColor = formState.sizeColorMap[sz] !== undefined && formState.sizeColorMap[sz] !== ''
                        ? formState.sizeColorMap[sz]
                        : (formState.color || 'Trắng tinh khôi');
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
                                  Mã: <strong className="text-orange-700">{displaySerial}</strong>
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {sz === 'Freesize' ? 'Kiểu dáng Freesize' : `Kích cỡ chuẩn ${sz}`}
                                </span>
                              </div>
                            </div>

                            {/* Current color badge pill */}
                            <div className="inline-flex items-center gap-1.5 bg-white border border-orange-200/90 px-2.5 py-1 rounded-full text-[11px] font-bold text-orange-950 shadow-2xs self-start sm:self-auto">
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-1 ring-orange-300 shrink-0"></span>
                              <span>Màu: <strong className="text-orange-700 font-black">{currentColor}</strong></span>
                            </div>
                          </div>

                          {/* Color picker section: Wide input + Quick color tags */}
                          <div className="space-y-1.5 bg-gray-50/80 border border-gray-200/80 rounded-lg p-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <label className="text-[11px] font-bold text-gray-700 shrink-0 flex items-center gap-1">
                                <span>🎨 Màu sắc riêng cho Size {sz}:</span>
                              </label>
                              <input
                                type="text"
                                value={formState.sizeColorMap[sz] ?? ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormState(prev => ({
                                    ...prev,
                                    sizeColorMap: {
                                      ...prev.sizeColorMap,
                                      [sz]: val
                                    }
                                  }));
                                }}
                                placeholder="Gõ màu tùy ý (VD: Đỏ đô, Be sữa, Trắng ngà, Xanh pastel...)"
                                className="flex-1 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-850 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                              />
                            </div>

                            {/* Mini quick color tags */}
                            <div className="flex items-center gap-1 flex-wrap pl-0.5">
                              <span className="text-[10px] text-gray-400 font-medium shrink-0">Chọn nhanh:</span>
                              {[
                                { name: '⚪ Trắng', full: 'Trắng tinh khôi' },
                                { name: '🔴 Đỏ', full: 'Đỏ đô' },
                                { name: '⚫ Đen', full: 'Đen tuyền' },
                                { name: '🌾 Be', full: 'Be sữa' },
                                { name: '🌸 Hồng', full: 'Hồng phấn' },
                                { name: '🔵 Xanh', full: 'Xanh pastel' },
                                { name: '🟡 Vàng', full: 'Vàng đồng' },
                                { name: '🟣 Tím', full: 'Tím mộng mơ' },
                                { name: '🟤 Nâu', full: 'Nâu tây' }
                              ].map(col => {
                                const isColActive = currentColor === col.full || (formState.sizeColorMap[sz] === col.name);
                                return (
                                  <button
                                    key={col.name}
                                    type="button"
                                    onClick={() => {
                                      setFormState(prev => ({
                                        ...prev,
                                        sizeColorMap: {
                                          ...prev.sizeColorMap,
                                          [sz]: col.full
                                        }
                                      }));
                                    }}
                                    className={`text-[10px] px-2 py-0.5 rounded-md transition cursor-pointer font-bold border ${
                                      isColActive
                                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs ring-1 ring-orange-300'
                                        : 'bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-800 border-gray-200'
                                    }`}
                                    title={`Chọn màu ${col.full}`}
                                  >
                                    {col.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

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
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Số đo chuẩn tham khảo</label>
                  <input
                    type="text"
                    value={formState.measurements}
                    onChange={e => setFormState({ ...formState, measurements: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Ngực 86 - Eo 66 - Mông 92, dài 140cm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phụ kiện đi kèm mặc định</label>
                  <input
                    type="text"
                    value={formState.includedAccessories}
                    onChange={e => setFormState({ ...formState, includedAccessories: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Voan dài 3m, vương miện, nơ cổ chú rể..."
                  />
                </div>
              </div>

              {/* Fabric & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Chất liệu vải / Kiểu dáng</label>
                  <input
                    type="text"
                    value={formState.type}
                    onChange={e => setFormState({ ...formState, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Lụa satin, Ren thêu hoa chìm, Gấm..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Thương hiệu / Xưởng thiết kế</label>
                  <input
                    type="text"
                    value={formState.brand}
                    onChange={e => setFormState({ ...formState, brand: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="VD: Caos Atelier, Hàng may đo cao cấp..."
                  />
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
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá thuê 2 ngày (VND)</label>
                        <MoneyInput
                          value={formState.price2Days}
                          onChange={v => setFormState(prev => ({ ...prev, price2Days: v }))}
                          className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">Giá thuê 3 ngày (VND)</label>
                        <MoneyInput
                          value={formState.price3Days}
                          onChange={v => setFormState(prev => ({ ...prev, price3Days: v }))}
                          className="border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          suffixColor="gray"
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
                    Dùng tính hoàn vốn & đền bù hỏng/mất
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
                  💡 Nhập chi phí mua hoặc may mẫu này. Hệ thống sẽ tự động đo lường tiến độ hoàn vốn (ROI) qua các lần cho thuê.
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


