export interface Camera {
  id: string;
  name: string; // Tên trang phục (VD: "Váy cưới công chúa cúp ngực đính đá")
  shortName: string; // Tên viết tắt (VD: "Váy cưới VC01")
  category: 'Váy' | 'Áo dài' | 'Dạ hội' | 'Concept' | 'Phụ kiện' | 'Chụp ảnh' | 'Khác' | string;
  dailyRate: number; // Giá thuê theo ngày (VNĐ)
  purchasePrice?: number; // Giá gốc / Vốn nhập sản phẩm (VNĐ)
  price6Hours?: number; // Giá thuê 6 tiếng (nửa ngày / buổi chụp)
  price1Day?: number; // Giá thuê 1 ngày
  price2Days?: number; // Giá thuê 2 ngày
  price3Days?: number; // Giá thuê 3 ngày
  price4DaysPlus?: number; // Giá thuê từ ngày thứ 4
  depositAmount?: number; // Tiền cọc giữ đồ quy định (VNĐ)
  status: 'Available' | 'Rented' | 'Maintenance'; // Trạng thái: Sẵn sàng | Đang thuê | Đang giặt hấp / bảo quản
  serialNumber: string; // Mã trang phục / Mã tag (VD: "VC-01", "AD-02")
  image?: string;
  description?: string;
  // Các thông số chuyên biệt cho ngành trang phục
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Freesize' | string; // Kích cỡ chính hoặc danh sách size (VD: "S, M, L")
  availableSizes?: string[]; // Mảng danh sách các size có sẵn của mẫu này (VD: ['S', 'M', 'L'])
  color?: string; // Màu sắc chủ đạo (VD: "Trắng kem", "Đỏ đô", "Đen tuyền")
  gender?: 'Nữ' | 'Nam' | 'Unisex'; // Dành cho Nam / Nữ
  cleaningStatus?: 'Clean' | 'Laundry' | 'Mending'; // Đã giặt sạch | Đang giặt ủi | Đang chỉnh sửa / may vá
  measurements?: string; // Số đo chuẩn tham khảo (VD: "Ngực 86 - Eo 66 - Mông 92")
  includedAccessories?: string; // Phụ kiện kèm theo (VD: "Voan dài 3m + Vương miện")
  brand?: string; // Thương hiệu / Xưởng thiết kế (VD: "Caos Atelier", "Nhập khẩu")
  type?: string; // Chất liệu / Dáng (VD: "Lụa Satin", "Ren đính pha lê", "Tơ tằm")
  // Hỗ trợ phụ kiện / dịch vụ đi kèm
  isPrinter?: boolean; // Tái sử dụng cho phụ kiện tính số lượng
  printPrice1To2?: number;
  printPrice3To9?: number;
  printPrice10Plus?: number;
}

export type Outfit = Camera; // Alias tiện dụng cho trang phục

export type ContractStatus = 'Pending' | 'Active' | 'Completed' | 'Overdue' | 'Cancelled';

export interface RentalContract {
  id: string;
  contractCode: string; // e.g. "HD-2026-001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerDocType: 'CCCD' | 'GPLX' | 'Passport' | 'CashDeposit' | 'CCCD_And_1M' | 'Other';
  customerDocNote?: string; // e.g. "Giữ CCCD gốc + Cọc 1.000.000đ"
  items: {
    cameraId: string;
    cameraName: string;
    dailyRate: number;
    quantity: number;
    printCount?: number;
    size?: string;
    color?: string;
  }[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  is6Hours?: boolean; // Thuê nửa ngày / 1 buổi chụp 6 tiếng
  startTime?: string; // Giờ nhận đồ
  returnTime?: string; // Giờ trả đồ
  totalPrice: number;
  discountPercent?: number; // Tỷ lệ giảm giá (%)
  paidAmount: number;
  depositAmount: number; // Tiền cọc hoặc tài sản cọc quy đổi
  status: ContractStatus;
  note?: string;
  fittingNotes?: string; // Số đo khách & Yêu cầu chỉnh sửa / Fitting (VD: Cao 1m62, nặng 48kg, eo 64cm, bóp eo 2cm)
  returnCondition?: 'Good' | 'NeedsCleaning' | 'Damaged' | 'MissingAccessories'; // Tình trạng khi hoàn trả đồ
  surchargeAmount?: number; // Phụ thu giặt tẩy / hư hỏng / quá hạn / gia hạn
  surchargeReason?: string; // Lý do phụ thu chi tiết
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string; // CCCD / Số định danh
  trustLevel: 'High' | 'Medium' | 'Low';
  rentalCount: number;
  notes?: string;
  totalSpent?: number;
  createdAt?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: 'Maintenance' | 'Equipment' | 'Marketing' | 'Utilities' | 'Rent' | 'Other';
  operator: string;
}

export interface BankConfig {
  bankId: string;
  accountNo: string;
  accountName: string;
}

export interface ContractTemplate {
  id: string;
  templateName: string;
  customerName: string;
  customerPhone: string;
  customerDocType: 'CCCD' | 'GPLX' | 'Passport' | 'CashDeposit' | 'CCCD_And_1M' | 'Other';
  customerDocNote: string;
  selectedCameraIds: string[];
  is6Hours?: boolean;
  returnTime?: string;
  depositAmount: number;
  paidAmountPct: number;
  paidAmount: number;
  discountPercent?: number;
  note: string;
  durationDays?: number;
}
