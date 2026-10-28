// Funcionalidades portadas del template: categorías con selector, acceso directo, rutas protegidas, boleta con datos,
// estadísticas de usuario, 10 gráficos, personajes desde APIs públicas, formulario de usuario con RUN y contador de visitas.
import { Route, Routes } from 'react-router-dom';
import { useSession } from '../src/context/SessionContext.jsx';
import { useStore } from '../src/context/StoreContext.jsx';
import { SEED_DB } from '../src/data/seed.js';
import RequireAdmin from '../src/components/layout/RequireAdmin.jsx';
import UserForm from '../src/components/forms/UserForm.jsx';
import CategoriesPage from '../src/pages/public/CategoriesPage.jsx';
import LoginPage from '../src/pages/public/LoginPage.jsx';
import RegisterPage from '../src/pages/public/RegisterPage.jsx';
import PaymentSuccessPage from '../src/pages/public/PaymentSuccessPage.jsx';
import ProductDetailPage from '../src/pages/public/ProductDetailPage.jsx';
import CriticalProductsTable, { criticalStatus } from '../src/components/admin/CriticalProductsTable.jsx';
import { fetchCharacterUsers, transformCharacter, transformPokemon } from '../src/services/characterService.js';
import { generalCharts, productCharts } from '../src/utils/chartData.js';
import { customerSegments, userStats } from '../src/utils/reports.js';
import { buttonWithText, click, submitForm, typeText } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

let store;
let session;
function Probes() {
  store = useStore();
  session = useSession();
  return null;
}

describe('Categorías (selector y productos)', () => {
  it('muestra una tarjeta por categoría y resalta la activa', () => {
    const view = renderWithProviders(
      <Routes>
        <Route path="/categorias/:slug" element={<CategoriesPage />} />
      </Routes>,
      { route: '/categorias/rpg' },
    );
    expect(view.host.querySelectorAll('.nav-card').length).toBe(SEED_DB.categories.length);
    expect(view.host.querySelectorAll('.nav-card-active').length).toBe(1);
    expect(view.host.querySelector('.nav-card-active').textContent).toContain('RPG');
    view.unmount();
  });

  it('lista solo los productos de la categoría elegida', () => {
    const rpg = SEED_DB.categories.find((category) => category.slug === 'rpg');
    const view = renderWithProviders(
      <Routes>
        <Route path="/categorias/:slug" element={<CategoriesPage />} />
      </Routes>,
      { route: '/categorias/rpg' },
    );
    expect(view.host.querySelectorAll('.product-card').length).toBe(SEED_DB.products.filter((p) => p.categoryId === rpg.id).length);
    view.unmount();
  });

  it('una categoría inexistente muestra un estado vacío', () => {
    const view = renderWithProviders(
      <Routes>
        <Route path="/categorias/:slug" element={<CategoriesPage />} />
      </Routes>,
      { route: '/categorias/no-existe' },
    );
    expect(view.host.textContent).toContain('Categoría no encontrada');
    view.unmount();
  });
});

describe('Inicio de sesión y rutas protegidas', () => {
  it('"ENTRAR COMO ADMINISTRADOR" inicia sesión con la cuenta de administrador', () => {
    const view = renderWithProviders(
      <>
        <LoginPage />
        <Probes />
      </>,
      { route: '/iniciar-sesion' },
    );
    click(buttonWithText(view.host, 'ENTRAR COMO ADMINISTRADOR'));
    expect(session.user.role).toBe('admin');
    view.unmount();
  });

  it('"ENTRAR COMO CLIENTE" inicia sesión con la cuenta de cliente', () => {
    const view = renderWithProviders(
      <>
        <LoginPage />
        <Probes />
      </>,
      { route: '/iniciar-sesion' },
    );
    click(buttonWithText(view.host, 'ENTRAR COMO CLIENTE'));
    expect(session.user.role).toBe('cliente');
    view.unmount();
  });

  const authRoutes = (
    <Routes>
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/crear-sesion" element={<RegisterPage />} />
      <Route path="/admin" element={<p>Panel privado</p>} />
      <Route path="/mi-cuenta" element={<p>Mi cuenta</p>} />
      <Route path="/" element={<p>Tienda pública</p>} />
    </Routes>
  );

  it('tras entrar como administrador navega al panel', () => {
    const view = renderWithProviders(authRoutes, { route: '/iniciar-sesion' });
    click(buttonWithText(view.host, 'ENTRAR COMO ADMINISTRADOR'));
    expect(view.host.textContent).toContain('Panel privado');
    view.unmount();
  });

  it('tras entrar como cliente navega a la tienda', () => {
    const view = renderWithProviders(authRoutes, { route: '/iniciar-sesion' });
    click(buttonWithText(view.host, 'ENTRAR COMO CLIENTE'));
    expect(view.host.textContent).toContain('Tienda pública');
    view.unmount();
  });

  it('con sesión iniciada, el login y el registro redirigen a Mi cuenta', () => {
    const login = renderWithProviders(authRoutes, { route: '/iniciar-sesion', session: 'u-usuario' });
    expect(login.host.textContent).toContain('Mi cuenta');
    login.unmount();
    const register = renderWithProviders(authRoutes, { route: '/crear-sesion', session: 'u-usuario' });
    expect(register.host.textContent).toContain('Mi cuenta');
    register.unmount();
  });

  const protectedRoutes = (
    <Routes>
      <Route path="/admin" element={<RequireAdmin><p>Panel privado</p></RequireAdmin>} />
      <Route path="/iniciar-sesion" element={<p>Pantalla de login</p>} />
      <Route path="/" element={<p>Tienda pública</p>} />
    </Routes>
  );

  it('sin sesión, /admin redirige al login', () => {
    const view = renderWithProviders(protectedRoutes, { route: '/admin' });
    expect(view.host.textContent).toContain('Pantalla de login');
    view.unmount();
  });

  it('un cliente no entra a /admin y vuelve a la tienda', () => {
    const view = renderWithProviders(protectedRoutes, { route: '/admin', session: 'u-usuario' });
    expect(view.host.textContent).toContain('Tienda pública');
    view.unmount();
  });

  it('un administrador sí entra a /admin', () => {
    const view = renderWithProviders(protectedRoutes, { route: '/admin', session: 'u-admin' });
    expect(view.host.textContent).toContain('Panel privado');
    view.unmount();
  });
});

describe('Boleta y detalle de producto', () => {
  it('la compra exitosa muestra código, datos del cliente en campos de solo lectura y el total', () => {
    const view = renderWithProviders(
      <Routes>
        <Route path="/comprar-ok/:orderId" element={<PaymentSuccessPage />} />
      </Routes>,
      { route: '/comprar-ok/ord-demo0001' },
    );
    const order = SEED_DB.orders[0];
    expect(view.host.textContent).toContain('Se ha realizado la compra');
    expect(view.host.textContent).toContain(order.code);
    expect(view.host.querySelector('input[id$="-nombre"]').value).toBe(order.customer.name);
    expect(view.host.querySelector('input[id$="-nombre"]').disabled).toBeTrue();
    expect(view.host.textContent).toContain('Imprimir boleta en PDF');
    view.unmount();
  });

  it('abrir el detalle de un producto suma una visita', () => {
    const before = SEED_DB.products.find((p) => p.id === '2').vistas;
    const view = renderWithProviders(
      <>
        <Routes>
          <Route path="/productos/:id" element={<ProductDetailPage />} />
        </Routes>
        <Probes />
      </>,
      { route: '/productos/2' },
    );
    expect(store.db.products.find((p) => p.id === '2').vistas).toBe(before + 1);
    view.unmount();
  });

  it('el detalle de un producto agotado deshabilita "Agregar al Carrito"', () => {
    const db = structuredClone(SEED_DB);
    db.products[0] = { ...db.products[0], stock: 0, disponibilidad: 'Agotado' };
    const view = renderWithProviders(
      <Routes>
        <Route path="/productos/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/productos/1', db },
    );
    expect(buttonWithText(view.host, 'Agregar al Carrito').disabled).toBeTrue();
    view.unmount();
  });
});

describe('Estadísticas, gráficos y personajes', () => {
  it('calcula las estadísticas del perfil de un usuario', () => {
    const stats = userStats(SEED_DB.orders, 'u-admin', new Date('2026-10-27T12:00:00'));
    expect(stats.monthPurchases).toBe(2);
    expect(stats.previousMonthPurchases).toBe(1);
    expect(stats.totalPurchases).toBe(5);
    expect(stats.totalAmount).toBeGreaterThan(stats.monthAmount);
  });

  it('segmenta a los clientes según sus compras', () => {
    const segments = customerSegments(SEED_DB);
    expect(segments.recurrentes).toBeGreaterThan(0);
    expect(segments.nuevos).toBeGreaterThan(0);
    expect(segments.sinCompras).toBeGreaterThan(0);
  });

  it('genera los 10 gráficos del template con sus tipos', () => {
    const charts = generalCharts(SEED_DB);
    expect(charts.map((chart) => chart.type)).toEqual(['bar', 'line', 'pie', 'radar', 'doughnut', 'polarArea', 'scatter', 'bubble', 'bar', 'line']);
  });

  it('el gráfico de ventas mensuales suma el total vendido', () => {
    const [sales] = generalCharts(SEED_DB);
    const total = sales.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    expect(total).toBe(SEED_DB.orders.reduce((sum, order) => sum + order.total, 0));
  });

  it('genera los 4 gráficos del reporte de productos', () => {
    expect(productCharts(SEED_DB).map((chart) => chart.type)).toEqual(['bar', 'line', 'pie', 'radar']);
  });

  it('transforma personajes y pokémon al formato de usuario', () => {
    expect(transformCharacter({ id: 1, name: 'Rick Sanchez', image: 'rick.png' })).toEqual(jasmine.objectContaining({ id: 'u-10101', email: 'ricksanchez@example.com', role: 'cliente' }));
    expect(transformPokemon({ name: 'bulbasaur', sprites: { front_default: 'b.png' } }, 1).name).toBe('Bulbasaur');
  });

  it('si una API falla, devuelve las demás y avisa cuál falló', async () => {
    const fakeFetch = async (url) => {
      if (url.includes('rickandmorty')) throw new Error('sin red');
      return { ok: true, json: async () => ({ name: 'pikachu', sprites: { front_default: 'p.png' } }) };
    };
    const result = await fetchCharacterUsers({ fetchImpl: fakeFetch });
    expect(result.errors).toEqual(['Rick and Morty']);
    expect(result.users.length).toBe(50);
  });
});

describe('Stock crítico y formulario de usuario', () => {
  it('marca AGOTADO cuando no queda stock y SOLICITAR PRODUCTOS cuando está bajo el crítico', () => {
    expect(criticalStatus({ stock: 0, stock_critico: 5 }).label).toBe('AGOTADO');
    expect(criticalStatus({ stock: 2, stock_critico: 5 }).label).toContain('SOLICITAR PRODUCTOS');
  });

  it('la tabla de críticos muestra una fila por producto recibido', () => {
    const critical = SEED_DB.products.filter((p) => p.stock <= p.stock_critico);
    const view = renderWithProviders(<CriticalProductsTable products={critical} categories={SEED_DB.categories} />);
    expect(view.host.querySelectorAll('tbody tr').length).toBe(critical.length);
    view.unmount();
  });

  it('el formulario de usuario muestra errores de RUN y fecha solo al enviar con datos inválidos', () => {
    const onSubmit = jasmine.createSpy('onSubmit').and.returnValue({ ok: true });
    const view = renderWithProviders(<UserForm creating requireAddress allowRoleChange={false} onSubmit={onSubmit} />);
    expect(view.host.querySelector('.invalid-feedback')).toBeNull();
    typeText(view.host.querySelector('#usuario-run'), '11.111.111-9');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('RUN válido');
    expect(onSubmit).not.toHaveBeenCalled();
    view.unmount();
  });

  it('el formulario de usuario conserva lo escrito al cambiar de campo', () => {
    const view = renderWithProviders(<UserForm creating onSubmit={() => ({ ok: true })} />);
    typeText(view.host.querySelector('#usuario-nombre'), 'Camila');
    typeText(view.host.querySelector('#usuario-apellidos'), 'Rojas');
    expect(view.host.querySelector('#usuario-nombre').value).toBe('Camila');
    expect(view.host.querySelector('#usuario-apellidos').value).toBe('Rojas');
    view.unmount();
  });
});
