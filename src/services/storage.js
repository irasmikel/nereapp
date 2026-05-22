/**
 * Storage service — localStorage today, Firebase-ready tomorrow.
 * To migrate to Firebase, swap the implementation below.
 */

const PREFIX = 'hogar_v1_';

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },

  getAll() {
    try {
      const result = {};
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => {
          const key = k.slice(PREFIX.length);
          result[key] = JSON.parse(localStorage.getItem(k));
        });
      return result;
    } catch {
      return {};
    }
  },
};

// Future Firebase adapter shape:
// export const storage = {
//   async get(key) { const doc = await getDoc(doc(db, 'user', uid, 'data', key)); return doc.data(); },
//   async set(key, value) { await setDoc(doc(db, 'user', uid, 'data', key), value); },
//   ...
// };
