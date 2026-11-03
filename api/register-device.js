import { saveRegisteredToken } from './_fcmHelper.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://efiadllfvhsqhditgewd.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_cr3cMMyKGudQZE3L3lBQMA_62CN0KZ8";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, deviceType } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // 1. Lưu vào Firestore (hạ tầng giống hệt app máy ảnh)
    await saveRegisteredToken(token, deviceType).catch(() => {});

    // 2. Lưu vào Supabase
    try {
      const { data: row } = await supabase
        .from('camlease_store')
        .select('value')
        .eq('key', 'fcm_registered_devices')
        .maybeSingle();

      let list = [];
      if (row && row.value) {
        try { list = JSON.parse(row.value); } catch (e) {}
      }

      const newRecord = {
        token,
        deviceType: deviceType || 'Unknown',
        updatedAt: new Date().toISOString()
      };

      const updated = Array.isArray(list) 
        ? [...list.filter(item => item.token !== token), newRecord]
        : [newRecord];

      await supabase
        .from('camlease_store')
        .upsert({
          key: 'fcm_registered_devices',
          value: JSON.stringify(updated),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
    } catch (e) {}

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in /api/register-device:', err);
    return res.status(500).json({ error: err.message });
  }
}
