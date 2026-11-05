import { sendFCMMessage, getRegisteredTokens } from './_fcmHelper.js';
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
    const { title, body, data, targetToken } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    let tokens = [];
    if (targetToken) {
      tokens = [targetToken];
    } else {
      // 1. Lấy từ Firestore
      const firestoreTokens = await getRegisteredTokens().catch(() => []);
      
      // 2. Lấy thêm từ Supabase để đảm bảo 100% không sót thiết bị nào
      let supabaseTokens = [];
      try {
        const { data: row } = await supabase
          .from('camlease_store')
          .select('value')
          .eq('key', 'fcm_registered_devices')
          .maybeSingle();
        if (row && row.value) {
          const parsed = JSON.parse(row.value);
          if (Array.isArray(parsed)) {
            supabaseTokens = parsed.map(item => item.token || item).filter(Boolean);
          }
        }
      } catch (e) {}

      // Gộp và loại trừ trùng lặp
      const set = new Set([...firestoreTokens, ...supabaseTokens]);
      tokens = Array.from(set);
    }

    if (tokens.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No registered devices found to push to.',
        delivered: 0,
        total: 0
      });
    }

    // Send push to all tokens in parallel via Google FCM v1 / Apple APNs
    const results = await Promise.allSettled(
      tokens.map(token => sendFCMMessage(token, title, body, data))
    );

    let delivered = 0;
    let failed = 0;
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value?.ok) {
        delivered++;
      } else {
        failed++;
      }
    });

    return res.status(200).json({
      success: true,
      delivered,
      failed,
      total: tokens.length
    });
  } catch (err) {
    console.error('Error in /api/send-push:', err);
    return res.status(500).json({ error: err.message });
  }
}
