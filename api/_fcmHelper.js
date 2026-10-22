import crypto from 'crypto';

export const SERVICE_ACCOUNT = {
  project_id: process.env.FIREBASE_PROJECT_ID || '',
  client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
};

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getGoogleAccessToken() {
  if (!SERVICE_ACCOUNT.project_id || !SERVICE_ACCOUNT.client_email || !SERVICE_ACCOUNT.private_key) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiresAt - 60) {
    return cachedToken;
  }

  try {
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({
      iss: SERVICE_ACCOUNT.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }));

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(header + '.' + payload);
    const signature = sign.sign(SERVICE_ACCOUNT.private_key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const jwt = header + '.' + payload + '.' + signature;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt
    });

    const data = await res.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      tokenExpiresAt = now + (data.expires_in || 3600);
      return cachedToken;
    }
  } catch (err) {
    console.warn('[FCM] Failed to obtain Google access token:', err.message);
  }
  return null;
}

export async function sendFCMMessage(targetToken, title, body, dataPayload = {}) {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken || !SERVICE_ACCOUNT.project_id) {
    return { ok: false, message: 'Firebase service account not configured for this app' };
  }

  const url = 'https://fcm.googleapis.com/v1/projects/' + SERVICE_ACCOUNT.project_id + '/messages:send';

  const stringData = {};
  for (const [k, v] of Object.entries(dataPayload || {})) {
    stringData[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }

  const message = {
    message: {
      token: targetToken,
      notification: {
        title: title,
        body: body
      },
      data: {
        ...stringData,
        title,
        body
      },
      webpush: {
        headers: {
          Urgency: 'high',
          TTL: '86400'
        },
        notification: {
          title: title,
          body: body,
          icon: '/logocaos.png',
          badge: '/logocaos.png',
          vibrate: [200, 100, 200],
          tag: dataPayload?.tag || 'thuedo-push',
          renotify: false,
          requireInteraction: false
        }
      },
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-collapse-id': dataPayload?.tag || 'thuedo-push'
        },
        payload: {
          aps: {
            alert: {
              title: title,
              body: body
            },
            sound: 'default',
            badge: dataPayload?.badge !== undefined ? Number(dataPayload.badge) : 1,
            'content-available': 1
          }
        }
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    const result = await res.json();
    return { ok: res.ok, status: res.status, result };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getRegisteredTokens() {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken || !SERVICE_ACCOUNT.project_id) return [];

  const url = 'https://firestore.googleapis.com/v1/projects/' + SERVICE_ACCOUNT.project_id + '/databases/(default)/documents/thuedo_device_tokens';
  
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];

    const tokens = [];
    for (const doc of data.documents) {
      const fields = doc.fields || {};
      const token = fields.token?.stringValue;
      if (token) {
        tokens.push(token);
      }
    }
    return tokens;
  } catch (err) {
    return [];
  }
}

export async function saveRegisteredToken(token, deviceType = 'Unknown') {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken || !SERVICE_ACCOUNT.project_id) return false;

  const docId = Buffer.from(token).toString('base64url').slice(0, 60);
  const url = 'https://firestore.googleapis.com/v1/projects/' + SERVICE_ACCOUNT.project_id + '/databases/(default)/documents/thuedo_device_tokens/' + docId;

  const body = {
    fields: {
      token: { stringValue: token },
      deviceType: { stringValue: deviceType },
      updatedAt: { stringValue: new Date().toISOString() }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
