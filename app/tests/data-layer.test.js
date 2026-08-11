import { DataStore, PersistenceEngine } from '../public/tracker-layers/data-layer.js';

// Mock IndexedDB for test environment
if (typeof globalThis.indexedDB === 'undefined') {
  const idbStores = {};

  globalThis.indexedDB = {
    open: (dbName, version) => {
      const storeData = (idbStores[dbName] = idbStores[dbName] || {});
      const storeNames = new Set();

      const request = {
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
        error: null
      };

      const db = {
        objectStoreNames: {
          contains: (name) => storeNames.has(name)
        },
        createObjectStore: (name, options) => {
          storeNames.add(name);
          if (!storeData[name]) storeData[name] = new Map();
          return storeData[name];
        },
        transaction: (storeName, mode) => {
          if (!storeData[storeName]) storeData[storeName] = new Map();
          const storeMap = storeData[storeName];

          return {
            objectStore: (name) => ({
              put: (obj) => {
                const putReq = { onerror: null, onsuccess: null, error: null };
                storeMap.set(obj.date, obj);
                queueMicrotask(() => {
                  if (putReq.onsuccess) putReq.onsuccess({ target: { result: obj.date } });
                });
                return putReq;
              },
              delete: (key) => {
                const delReq = { onerror: null, onsuccess: null, error: null };
                storeMap.delete(key);
                queueMicrotask(() => {
                  if (delReq.onsuccess) delReq.onsuccess();
                });
                return delReq;
              },
              clear: () => {
                const clearReq = { onerror: null, onsuccess: null, error: null };
                storeMap.clear();
                queueMicrotask(() => {
                  if (clearReq.onsuccess) clearReq.onsuccess();
                });
                return clearReq;
              }
            })
          };
        }
      };

      request.result = db;

      queueMicrotask(() => {
        if (request.onupgradeneeded) {
          request.onupgradeneeded({
            target: { result: db }
          });
        }
        if (request.onsuccess) {
          request.onsuccess({ target: { result: db } });
        }
      });

      return request;
    }
  };
}

describe('DataStore', () => {
  test('constructor initializes with empty records', () => {
    const store = new DataStore();
    expect(store.toJSON()).toEqual({ records: {} });
  });

  test('constructor accepts initial state', () => {
    const initial = { records: { '2026-01-01': { foods: [], medications: [] } } };
    const store = new DataStore(initial);
    expect(store.toJSON()).toEqual(initial);
  });
});

describe('PersistenceEngine', () => {
  let engine;

  beforeEach(async () => {
    engine = new PersistenceEngine('test-tracker');
    await engine.clear();
  });

  test('save persists to localStorage', async () => {
    const store = new DataStore({ records: { '2026-01-01': { foods: [] } } });
    await engine.save(store);
    const json = localStorage.getItem('test-tracker');
    expect(json).toBeTruthy();
    expect(JSON.parse(json).records['2026-01-01']).toBeDefined();
  });

  test('load retrieves from localStorage', async () => {
    const store = new DataStore({ records: { '2026-01-01': { foods: ['rice'] } } });
    await engine.save(store);
    const loaded = await engine.load();
    expect(loaded.read('2026-01-01').foods).toEqual(['rice']);
  });
});
