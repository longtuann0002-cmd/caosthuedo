import { RentalContract } from '../types';
import { formatDMY } from './dateUtils';

/**
 * Chuẩn hóa số điện thoại Việt Nam sang định dạng 10 số (bắt đầu bằng 0)
 */
export function normalizePhone(rawPhone: string): string {
  let p = (rawPhone || '').replace(/\D/g, '');
  if (p.startsWith('84')) {
    p = '0' + p.slice(2);
  }
  return p;
}

export type ZaloMessageType = 'booking_confirmed' | 'pickup_reminder' | 'return_reminder' | 'overdue_alert';

/**
 * Tạo nội dung tin nhắn Zalo chuyên nghiệp theo tiêu chuẩn chăm sóc khách hàng
 */
export function generateZaloMessage(contract: RentalContract, type: ZaloMessageType = 'booking_confirmed'): string {
  const brandName = 'TIỆM NHÀ CAOS';
  const custName = (contract.customerName || 'Quý khách').trim();
  const code = contract.contractCode || 'Đơn thuê';
  const start = formatDMY(contract.startDate);
  const end = formatDMY(contract.endDate);
  
  const itemsText = (contract.items || [])
    .map(it => ` • ${it.cameraName.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim()}${it.size ? ` (Size ${it.size})` : ''}`)
    .join('\n');

  const remaining = Math.max(0, (contract.totalPrice || 0) + (contract.surchargeAmount || 0) - (contract.paidAmount || 0));

  if (type === 'booking_confirmed') {
    return `✨ [${brandName}] XÁC NHẬN ĐƠN THUÊ TRANG PHỤC ✨

Kính gửi: ${custName},
Tiệm nhà Caos xin gửi thông tin xác nhận lịch thuê trang phục của bạn:

🔖 Mã đơn: ${code}
👗 Trang phục thuê:
${itemsText || ' • Trang phục theo thỏa thuận'}

📅 Ngày nhận đồ: ${start}
📅 Ngày hoàn trả: ${end}

💰 Tiền thuê đồ: ${(contract.totalPrice || 0).toLocaleString()}đ
💵 Đã cọc giữ đồ: ${(contract.paidAmount || 0).toLocaleString()}đ
${remaining > 0 ? `👉 Số tiền còn lại khi nhận đồ: ${remaining.toLocaleString()}đ\n` : '✅ Đã thanh toán đầy đủ\n'}
📍 Lưu ý: Khi đến nhận trang phục, bạn vui lòng mang theo CCCD gốc hoặc giấy tờ tùy thân theo thỏa thuận nhé.

Tiệm nhà Caos xin cảm ơn và chúc bạn có những khoảnh khắc thật đẹp! 🌸
Hotline hỗ trợ: 0344.559.941`;
  }

  if (type === 'return_reminder') {
    return `🌸 [${brandName}] NHẮC HẸN HOÀN TRẢ TRANG PHỤC 🌸

Kính gửi: ${custName},
Hôm nay (${end}) là ngày hoàn trả trang phục cho đơn hàng ${code}:

👗 Danh sách đồ:
${itemsText || ' • Trang phục thuê'}

Tiệm xin nhờ bạn kiểm tra đầy đủ phụ kiện và gửi trả trước giờ đóng cửa để tiệm kịp giặt hấp bảo dưỡng cho các lịch thuê tiếp theo nhé!
${remaining > 0 ? `👉 Tiền thanh toán còn lại: ${remaining.toLocaleString()}đ\n` : ''}
Cảm ơn bạn đã tin tưởng lựa chọn Tiệm nhà Caos! 💕`;
  }

  if (type === 'overdue_alert') {
    return `⚠️ [${brandName}] THÔNG BÁO QUÁ HẠN THUÊ ĐỒ ⚠️

Kính gửi: ${custName},
Đơn thuê trang phục mã ${code} của bạn đã quá hạn trả từ ngày ${end}.

Tiệm xin phiền bạn liên hệ hoặc mang đồ qua tiệm sớm nhất trong hôm nay để hoàn tất thủ tục và tránh phát sinh thêm phí phụ thu theo ngày nhé!
📞 Hotline hỗ trợ: 0344.559.941. Cảm ơn bạn!`;
  }

  // Mặc định: Thông báo chuẩn
  return `✨ [${brandName}] THÔNG TIN ĐƠN THUÊ ${code} ✨\nKhách hàng: ${custName}\nNgày thuê: ${start} → ${end}\nĐồ thuê:\n${itemsText}`;
}

/**
 * Mở ứng dụng Zalo tới khung chat số điện thoại khách kèm tin nhắn đã tự động sao chép
 */
export function openZaloChat(phone: string, text?: string): { success: boolean; message: string } {
  const clean = normalizePhone(phone);
  if (!clean || clean.length < 9) {
    return { success: false, message: 'Số điện thoại không hợp lệ để gửi tin Zalo!' };
  }

  if (text && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const zaloUrl = `https://zalo.me/${clean}`;
  window.open(zaloUrl, '_blank', 'noopener,noreferrer');
  return { 
    success: true, 
    message: 'Đã mở Zalo và sao chép sẵn nội dung tin nhắn! Bạn chỉ cần dán (Ctrl+V) vào khung chat Zalo rồi bấm gửi.' 
  };
}
