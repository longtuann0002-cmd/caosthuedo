import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials safely from Vite env and LocalStorage
export function getSupabaseCredentials() {
  const metaEnv = (import.meta as any).env || {};
  let url = metaEnv.VITE_SUPABASE_URL || '';
  let anonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('custom_supabase_url');
    const localKey = localStorage.getItem('custom_supabase_key');
    if (localUrl && localUrl.trim().startsWith('https://')) {
      url = localUrl.trim();
    }
    if (localKey && localKey.trim().length > 20) {
      anonKey = localKey.trim();
    }
  }

  const isConfigured = !!(
    url && 
    anonKey && 
    url !== 'YOUR_SUPABASE_URL' &&
    !url.toLowerCase().includes('placeholder') &&
    !url.toLowerCase().includes('your_supabase') &&
    url.startsWith('https://') &&
    anonKey.length > 20 &&
    anonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
  );

  return { url, anonKey, isConfigured };
}

// Current client singleton
let activeClient: SupabaseClient | null = null;
let activeUrl = '';
let activeKey = '';

export function getSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) {
    activeClient = null;
    return null;
  }
  if (!activeClient || activeUrl !== creds.url || activeKey !== creds.anonKey) {
    activeUrl = creds.url;
    activeKey = creds.anonKey;
    activeClient = createClient(creds.url, creds.anonKey);
  }
  return activeClient;
}

// Evaluate configuration status
export const isSupabaseConfigured = getSupabaseCredentials().isConfigured;

// Backward-compatible exported instance (lazy-bound proxy)
export const supabase = getSupabase();

/**
 * Save or remove custom credentials in LocalStorage
 */
export function saveCustomSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem('custom_supabase_url', url.trim());
    } else {
      localStorage.removeItem('custom_supabase_url');
    }
    if (key.trim()) {
      localStorage.setItem('custom_supabase_key', key.trim());
    } else {
      localStorage.removeItem('custom_supabase_key');
    }
  }
  activeClient = null;
}

/**
 * Test Supabase connection and check if table 'camlease_store' exists
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string; needSchema?: boolean }> {
  try {
    const creds = getSupabaseCredentials();
    const url = customUrl !== undefined ? customUrl.trim() : creds.url;
    const key = customKey !== undefined ? customKey.trim() : creds.anonKey;

    if (!url || !key) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Supabase URL và Supabase Anon Key.' };
    }
    if (!url.startsWith('https://')) {
      return { success: false, message: 'Supabase URL không hợp lệ. Phải bắt đầu bằng https://' };
    }
    if (key.length < 20) {
      return { success: false, message: 'Supabase Anon Key không hợp lệ hoặc quá ngắn.' };
    }

    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('camlease_store').select('key').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist') || error.message.includes('relation "camlease_store" does not exist')) {
        return { 
          success: false, 
          needSchema: true,
          message: 'Kết nối máy chủ thành công, nhưng chưa tạo bảng "camlease_store". Hãy vào SQL Editor của Supabase chạy lệnh khởi tạo.' 
        };
      }
      return { success: false, message: `Lỗi Supabase: ${error.message}` };
    }

    return { success: true, message: 'Kết nối Supabase thành công! Cơ sở dữ liệu đám mây sẵn sàng hoạt động.' };
  } catch (err: any) {
    return { success: false, message: `Không thể kết nối đến máy chủ: ${err?.message || 'Lỗi mạng'}` };
  }
}

/**
 * Synchronize data state to Supabase cloud database
 */
export async function syncToSupabase(key: string, data: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client
      .from('camlease_store')
      .upsert(
        { 
          key, 
          value: JSON.stringify(data), 
          updated_at: new Date().toISOString() 
        }, 
        { onConflict: 'key' }
      );
    
    if (error) {
      console.warn(`[Supabase] Sync failed for "${key}":`, error.message);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('supabase-sync-error', { 
          detail: { key, message: error.message } 
        }));
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error(`[Supabase] Exception syncing "${key}":`, err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supabase-sync-error', { 
        detail: { key, message: err?.message || 'Lỗi mạng hoặc dữ liệu vượt hạn mức' } 
      }));
    }
    return false;
  }
}

/**
 * Fetch synchronized data state from Supabase cloud database
 */
export async function fetchFromSupabase(key: string): Promise<any | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('camlease_store')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.warn(`[Supabase] Fetch failed for "${key}":`, error.message);
      return null;
    }
    
    if (data && data.value) {
      return JSON.parse(data.value);
    }
  } catch (err) {
    console.error(`[Supabase] Exception fetching "${key}":`, err);
  }
  return null;
}
