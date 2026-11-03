import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const VAPID_PUBLIC_KEY = 'BFdOUMYKm4To9BslDx7lKLZ7AmBZx3dbYFilvaeZrQVQ45KkteeuVTmt8ot-O_nx5ZugXFDBvd-RTaPRC0UKt_4';
const VAPID_PRIVATE_KEY = 'TM5__w9vJxAf2SKplBepFAQAPyUBkNOnOzMZtiXyYxw';

try {
  webpush.setVapidDetails(
    'mailto:longtuann0002@gmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (e) {
  console.warn('Set VAPID details warning:', e.message);
}

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
    const { title, body, data } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // 1. Lấy danh sách WebPush Subscriptions (Apple APNs / Google) từ Supabase
    const { data: row } = await supabase
      .from('camlease_store')
      .select('value')
      .eq('key', 'apple_webpush_subscriptions')
      .maybeSingle();

    let subscriptions = [];
    if (row && row.value) {
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) {
          subscriptions = parsed.map(item => item.subscription || item).filter(Boolean);
        }
      } catch (e) {}
    }

    if (subscriptions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Chưa có thiết bị nào đăng ký nhận tin màn hình khóa.',
        delivered: 0
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      data: data || {},
      tag: 'order-' + Date.now()
    });

    // 2. Gửi đồng loạt tới tất cả các thiết bị qua Apple APNs / WebPush
    const results = await Promise.allSettled(
      subscriptions.map(sub => 
        webpush.sendNotification(sub, payload, {
          TTL: 86400,
          urgency: 'high'
        })
      )
    );

    let delivered = 0;
    let failed = 0;
    const expiredEndpoints = [];

    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        delivered++;
      } else {
        failed++;
        // Nếu Apple trả về mã 410 (Gone) hoặc 404: Subscription đã hết hạn
        if (r.reason && (r.reason.statusCode === 410 || r.reason.statusCode === 404)) {
          expiredEndpoints.push(subscriptions[idx]?.endpoint);
        }
      }
    });

    // Tự động dọn dẹp các subscription đã hết hạn
    if (expiredEndpoints.length > 0) {
      try {
        const validSubs = subscriptions.filter(s => !expiredEndpoints.includes(s.endpoint));
        await supabase
          .from('camlease_store')
          .upsert({
            key: 'apple_webpush_subscriptions',
            value: JSON.stringify(validSubs),
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      delivered,
      failed,
      total: subscriptions.length
    });
  } catch (err) {
    console.error('Error in /api/send-push:', err);
    return res.status(500).json({ error: err.message });
  }
}
