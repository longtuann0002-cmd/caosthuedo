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
 * Fetch synchronized data state from Supabase cloud database.
 * Automatically reassembles chunked data when key has a manifest stored
 * under `${key}_manifest` (used for large payloads like cameras).
 */
export async function fetchFromSupabase(key: string): Promise<any | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    // Check if there is a chunked manifest for this key
    const { data: manifestData } = await client
      .from('camlease_store')
      .select('value')
      .eq('key', `${key}_manifest`)
      .maybeSingle();

    if (manifestData && manifestData.value) {
      const manifest = JSON.parse(manifestData.value);
      const { totalChunks } = manifest;
      if (typeof totalChunks === 'number' && totalChunks > 0) {
        console.log(`[Supabase] Fetching "${key}" from ${totalChunks} chunks...`);
        const chunkPromises = Array.from({ length: totalChunks }, (_, i) =>
          client
            .from('camlease_store')
            .select('value')
            .eq('key', `${key}_chunk_${i}`)
            .maybeSingle()
        );
        const chunkResults = await Promise.all(chunkPromises);
        const combined: any[] = [];
        for (const res of chunkResults) {
          if (res.error) {
            console.warn(`[Supabase] Chunk fetch error:`, res.error.message);
            return null;
          }
          if (res.data && res.data.value) {
            const chunk = JSON.parse(res.data.value);
            combined.push(...chunk);
          }
        }
        console.log(`[Supabase] Reassembled ${combined.length} items from chunks for "${key}"`);
        return combined;
      }
    }

    // Regular (non-chunked) fetch
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

/**
 * Sync large arrays to Supabase in chunks to avoid payload size limits.
 * Each chunk is stored as `${key}_chunk_N`, with a manifest at `${key}_manifest`.
 * Falls back to regular upsert for small payloads (< 2MB).
 */
export async function syncToSupabaseChunked(key: string, data: any[], chunkSize = 12): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const jsonStr = JSON.stringify(data);
  const sizeMB = jsonStr.length / 1024 / 1024;

  // If payload is small enough, use regular upsert
  if (sizeMB < 2) {
    return syncToSupabase(key, data);
  }

  try {
    const totalChunks = Math.ceil(data.length / chunkSize);
    console.log(`[Supabase] Chunked sync for "${key}": ${data.length} items in ${totalChunks} chunks`);

    for (let i = 0; i < totalChunks; i++) {
      const slice = data.slice(i * chunkSize, (i + 1) * chunkSize);
      const { error } = await client
        .from('camlease_store')
        .upsert({ key: `${key}_chunk_${i}`, value: JSON.stringify(slice), updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) {
        console.warn(`[Supabase] Chunk ${i} sync failed for "${key}":`, error.message);
        return false;
      }
    }

    // Write manifest
    const { error: manifestErr } = await client
      .from('camlease_store')
      .upsert({ key: `${key}_manifest`, value: JSON.stringify({ totalChunks, totalItems: data.length }), updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (manifestErr) {
      console.warn(`[Supabase] Manifest sync failed for "${key}":`, manifestErr.message);
      return false;
    }

    // Remove old non-chunked entry if it exists
    await client.from('camlease_store').delete().eq('key', key);

    console.log(`[Supabase] Chunked sync complete for "${key}": ${data.length} items`);
    return true;
  } catch (err: any) {
    console.error(`[Supabase] Chunked sync exception for "${key}":`, err);
    return false;
  }
}

/**
 * Upload an image (File, Blob, or base64 DataURL) directly to Supabase Storage bucket 'outfits'.
 * Returns the public URL on success, or falls back to returning the original dataUrl/base64 if failed or offline.
 */
export async function uploadOutfitImageToStorage(
  imageSource: File | Blob | string,
  customNamePrefix = 'outfit'
): Promise<string> {
  const client = getSupabase();
  if (!client) {
    if (typeof imageSource === 'string') return imageSource;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(imageSource as Blob);
    });
  }

  try {
    let blob: Blob;
    let ext = 'jpg';
    let contentType = 'image/jpeg';

    if (typeof imageSource === 'string') {
      if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
        return imageSource;
      }
      const matches = imageSource.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contentType = matches[1];
        ext = contentType.includes('png') ? 'png' : 'jpg';
        const byteCharacters = atob(matches[2]);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        blob = new Blob([byteNumbers], { type: contentType });
      } else {
        return imageSource;
      }
    } else if (imageSource instanceof File || imageSource instanceof Blob) {
      blob = imageSource;
      contentType = imageSource.type || 'image/jpeg';
      ext = contentType.includes('png') ? 'png' : 'jpg';
    } else {
      return '';
    }

    const cleanPrefix = customNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'outfit';
    const fileName = `${cleanPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await client.storage
      .from('outfits')
      .upload(fileName, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('[Supabase Storage] Upload failed, using fallback:', uploadError.message);
      if (typeof imageSource === 'string') return imageSource;
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    const { data: publicData } = client.storage.from('outfits').getPublicUrl(fileName);
    if (publicData?.publicUrl) {
      return publicData.publicUrl;
    }
  } catch (err) {
    console.error('[Supabase Storage] Exception uploading outfit image:', err);
  }

  if (typeof imageSource === 'string') return imageSource;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(imageSource as Blob);
  });
}

