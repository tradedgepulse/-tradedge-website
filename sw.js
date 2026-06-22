// Tradedge Pulse Service Worker — handles web push notifications

const CACHE = 'tradedge-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Receive a push and show a notification
self.addEventListener('push', (event) => {
  let data = { title: 'Tradedge Pulse', body: 'New update', url: 'https://tradedgepulse.com' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) { /* use defaults */ }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || 'https://tradedgepulse.com' },
    tag: data.tag || 'tradedge-signal',
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Open the site when the notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'https://tradedgepulse.com';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('tradedgepulse.com') && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
