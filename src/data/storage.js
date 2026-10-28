// Acceso a localStorage tolerante a fallos: puede faltar (modo privado, datos bloqueados)
// o contener JSON corrupto. Ante cualquier error se usan valores por defecto.
import { SEED_DB, SEED_VERSION } from './seed.js';

export const DB_KEY = 'mi-tienda:db';

export function getDefaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readJson(key, fallback, storage = getDefaultStorage()) {
  try {
    const raw = storage?.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`No se pudo leer "${key}"; se usan valores por defecto.`, error);
    return fallback;
  }
}

export function writeJson(key, value, storage = getDefaultStorage()) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`No se pudo guardar "${key}".`, error);
    return false;
  }
}

export function removeKey(key, storage = getDefaultStorage()) {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function isValidDb(value) {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    value.version === SEED_VERSION &&
    ['products', 'categories', 'users', 'orders'].every((key) => Array.isArray(value[key])) &&
    typeof value.settings === 'object'
  );
}

// Devuelve la base guardada o, si no existe o no es válida, una copia de los datos de ejemplo.
export function loadDb(storage = getDefaultStorage()) {
  const stored = readJson(DB_KEY, null, storage);
  if (stored === null) return structuredClone(SEED_DB);
  if (!isValidDb(stored)) {
    console.warn('Datos guardados con formato no válido; se restauran los datos de ejemplo.');
    return structuredClone(SEED_DB);
  }
  return stored;
}

export function saveDb(db, storage = getDefaultStorage()) {
  return writeJson(DB_KEY, db, storage);
}
