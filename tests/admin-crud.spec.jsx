// CRUD de administración: el store crea, lee, actualiza y elimina; la lista refleja los cambios; reglas de bloqueo.
import { useStore } from '../src/context/StoreContext.jsx';
import { SEED_DB } from '../src/data/seed.js';
import { ProductsPage } from '../src/pages/admin/ProductPages.jsx';
import { buttonWithText, click, runAction } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

let store;
function StoreProbe() {
  store = useStore();
  return null;
}

const validProduct = {
  nombre: 'Palta Game',
  descripcion: 'Juego de prueba',
  categoryId: SEED_DB.categories[0].id,
  precio_descuento: '7000',
  precio_nuevo: '6000',
  stock: '5',
  stock_critico: '3',
  disponibilidad: 'Disponible',
  imagen: '',
};

describe('CRUD de administración', () => {
  it('crear: un producto válido se agrega a la base', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() => store.createProduct(validProduct));
    expect(result.ok).toBeTrue();
    expect(store.db.products.length).toBe(SEED_DB.products.length + 1);
    expect(store.db.products.find((p) => p.id === result.record.id).precio_nuevo).toBe(6000);
    view.unmount();
  });

  it('crear: un producto inválido devuelve errores y no se guarda', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() => store.createProduct({ ...validProduct, precio_nuevo: '-10' }));
    expect(result.ok).toBeFalse();
    expect(result.errors.precio_nuevo).toBeDefined();
    expect(store.db.products.length).toBe(SEED_DB.products.length);
    view.unmount();
  });

  it('actualizar: el cambio de precio se refleja en el store', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() => store.updateProduct('1', { ...validProduct, precio_nuevo: '2', precio_descuento: '' }));
    expect(result.ok).toBeTrue();
    expect(store.db.products.find((p) => p.id === '1').precio_nuevo).toBe(2);
    view.unmount();
  });

  it('actualizar: el precio normal no puede ser menor que el precio final', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() => store.updateProduct('1', { ...validProduct, precio_nuevo: '6000', precio_descuento: '5000' }));
    expect(result.ok).toBeFalse();
    expect(result.errors.precio_descuento).toBeDefined();
    view.unmount();
  });

  it('eliminar: no se borra una categoría que tiene productos', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() => store.deleteCategory(SEED_DB.categories[0].id));
    expect(result.ok).toBeFalse();
    expect(store.db.categories.some((c) => c.id === SEED_DB.categories[0].id)).toBeTrue();
    view.unmount();
  });

  it('eliminar: no se borra al último administrador', () => {
    const onlyAdmin = structuredClone(SEED_DB);
    onlyAdmin.users = onlyAdmin.users.map((user) => ({ ...user, role: user.id === 'u-admin' ? 'admin' : 'cliente' }));
    const view = renderWithProviders(<StoreProbe />, { db: onlyAdmin });
    const result = runAction(() => store.deleteUser('u-admin'));
    expect(result.ok).toBeFalse();
    expect(result.error).toContain('último administrador');
    view.unmount();
  });

  it('crear usuario: el correo debe ser único', () => {
    const view = renderWithProviders(<StoreProbe />);
    const result = runAction(() =>
      store.createUser({ name: 'Nuevo', lastName: 'Usuario', email: 'usuario@tienda.cl', password: '123456', role: 'cliente' }),
    );
    expect(result.ok).toBeFalse();
    expect(result.errors.email).toBeDefined();
    view.unmount();
  });

  it('la lista de productos quita la fila tras confirmar el borrado', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const view = renderWithProviders(<ProductsPage />, { route: '/admin/producto' });
    expect(view.host.querySelectorAll('tbody tr').length).toBe(SEED_DB.products.length);
    click(buttonWithText(view.host.querySelector('tbody tr'), 'Eliminar'));
    expect(window.confirm).toHaveBeenCalled();
    expect(view.host.querySelectorAll('tbody tr').length).toBe(SEED_DB.products.length - 1);
    view.unmount();
  });

  it('cancelar la confirmación no elimina el producto', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const view = renderWithProviders(<ProductsPage />, { route: '/admin/producto' });
    click(buttonWithText(view.host.querySelector('tbody tr'), 'Eliminar'));
    expect(view.host.querySelectorAll('tbody tr').length).toBe(SEED_DB.products.length);
    view.unmount();
  });
});
