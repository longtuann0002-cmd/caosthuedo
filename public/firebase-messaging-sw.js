// Firebase Messaging Service Worker for Quản Lý Thuê Đồ (caos-thue-do)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Cache name for PWA
const CACHE_NAME = 'thuedo-app-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        );
      })
    ])
  );
});

try {
  firebase.initializeApp({
    apiKey: "AIzaSyDH12pXf1ffyNNQzoEm8SespexL3EM-CXg",
    authDomain: "caos-thue-do.firebaseapp.com",
    projectId: "caos-thue-do",
    storageBucket: "caos-thue-do.firebasestorage.app",
    messagingSenderId: "569940659255",
    appId: "1:569940659255:web:a200bc976ed40c901b43b2"
  });

  const messaging = firebase.messaging();

  // Handle background FCM push messages (app closed / in background)
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || '🔔 Quản Lý Thuê Đồ';
    const body = payload.notification?.body || payload.data?.body || 'Bạn có thông báo mới!';

    // Update app icon badge if supported (iOS 16.4+ PWA / Android)
    if ('setAppBadge' in self.navigator) {
      const badgeCount = payload.data?.badge ? parseInt(payload.data.badge, 10) : 1;
      self.navigator.setAppBadge(!isNaN(badgeCount) ? badgeCount : 1).catch(() => {});
    }

    // Use fixed tag 'thuedo-push' so duplicate FCM pushes replace each other
    self.registration.showNotification(title, {
      body: body,
      icon: '/logocaosdt.png',
      badge: '/logocaosdt.png',
      vibrate: [200, 100, 200],
      data: { url: payload.data?.url || '/' },
      tag: 'thuedo-push',
      renotify: true
    });
  });
} catch (e) {
  console.warn('[firebase-messaging-sw] Init error:', e);
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if ('clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(() => {});
  }
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
