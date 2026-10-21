import { Camera, RentalContract, Customer, Expense } from '../types';

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'outfit-1',
    name: 'Áo Dài Cách Tân Dáng Suông Tơ Ánh Kim',
    shortName: 'Áo Dài Suông AD03',
    category: 'Áo dài',
    purchasePrice: 1200000,
    dailyRate: 250000,
    price1Day: 250000,
    price2Days: 230000,
    price3Days: 210000,
    price4DaysPlus: 190000,
    depositAmount: 1000000,
    status: 'Available',
    serialNumber: 'AD-03',
    size: 'M',
    color: 'Trắng Tinh Khôi',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Áo dài cách tân suông nhẹ nhàng tơ ánh kim, đính kết hoa nhí tinh xảo, phong cách tiểu thư nàng thơ.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-2',
    name: 'Set Trang Phục Nàng Thơ Pháp Vintage Chụp Ảnh',
    shortName: 'Vintage Pháp CA01',
    category: 'Chụp ảnh',
    purchasePrice: 1500000,
    dailyRate: 280000,
    price1Day: 280000,
    price2Days: 250000,
    price3Days: 230000,
    price4DaysPlus: 200000,
    depositAmount: 1200000,
    status: 'Available',
    serialNumber: 'CA-01',
    size: 'S',
    color: 'Trắng Kem Ivory',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Set váy phong cách vintage cổ điển Pháp, phối ren và nơ tiểu thư ngọt ngào, chuyên concept lookbook.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-3',
    name: 'Set Cổ Trang Hán Phục Cách Điệu Nữ Tính',
    shortName: 'Hán Phục Cách Điệu CP02',
    category: 'Concept',
    purchasePrice: 1350000,
    dailyRate: 250000,
    price1Day: 250000,
    price2Days: 230000,
    price3Days: 210000,
    price4DaysPlus: 190000,
    depositAmount: 1000000,
    status: 'Available',
    serialNumber: 'CP-02',
    size: 'L',
    color: 'Hồng Phấn / Be Nude',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Set hán phục cách điệu thướt tha, tay loe tơ kính bồng bềnh, phù hợp chụp studio và ngoại cảnh.',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-4',
    name: 'Set Blazer Dáng Rộng Unisex Phong Cách Minimalism',
    shortName: 'Blazer Unisex CA02',
    category: 'Chụp ảnh',
    purchasePrice: 1100000,
    dailyRate: 220000,
    price1Day: 220000,
    price2Days: 200000,
    price3Days: 180000,
    price4DaysPlus: 160000,
    depositAmount: 1000000,
    status: 'Available',
    serialNumber: 'CA-02',
    size: 'XL',
    color: 'Đen Tuyền',
    gender: 'Unisex',
    cleaningStatus: 'Clean',
    description: 'Blazer dáng thụng cá tính phối quần tây ống rộng, thích hợp chụp concept kỷ yếu, lookbook hiện đại.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-5',
    name: 'Áo Dài Tơ Tằm Thêu Tay Họa Tiết Hoa Sen',
    shortName: 'Áo Dài Sen AD01',
    category: 'Áo dài',
    purchasePrice: 950000,
    dailyRate: 180000,
    price1Day: 180000,
    price2Days: 160000,
    price3Days: 145000,
    price4DaysPlus: 130000,
    depositAmount: 800000,
    status: 'Available',
    serialNumber: 'AD-01',
    size: 'M',
    color: 'Hồng Phấn Pastel',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Áo dài lụa tơ tằm 4 tà thướt tha, thêu tay chỉ tơ thủ công hoa sen truyền thống tinh tế.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-6',
    name: 'Áo Dài Gấm Cách Tân Nàng Thơ Tay Bồng',
    shortName: 'Áo Dài Gấm AD02',
    category: 'Áo dài',
    purchasePrice: 850000,
    dailyRate: 160000,
    price1Day: 160000,
    price2Days: 145000,
    price3Days: 130000,
    price4DaysPlus: 120000,
    depositAmount: 700000,
    status: 'Available',
    serialNumber: 'AD-02',
    size: 'S',
    color: 'Đỏ Đô Nhung',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Áo dài gấm vân hoa chìm sang chảnh, thiết kế tay lỡ bồng tiểu thư, thích hợp chụp Tết, lễ cưới.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-7',
    name: 'Set Cổ Phục Nhật Bình Triều Nguyễn Thêu Phượng',
    shortName: 'Nhật Bình CP01',
    category: 'Concept',
    purchasePrice: 1600000,
    dailyRate: 280000,
    price1Day: 280000,
    price2Days: 250000,
    price3Days: 230000,
    price4DaysPlus: 200000,
    depositAmount: 1200000,
    status: 'Available',
    serialNumber: 'CP-01',
    size: 'Freesize',
    color: 'Xanh Cổ Vịt / Vàng Hoàng Gia',
    gender: 'Unisex',
    cleaningStatus: 'Clean',
    description: 'Trọn bộ áo Nhật Bình, ngũ thân lót trong, khăn vấn và chuỗi ngọc bích tái hiện chuẩn phong cách cổ trang.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-8',
    name: 'Đầm Dạ Hội Kim Tuyến Xẻ Tà Cắt Lưng Quyến Rũ',
    shortName: 'Dạ Hội Kim Tuyến DH01',
    category: 'Dạ hội',
    purchasePrice: 1800000,
    dailyRate: 320000,
    price1Day: 320000,
    price2Days: 290000,
    price3Days: 260000,
    price4DaysPlus: 230000,
    depositAmount: 1500000,
    status: 'Available',
    serialNumber: 'DH-01',
    size: 'M',
    color: 'Bạc Ánh Kim',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Đầm dạ tiệc đuôi cá đính kim tuyến lấp lánh, xẻ tà cao quyến rũ, cúp ngực tôn đường cong dự event.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'outfit-9',
    name: 'Combo Phụ Kiện (Mấn + Quạt Cổ Trang + Trang Sức)',
    shortName: 'Combo Phụ Kiện PK01',
    category: 'Phụ kiện',
    purchasePrice: 380000,
    dailyRate: 80000,
    price1Day: 80000,
    price2Days: 70000,
    price3Days: 60000,
    price4DaysPlus: 50000,
    depositAmount: 300000,
    status: 'Available',
    serialNumber: 'PK-01',
    size: 'Freesize',
    color: 'Vàng Đồng & Ngọc Bích',
    gender: 'Nữ',
    cleaningStatus: 'Clean',
    description: 'Bộ phụ kiện chụp ảnh gồm mấn đội đầu thêu hoa, quạt lụa cổ phong và trâm cài ngọc bích.',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Nguyễn Thị Thu Hà',
    phone: '0982647900',
    email: 'thuha.photo@gmail.com',
    address: 'Q. Cầu Giấy, Hà Nội',
    idNumber: '001198004567',
    trustLevel: 'High',
    rentalCount: 3,
    totalSpent: 1650000,
    notes: 'Khách hàng thân thiết, giữ gìn trang phục rất sạch sẽ và trả đồ đúng giờ.',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-2',
    name: 'Trần Văn Hoàng',
    phone: '0912445889',
    email: 'hoangtran.art@gmail.com',
    address: 'Q. Đống Đa, Hà Nội',
    idNumber: '001095012389',
    trustLevel: 'High',
    rentalCount: 2,
    totalSpent: 950000,
    notes: 'Thuê set hán phục cổ trang chụp ảnh ngoại cảnh.',
    createdAt: '2026-02-10'
  },
  {
    id: 'cust-3',
    name: 'Lê Mai Anh',
    phone: '0978332115',
    email: 'maianh.event@gmail.com',
    address: 'Q. Hai Bà Trưng, Hà Nội',
    idNumber: '034199008765',
    trustLevel: 'Medium',
    rentalCount: 1,
    totalSpent: 320000,
    notes: 'Thuê đầm dạ hội đi tiệc cuối năm công ty.',
    createdAt: '2026-03-05'
  }
];

export const INITIAL_CONTRACTS: RentalContract[] = [
  {
    id: 'con-001',
    contractCode: 'HD-2026-001',
    customerId: 'cust-1',
    customerName: 'Nguyễn Thị Thu Hà',
    customerPhone: '0982647900',
    customerDocType: 'CCCD_And_1M',
    customerDocNote: '',
    items: [
      {
        cameraId: 'outfit-1',
        cameraName: 'Áo Dài Cách Tân Dáng Suông Tơ Ánh Kim',
        dailyRate: 250000,
        quantity: 1
      },
      {
        cameraId: 'outfit-9',
        cameraName: 'Combo Phụ Kiện (Mấn + Quạt Cổ Trang + Trang Sức)',
        dailyRate: 80000,
        quantity: 1
      }
    ],
    startDate: '2026-10-08',
    endDate: '2026-10-10',
    totalPrice: 1470000,
    discountPercent: 0,
    paidAmount: 1470000,
    depositAmount: 1000000,
    status: 'Completed',
    note: 'Đã trả đồ đủ phụ kiện mấn và quạt, đồ nguyên vẹn sạch sẽ.',
    createdAt: '2026-10-07T10:00:00Z'
  },
  {
    id: 'con-002',
    contractCode: 'HD-2026-002',
    customerId: 'cust-2',
    customerName: 'Trần Văn Hoàng',
    customerPhone: '0912445889',
    customerDocType: 'CCCD',
    customerDocNote: '',
    items: [
      {
        cameraId: 'outfit-3',
        cameraName: 'Set Cổ Trang Hán Phục Cách Điệu Nữ Tính',
        dailyRate: 250000,
        quantity: 1
      }
    ],
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    totalPrice: 500000,
    discountPercent: 0,
    paidAmount: 500000,
    depositAmount: 0,
    status: 'Active',
    note: 'Khách hẹn trả trước 18:00 ngày 11/10.',
    createdAt: '2026-10-09T14:30:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Chi phí giặt hấp cao cấp áo dài tơ tằm & đầm dạ hội (5 chiếc)',
    amount: 350000,
    date: '2026-10-05',
    category: 'Maintenance',
    operator: 'Tiệm Giặt Hấp Hà Thành'
  },
  {
    id: 'exp-2',
    description: 'Mua bổ sung móc treo chuyên dụng & túi bọc chống bụi',
    amount: 250000,
    date: '2026-10-06',
    category: 'Equipment',
    operator: 'Quản lý kho'
  },
  {
    id: 'exp-3',
    description: 'Tiền mặt bằng showroom trưng bày tháng 10',
    amount: 5000000,
    date: '2026-10-01',
    category: 'Rent',
    operator: 'Chủ nhà'
  }
];

export function cleanSystemNote(note?: string | null): string {
  if (!note) return '';
  return note
    .replace(/\[Trạng thái\]:[^\[]*/gi, '')
    .replace(/\[Hệ thống\]:[^\[]*/gi, '')
    .trim();
}

// Lưu trữ độc lập cho app cho thuê trang phục (clothesrental_)
const STORAGE_PREFIX = 'clothesrental_';

export function loadStoredData<T>(key: string, defaultVal: T): T {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (key === 'contracts' && Array.isArray(parsed)) {
        return parsed.map((c: any) => ({
          ...c,
          note: cleanSystemNote(c.note)
        })) as unknown as T;
      }
      return parsed;
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
  }
  return defaultVal;
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

