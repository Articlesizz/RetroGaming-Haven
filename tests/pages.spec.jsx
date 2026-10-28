// Páginas: carrito, catálogo con filtros, checkout (precarga, validación, pago rechazado y aprobado) e inicio de sesión.
import { useCart } from '../src/context/CartContext.jsx';
import { useStore } from '../src/context/StoreContext.jsx';
import { SEED_DB } from '../src/data/seed.js';
import CartPage from '../src/pages/public/CartPage.jsx';
import CatalogPage from '../src/pages/public/CatalogPage.jsx';
import CheckoutPage, { CHECKOUT_DRAFT_KEY } from '../src/pages/public/CheckoutPage.jsx';
import LoginPage from '../src/pages/public/LoginPage.jsx';
import { buttonWithText, changeSelect, click, submitForm, typeText } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

let store;
let cart;
function Probes() {
  store = useStore();
  cart = useCart();
  return null;
}

const CHECKOUT_FORM = 'form[aria-label="Datos de compra y pago"]';
const linesAZelda = () => [{ productId: '1', quantity: 2 }, { productId: '3', quantity: 1 }];
const rowFor = (host, name) => Array.from(host.querySelectorAll('tbody tr')).find((row) => row.textContent.includes(name));

describe('Carrito (página)', () => {
  it('muestra una fila por producto y el total', () => {
    const view = renderWithProviders(<CartPage />, { lines: linesAZelda() });
    expect(view.host.querySelectorAll('tbody tr').length).toBe(3); // dos productos + fila de total
    expect(view.host.textContent).toContain('$14.693');
    view.unmount();
  });

  it('subir la cantidad recalcula el total', () => {
    const view = renderWithProviders(<CartPage />, { lines: linesAZelda() });
    click(buttonWithText(rowFor(view.host, 'The Legend of Zelda'), '+'));
    expect(view.host.querySelector('tbody').textContent).toContain('$20.692');
    view.unmount();
  });

  it('eliminar pide confirmación y, al confirmar, quita la línea', () => {
    const view = renderWithProviders(<CartPage />, { lines: linesAZelda() });
    click(buttonWithText(rowFor(view.host, 'Minecraft'), 'Eliminar'));
    expect(view.host.textContent).toContain('¿Estás seguro de que deseas eliminar');
    click(buttonWithText(view.host.querySelector('.modal-footer'), 'Eliminar'));
    expect(view.host.querySelectorAll('tbody tr').length).toBe(2);
    view.unmount();
  });

  it('vaciar el carrito muestra el estado vacío', () => {
    const view = renderWithProviders(<CartPage />, { lines: linesAZelda() });
    click(buttonWithText(view.host, 'Limpiar'));
    expect(view.host.textContent).toContain('Tu carrito está vacío');
    view.unmount();
  });
});

describe('Catálogo (página)', () => {
  it('muestra todos los productos al inicio', () => {
    const view = renderWithProviders(<CatalogPage />, { route: '/productos' });
    expect(view.host.querySelectorAll('.product-card').length).toBe(SEED_DB.products.length);
    view.unmount();
  });

  it('la búsqueda por texto actualiza los resultados', () => {
    const view = renderWithProviders(<CatalogPage />, { route: '/productos' });
    typeText(view.host.querySelector('#filtro-texto'), 'zelda');
    expect(view.host.querySelectorAll('.product-card').length).toBe(1);
    expect(view.host.querySelector('[aria-live="polite"]').textContent).toContain('1 resultado');
    view.unmount();
  });

  it('el filtro de ofertas deja solo productos con precio rebajado', () => {
    const view = renderWithProviders(<CatalogPage />, { route: '/productos' });
    click(view.host.querySelector('#filtro-ofertas'));
    expect(view.host.querySelectorAll('.product-card').length).toBe(SEED_DB.products.filter((p) => p.precio_descuento > p.precio_nuevo).length);
    view.unmount();
  });

  it('el filtro de categoría muestra solo sus productos', () => {
    const view = renderWithProviders(<CatalogPage />, { route: '/productos' });
    const category = SEED_DB.categories[0];
    changeSelect(view.host.querySelector('#filtro-categoria'), category.id);
    expect(view.host.querySelectorAll('.product-card').length).toBe(SEED_DB.products.filter((p) => p.categoryId === category.id).length);
    view.unmount();
  });
});

describe('Checkout (página)', () => {
  beforeEach(() => {
    localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  });

  it('precarga los datos del cliente cuando la sesión está iniciada', () => {
    const view = renderWithProviders(<CheckoutPage />, { lines: linesAZelda(), session: 'u-usuario' });
    expect(view.host.querySelector('#checkout-name').value).toBe('Usuario');
    expect(view.host.querySelector('#checkout-email').value).toBe('usuario@tienda.cl');
    expect(view.host.querySelector('#checkout-street').value).toBe('Calle Demo 123');
    expect(view.host.querySelector('#checkout-comuna').value).toBe('Maipú');
    view.unmount();
  });

  it('sin sesión valida los campos al enviar', () => {
    const view = renderWithProviders(<CheckoutPage />, { lines: linesAZelda() });
    submitForm(view.host.querySelector(CHECKOUT_FORM));
    expect(view.host.textContent).toContain('El nombre es obligatorio.');
    view.unmount();
  });

  it('la comuna depende de la región elegida', () => {
    const view = renderWithProviders(<CheckoutPage />, { lines: linesAZelda() });
    const comuna = view.host.querySelector('#checkout-comuna');
    expect(comuna.disabled).toBeTrue();
    changeSelect(view.host.querySelector('#checkout-region'), 'Valparaíso');
    expect(comuna.disabled).toBeFalse();
    expect(comuna.options.length).toBeGreaterThan(1);
    view.unmount();
  });

  it('un pago rechazado no vacía el carrito ni registra el pedido', () => {
    const view = renderWithProviders(<><CheckoutPage /><Probes /></>, { lines: linesAZelda(), session: 'u-usuario' });
    const ordersBefore = store.db.orders.length;
    changeSelect(view.host.querySelector('#checkout-escenario'), 'rechazado');
    submitForm(view.host.querySelector(CHECKOUT_FORM));
    expect(cart.lines).toEqual(linesAZelda());
    expect(store.db.orders.length).toBe(ordersBefore);
    view.unmount();
  });

  it('un pago aprobado registra el pedido, descuenta stock y vacía el carrito', () => {
    const view = renderWithProviders(<><CheckoutPage /><Probes /></>, { lines: linesAZelda(), session: 'u-usuario' });
    const ordersBefore = store.db.orders.length;
    submitForm(view.host.querySelector(CHECKOUT_FORM));
    expect(store.db.orders.length).toBe(ordersBefore + 1);
    expect(store.db.products.find((p) => p.id === '1').stock).toBe(SEED_DB.products.find((p) => p.id === '1').stock - 2);
    expect(cart.lines).toEqual([]);
    view.unmount();
  });
});

describe('Inicio de sesión (página)', () => {
  it('con el usuario de demostración de cliente inicia sesión y no muestra error', () => {
    const view = renderWithProviders(<LoginPage />, { route: '/iniciar-sesion' });
    typeText(view.host.querySelector('#username'), 'usuario');
    typeText(view.host.querySelector('#password'), '12345');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).not.toContain('mal ingresados');
    view.unmount();
  });

  it('con clave incorrecta muestra el error', () => {
    const view = renderWithProviders(<LoginPage />, { route: '/iniciar-sesion' });
    typeText(view.host.querySelector('#username'), 'usuario');
    typeText(view.host.querySelector('#password'), 'mala');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('Usuarios o Contraseña mal ingresados.');
    view.unmount();
  });
});
