class DataStore {
  constructor(initialState = {}) {
    this.state = initialState.records ? initialState : { records: {} };
  }

  read(date) {
    return this.state.records[date] || null;
  }

  write(date, record) {
    this.state.records[date] = { ...record, version: (record.version || 0) + 1 };
    return this.state.records[date];
  }

  exists(date) {
    return date in this.state.records;
  }

  delete(date) {
    delete this.state.records[date];
  }

  toJSON() {
    return { records: this.state.records };
  }
}

class PersistenceEngine {
  constructor(storageKey = 'rb_tracker_v6') {
    this.storageKey = storageKey;
    this.dbName = storageKey + '-idb';
    this.dbPromise = this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('records')) {
          db.createObjectStore('records', { keyPath: 'date' });
        }
      };
    });
  }

  async save(dataStore) {
    const json = JSON.stringify(dataStore.toJSON());
    localStorage.setItem(this.storageKey, json);

    const db = await this.dbPromise;
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');

    const data = dataStore.toJSON();
    for (const [date, record] of Object.entries(data.records)) {
      await new Promise((resolve, reject) => {
        const req = store.put({ date, ...record });
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve();
      });
    }
  }

  async load() {
    const json = localStorage.getItem(this.storageKey);
    if (!json) return new DataStore();
    try {
      return new DataStore(JSON.parse(json));
    } catch (e) {
      console.error('[persistence] localStorage parse failed:', e);
      return new DataStore();
    }
  }

  async delete(date) {
    const db = await this.dbPromise;
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    await new Promise((resolve, reject) => {
      const req = store.delete(date);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  }

  async clear() {
    localStorage.removeItem(this.storageKey);
    const db = await this.dbPromise;
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    await new Promise((resolve, reject) => {
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  }
}

class SyncQueue {
  constructor(apiEndpoint = '/api/tracker/sync') {
    this.apiEndpoint = apiEndpoint;
    this.queue = [];
    this.isOnline = navigator?.onLine !== false;
    this.retryAttempts = {};
    this.maxRetries = 5;
    this.backoffMs = [5000, 10000, 30000, 60000, 300000]; // 5s, 10s, 30s, 1m, 5m
  }

  enqueue(operation) {
    const op = { ...operation, id: Date.now() + Math.random(), timestamp: Date.now() };
    this.queue.push(op);
    if (this.isOnline) {
      setTimeout(() => this.flush(), 0);
    }
  }

  async flush() {
    if (!this.isOnline || this.queue.length === 0) return;

    const batch = this.queue.splice(0, 10); // Flush in batches of 10
    for (const op of batch) {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(op)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.retryAttempts[op.id] = 0;
      } catch (e) {
        const attempts = this.retryAttempts[op.id] || 0;
        if (attempts < this.maxRetries) {
          this.retryAttempts[op.id] = attempts + 1;
          const backoff = this.backoffMs[Math.min(attempts, this.backoffMs.length - 1)];
          setTimeout(() => this.enqueue(op), backoff);
        } else {
          console.error('[sync] Operation dropped after max retries:', op);
        }
      }
    }
    if (this.queue.length > 0) setTimeout(() => this.flush(), 1000);
  }

  offline() {
    this.isOnline = false;
  }

  online() {
    this.isOnline = true;
    setTimeout(() => this.flush(), 0);
  }

  isPending() {
    return this.queue.length > 0;
  }

  size() {
    return this.queue.length;
  }
}

export { DataStore, PersistenceEngine, SyncQueue };
