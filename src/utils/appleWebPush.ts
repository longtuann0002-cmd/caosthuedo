import { syncToSupabase, fetchFromSupabase, isSupabaseConfigured } from './supabase';
import { isIOS, isStandalone, isNotificationSupported } from './pushNotification';

export const VAPID_PUBLIC_KEY = 'BFdOUMYKm4To9BslDx7lKLZ7AmBZx3dbYFilvaeZrQVQ45KkteeuVTmt8ot-O_nx5ZugXFDBvd-RTaPRC0UKt_4';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const STORAGE_KEY_SUBSCRIBED = 'apple_webpush_subscribed_flag';

export async function isAppleWebPushSubscribed(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch (e) {
    return false;
  }
}

export async function registerAppleWebPushSubscription(): Promise<{
  success: boolean;
  endpoint?: string;
  error?: string;
}> {
  if (!isNotificationSupported()) {
    if (isIOS() && !isStandalone()) {
      return {
        success: false,
        error: 'Trên iPhone, bạn cần bấm Chia sẻ ➔ Thêm vào Màn hình chính trước khi kích hoạt thông báo!'
      };
    }
    return { success: false, error: 'Trình duyệt không hỗ trợ Web Push Notification.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Bạn đã từ chối cấp quyền thông báo.' };
    }

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }

    if (!sub) {
      return { success: false, error: 'Không thể tạo PushSubscription với Apple APNs.' };
    }

    const subJson = sub.toJSON();
    const deviceType = isIOS() ? 'iOS (iPhone/iPad)' : /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop/Web';
    
    const record = {
      subscription: subJson,
      endpoint: sub.endpoint,
      deviceType,
      updatedAt: new Date().toISOString()
    };

    // 1. Lưu vào Supabase Cloud (để máy chủ đọc khi có đơn mới)
    if (isSupabaseConfigured) {
      try {
        const existing = await fetchFromSupabase('apple_webpush_subscriptions') || [];
        const filtered = Array.isArray(existing) ? existing.filter((item: any) => item.endpoint !== sub?.endpoint) : [];
        filtered.push(record);
        await syncToSupabase('apple_webpush_subscriptions', filtered);
      } catch (err) {
        console.warn('Lưu subscription lên Supabase:', err);
      }
    }

    // 2. Gửi thẳng lên Server API nếu có backend
    try {
      fetch('/api/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subJson, deviceType })
      }).catch(() => {});
    } catch (e) {}

    localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');
    return { success: true, endpoint: sub.endpoint };
  } catch (err: any) {
    console.error('Lỗi đăng ký Apple Web Push:', err);
    return { success: false, error: err?.message || 'Không thể đăng ký với dịch vụ Push.' };
  }
}
