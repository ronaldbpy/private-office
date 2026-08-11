const CACHE = 'rb-tracker-v6';
const ASSETS = [
  '/tracker/',
  '/tracker/tracker-v6.html',
  '/tracker/tracker-manifest.json'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => null)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (!url.pathname.startsWith('/tracker/')) return;
  if (ev.request.method !== 'GET') return;

  // For HTML pages: network first, fallback to cache
  if (url.pathname.endsWith('tracker-v6.html') || url.pathname.endsWith('/tracker/')) {
    ev.respondWith(
      fetch(ev.request)
        .then(r => {
          if (!r.ok) return caches.match(ev.request);
          caches.open(CACHE).then(c => c.put(ev.request, r.clone())).catch(() => {});
          return r;
        })
        .catch(() => caches.match(ev.request) || caches.match('/tracker/tracker-v6.html'))
    );
  } else {
    // For assets: cache first, fallback to network
    ev.respondWith(
      caches.match(ev.request)
        .then(r => r || fetch(ev.request)
          .then(f => {
            if (!f.ok) return f;
            caches.open(CACHE).then(c => c.put(ev.request, f.clone())).catch(() => {});
            return f;
          })
        )
        .catch(() => caches.match('/tracker/tracker-v6.html'))
    );
  }
});

// ========================================================================
// MEDICATION REMINDERS — Periodic notification scheduling (Task: medications)
// ========================================================================

// Simple in-memory scheduled notifications registry (persisted via indexed schedule calls)
let scheduledNotifications = {};

// scheduleNextMedicationReminder() → on SW activation/startup, check all stored
// medications and schedule reminders for today's doses.
function scheduleNextMedicationReminder() {
  // Fetch from localStorage (same key as the app)
  const stateJson = self.localStorage ? localStorage.getItem('rb_tracker_v6') : null;
  if (!stateJson) return;

  try {
    const state = JSON.parse(stateJson);
    const today = new Date().toISOString().slice(0, 10);
    const dayRec = state.records && state.records[today];
    if (!dayRec || !dayRec.medications) return;

    const meds = dayRec.medications;
    meds.forEach(med => {
      if (!med.horarios || !Array.isArray(med.horarios)) return;
      // Check if medication is active
      if (med.estado !== 'activo') return;
      // Check if today <= fecha_fin (or no fecha_fin for ongoing)
      if (med.fecha_fin && today > med.fecha_fin) return;

      med.horarios.forEach(hora => {
        const key = med.id + '_' + hora;
        if (scheduledNotifications[key]) return; // Already scheduled

        // Parse hora (HH:MM) and schedule notification
        const [h, m] = hora.split(':').map(Number);
        const now = new Date();
        const notifTime = new Date();
        notifTime.setHours(h, m, 0, 0);

        // If time has passed today, skip (or could schedule for tomorrow)
        if (notifTime <= now) return;

        const delayMs = notifTime.getTime() - now.getTime();
        scheduledNotifications[key] = setTimeout(() => {
          self.registration.showNotification('Medicamento', {
            tag: key,
            requireInteraction: true,
            body: 'Toma: ' + med.nombre + ' · ' + med.dosis + ' · ' + med.via,
            icon: '/tracker/icon-192.png',
            data: { medicationId: med.id, hora: hora }
          });
        }, delayMs);
      });
    });
  } catch (e) {
    console.error('[tracker-sw] scheduleNextMedicationReminder failed:', e);
  }
}

// Attempt schedule on activation (but SW may not have access to localStorage on some platforms)
self.addEventListener('activate', () => {
  scheduleNextMedicationReminder();
});

self.addEventListener('notificationclick', ev => {
  ev.notification.close();
  ev.waitUntil(clients.matchAll({type: 'window'}).then(clientList => {
    for (const client of clientList) {
      if (client.url.includes('/tracker/') && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow('/tracker/');
  }));
});
