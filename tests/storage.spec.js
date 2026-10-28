// Persistencia en localStorage: datos inexistentes o corruptos y escrituras fallidas.
import { SEED_DB } from '../src/data/seed.js';
import { DB_KEY, loadDb, readJson, saveDb } from '../src/data/storage.js';
import { memoryStorage } from './helpers/dom.js';

describe('Persistencia (storage)', () => {
  beforeEach(() => {
    spyOn(console, 'warn');
  });

  it('usa los datos de ejemplo cuando no hay nada guardado', () => {
    expect(loadDb(memoryStorage()).products.length).toBe(SEED_DB.products.length);
  });

  it('recupera los datos de ejemplo si el JSON guardado está corrupto', () => {
    const db = loadDb(memoryStorage({ [DB_KEY]: '{esto-no-es-json' }));
    expect(db.products.length).toBe(SEED_DB.products.length);
    expect(console.warn).toHaveBeenCalled();
  });

  it('descarta datos con formato o versión no válidos', () => {
    const db = loadDb(memoryStorage({ [DB_KEY]: JSON.stringify({ version: 1, products: 'x' }) }));
    expect(db.version).toBe(SEED_DB.version);
  });

  it('carga la base guardada cuando es válida', () => {
    const modified = structuredClone(SEED_DB);
    modified.products[0].stock = 99;
    expect(loadDb(memoryStorage({ [DB_KEY]: JSON.stringify(modified) })).products[0].stock).toBe(99);
  });

  it('readJson devuelve el valor por defecto si el almacenamiento no existe', () => {
    expect(readJson('clave', 'defecto', null)).toBe('defecto');
  });

  it('saveDb devuelve false si el almacenamiento lanza error (p. ej. cuota llena)', () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(saveDb(SEED_DB, failing)).toBe(false);
  });

  it('saveDb guarda la base como JSON y devuelve true', () => {
    const storage = memoryStorage();
    expect(saveDb(SEED_DB, storage)).toBe(true);
    expect(JSON.parse(storage.data[DB_KEY]).version).toBe(SEED_DB.version);
  });
});
