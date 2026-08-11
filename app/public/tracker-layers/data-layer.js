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

export { DataStore, PersistenceEngine };
