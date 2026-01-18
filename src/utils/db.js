const DB_NAME = 'PiggyBankDB';
const DB_VERSION = 2; // Incremented for new store
const STORES = {
    GOALS: 'goals',
    ACCOUNTS: 'accounts',
    TRANSACTIONS: 'transactions',
    ACHIEVEMENTS: 'achievements',
    META: 'meta' // For activeGoalId etc.
};

export const db = {
    open: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => reject(event.target.error);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORES.GOALS)) {
                    db.createObjectStore(STORES.GOALS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
                    db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
                    db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
                    db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.META)) {
                    db.createObjectStore(STORES.META);
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
        });
    },

    getAll: async (storeName) => {
        const dbInstance = await db.open();
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    get: async (storeName, key) => {
        const dbInstance = await db.open();
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    set: async (storeName, value) => {
        const dbInstance = await db.open();
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    delete: async (storeName, key) => {
        const dbInstance = await db.open();
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // Bulk put for migration if needed
    setAll: async (storeName, items) => {
        const dbInstance = await db.open();
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);

            items.forEach(item => store.put(item));
        });
    }
};

export const STORES_CONSTANTS = STORES;
