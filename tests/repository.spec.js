// Pruebas unitarias del CRUD genérico (funciones puras sobre la base de datos).
import { createRecord, deleteRecord, findRecord, listRecords, NotFoundError, updateRecord } from '../src/services/repository.js';

describe('Repositorio CRUD', () => {
  let db;

  beforeEach(() => {
    db = { products: [{ id: 'p1', name: 'Manzana', stock: 3 }], categories: [] };
  });

  it('lee registros existentes y devuelve null si no existen', () => {
    expect(findRecord(db, 'products', 'p1').name).toBe('Manzana');
    expect(findRecord(db, 'products', 'x')).toBeNull();
    expect(listRecords({}, 'products')).toEqual([]);
  });

  it('crea un registro con el id indicado sin mutar la base original', () => {
    const result = createRecord(db, 'products', { name: 'Pera', stock: 1 }, 'p2');
    expect(result.record).toEqual({ name: 'Pera', stock: 1, id: 'p2' });
    expect(result.db.products.length).toBe(2);
    expect(db.products.length).toBe(1);
  });

  it('rechaza crear un registro con un id repetido', () => {
    expect(() => createRecord(db, 'products', { name: 'Otra' }, 'p1')).toThrowError(/Ya existe/);
  });

  it('actualiza solo los campos del patch', () => {
    const result = updateRecord(db, 'products', 'p1', { stock: 10 });
    expect(result.record).toEqual({ id: 'p1', name: 'Manzana', stock: 10 });
    expect(db.products[0].stock).toBe(3);
  });

  it('lanza NotFoundError al actualizar o eliminar un id inexistente', () => {
    expect(() => updateRecord(db, 'products', 'zz', { stock: 1 })).toThrowError(NotFoundError);
    expect(() => deleteRecord(db, 'products', 'zz')).toThrowError(NotFoundError);
  });

  it('elimina el registro indicado', () => {
    const next = deleteRecord(db, 'products', 'p1');
    expect(next.products).toEqual([]);
  });
});
