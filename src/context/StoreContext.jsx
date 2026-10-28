// Estado compartido de la base de datos simulada. Expone las operaciones CRUD y las conecta con localStorage.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_DB } from '../data/seed.js';
import { loadDb, saveDb } from '../data/storage.js';
import { createRecord, deleteRecord, findRecord, newId, updateRecord } from '../services/repository.js';
import { normalizeCategory, normalizeProduct, normalizeUser } from '../services/normalize.js';
import { stockProblems } from '../services/orderService.js';
import { hasErrors, validateCategory, validateProduct, validateUser } from '../utils/validators.js';

const StoreContext = createContext(null);

const today = () => new Date().toISOString().slice(0, 10);

export function StoreProvider({ children, initialDb, persist = true, storage }) {
  const [db, setDb] = useState(() => initialDb ?? loadDb(storage));

  useEffect(() => {
    if (persist) saveDb(db, storage);
  }, [db, persist, storage]);

  // Productos
  const createProduct = useCallback(
    (data) => {
      const input = normalizeProduct(data);
      const errors = validateProduct(input, db.categories, { products: db.products, creating: true });
      if (hasErrors(errors)) return { ok: false, errors };
      const { codigo, ...fields } = input;
      const { db: next, record } = createRecord(db, 'products', { ...fields, vistas: 0, createdAt: today() }, codigo || newId('p'));
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  const updateProduct = useCallback(
    (id, data) => {
      const input = normalizeProduct(data);
      const errors = validateProduct(input, db.categories, { products: db.products });
      if (hasErrors(errors)) return { ok: false, errors };
      if (!findRecord(db, 'products', id)) return { ok: false, errors: { form: 'El producto no existe.' } };
      const { codigo, ...fields } = input;
      const { db: next, record } = updateRecord(db, 'products', id, fields);
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  const deleteProduct = useCallback(
    (id) => {
      if (!findRecord(db, 'products', id)) return { ok: false, error: 'El producto no existe.' };
      setDb(deleteRecord(db, 'products', id));
      return { ok: true };
    },
    [db],
  );

  // Suma una visita al detalle del producto ("Los más vistos").
  const registerView = useCallback((productId) => {
    setDb((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, vistas: (product.vistas ?? 0) + 1 } : product)),
    }));
  }, []);

  // Categorías
  const createCategory = useCallback(
    (data) => {
      const input = normalizeCategory(data);
      const errors = validateCategory(input, db.categories);
      if (hasErrors(errors)) return { ok: false, errors };
      const { db: next, record } = createRecord(db, 'categories', input, newId('cat'));
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  const updateCategory = useCallback(
    (id, data) => {
      const input = normalizeCategory(data);
      const errors = validateCategory(input, db.categories, id);
      if (hasErrors(errors)) return { ok: false, errors };
      if (!findRecord(db, 'categories', id)) return { ok: false, errors: { form: 'La categoría no existe.' } };
      const { db: next, record } = updateRecord(db, 'categories', id, input);
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  const deleteCategory = useCallback(
    (id) => {
      const inUse = db.products.filter((product) => product.categoryId === id).length;
      if (inUse > 0) return { ok: false, error: `No se puede eliminar: ${inUse} producto(s) usan esta categoría.` };
      if (!findRecord(db, 'categories', id)) return { ok: false, error: 'La categoría no existe.' };
      setDb(deleteRecord(db, 'categories', id));
      return { ok: true };
    },
    [db],
  );

  // Usuarios
  const createUser = useCallback(
    (data) => {
      const input = { ...normalizeUser(data), createdAt: today() };
      const errors = validateUser(input, db.users, { creating: true });
      if (hasErrors(errors)) return { ok: false, errors };
      const { db: next, record } = createRecord(db, 'users', input, newId('u'));
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  const updateUser = useCallback(
    (id, data) => {
      const input = normalizeUser(data);
      const errors = validateUser(input, db.users, { currentId: id });
      if (hasErrors(errors)) return { ok: false, errors };
      if (!findRecord(db, 'users', id)) return { ok: false, errors: { form: 'El usuario no existe.' } };
      const { db: next, record } = updateRecord(db, 'users', id, input);
      setDb(next);
      return { ok: true, record };
    },
    [db],
  );

  // Cambio de contraseña (perfil). La validación de formato se hace en el formulario.
  const changePassword = useCallback(
    (id, password) => {
      if (!findRecord(db, 'users', id)) return { ok: false, error: 'El usuario no existe.' };
      setDb(updateRecord(db, 'users', id, { password }).db);
      return { ok: true };
    },
    [db],
  );

  const deleteUser = useCallback(
    (id) => {
      const target = findRecord(db, 'users', id);
      if (!target) return { ok: false, error: 'El usuario no existe.' };
      const admins = db.users.filter((user) => user.role === 'admin').length;
      if (target.role === 'admin' && admins <= 1) return { ok: false, error: 'No se puede eliminar al último administrador.' };
      setDb(deleteRecord(db, 'users', id));
      return { ok: true };
    },
    [db],
  );

  // Pedidos: idempotente por id (un reintento del mismo intento no duplica la compra).
  const registerOrder = useCallback(
    (order) => {
      const existing = findRecord(db, 'orders', order.id);
      if (existing) return { ok: true, created: false, order: existing };
      const problems = stockProblems(order.lines, db.products);
      if (problems.length > 0) return { ok: false, error: problems.join(' ') };
      let next = db;
      order.lines.forEach((line) => {
        const product = findRecord(next, 'products', line.productId);
        const stock = product.stock - line.quantity;
        next = updateRecord(next, 'products', line.productId, { stock, disponibilidad: stock > 0 ? product.disponibilidad : 'Agotado' }).db;
      });
      next = createRecord(next, 'orders', order, order.id).db;
      setDb(next);
      return { ok: true, created: true, order };
    },
    [db],
  );

  const resetDemoData = useCallback(() => setDb(structuredClone(SEED_DB)), []);

  const value = useMemo(
    () => ({
      db,
      createProduct,
      updateProduct,
      deleteProduct,
      registerView,
      createCategory,
      updateCategory,
      deleteCategory,
      createUser,
      updateUser,
      changePassword,
      deleteUser,
      registerOrder,
      resetDemoData,
    }),
    [db, createProduct, updateProduct, deleteProduct, registerView, createCategory, updateCategory, deleteCategory, createUser, updateUser, changePassword, deleteUser, registerOrder, resetDemoData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore debe usarse dentro de StoreProvider');
  return context;
}
