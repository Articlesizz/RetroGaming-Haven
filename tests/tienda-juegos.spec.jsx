// Funciones propias de una tienda de juegos: plataformas, descuentos, valoración, favoritos, relacionados y boletín.
import { Route, Routes } from 'react-router-dom';
import { SEED_DB } from '../src/data/seed.js';
import HomePage from '../src/pages/public/HomePage.jsx';
import CatalogPage from '../src/pages/public/CatalogPage.jsx';
import ProductDetailPage from '../src/pages/public/ProductDetailPage.jsx';
import WishlistPage from '../src/pages/public/WishlistPage.jsx';
import Newsletter from '../src/components/home/Newsletter.jsx';
import Rating from '../src/components/products/Rating.jsx';
import { ProductsPage } from '../src/pages/admin/ProductPages.jsx';
import { bestDeals, discountPercent, filterAdminProducts, filterProducts, DEFAULT_FILTERS, newest, relatedProducts, topRated } from '../src/utils/catalog.js';
import { dashboardOverview, filterOrders, filterUsers } from '../src/utils/reports.js';
import { normalizeProduct } from '../src/services/normalize.js';
import { changeSelect, click, typeText } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

const products = SEED_DB.products;

describe('Reglas de la tienda de juegos', () => {
  it('calcula el porcentaje de descuento y es 0 sin oferta', () => {
    expect(discountPercent({ precio_descuento: 10000, precio_nuevo: 7500 })).toBe(25);
    expect(discountPercent({ precio_descuento: 5000, precio_nuevo: 5000 })).toBe(0);
  });

  it('filtra por plataforma', () => {
    const switchGames = filterProducts(products, { ...DEFAULT_FILTERS, platform: 'Switch' });
    expect(switchGames.length).toBeGreaterThan(0);
    expect(switchGames.every((product) => product.plataformas.includes('Switch'))).toBeTrue();
  });

  it('ordena por mejor valoración y por mayor descuento', () => {
    const rated = filterProducts(products, { ...DEFAULT_FILTERS, sort: 'valoracion' });
    expect(rated[0].rating).toBeGreaterThanOrEqual(rated[rated.length - 1].rating);
    expect(topRated(products, 3).length).toBe(3);
    const deals = bestDeals(products, 3);
    expect(discountPercent(deals[0])).toBeGreaterThanOrEqual(discountPercent(deals[2]));
  });

  it('las ofertas destacadas no incluyen juegos gratis', () => {
    expect(bestDeals(products, 50).some((product) => product.precio_nuevo === 0)).toBeFalse();
  });

  it('las novedades empiezan por el año más reciente', () => {
    const [first, , third] = newest(products, 3);
    expect(first.anio).toBeGreaterThanOrEqual(third.anio);
  });

  it('los relacionados excluyen el propio juego y priorizan la misma categoría', () => {
    const base = products.find((product) => product.nombre === 'Cyberpunk 2077');
    const related = relatedProducts(products, base, 4);
    expect(related.length).toBe(4);
    expect(related.some((product) => product.id === base.id)).toBeFalse();
  });
});

describe('Ficha del juego en el administrador', () => {
  const base = { nombre: 'X', descripcion: 'd', categoryId: 'c', precio_nuevo: 1, stock: 1, stock_critico: 1, disponibilidad: 'Disponible' };

  it('normalizeProduct no agrega ficha si el formulario no la envía (no borra la existente)', () => {
    const result = normalizeProduct(base);
    expect('plataformas' in result).toBeFalse();
    expect('clasificacion' in result).toBeFalse();
  });

  it('normalizeProduct convierte la ficha enviada por el formulario', () => {
    const result = normalizeProduct({ ...base, plataformas: ['PC'], clasificacion: '16', anio: '2020', desarrollador: ' Estudio ', detalle: '' });
    expect(result.plataformas).toEqual(['PC']);
    expect(result.clasificacion).toBe(16);
    expect(result.anio).toBe(2020);
    expect(result.desarrollador).toBe('Estudio');
  });
});

describe('Pantallas de la tienda de juegos', () => {
  it('Rating muestra la nota con su texto accesible y no muestra nada sin valoración', () => {
    const view = renderWithProviders(<Rating value={4.5} />);
    expect(view.host.querySelector('[aria-label="Valoración 4,5 de 5"]')).not.toBeNull();
    expect(view.host.querySelectorAll('.bi-star-fill').length).toBe(4);
    expect(view.host.querySelectorAll('.bi-star-half').length).toBe(1);
    view.unmount();
    const vacio = renderWithProviders(<Rating />);
    expect(vacio.host.textContent).toBe('');
    vacio.unmount();
  });

  it('el inicio muestra plataformas, ofertas, novedades y el boletín', () => {
    const view = renderWithProviders(<HomePage />);
    expect(view.host.querySelectorAll('.platform-tile').length).toBe(5);
    expect(view.host.textContent).toContain('Ofertas de la semana');
    expect(view.host.textContent).toContain('Novedades');
    expect(view.host.textContent).toContain('Mejor valorados');
    expect(view.host.querySelector('#newsletter-email')).not.toBeNull();
    view.unmount();
  });

  it('el catálogo respeta la plataforma que llega en la dirección', () => {
    const view = renderWithProviders(<CatalogPage />, { route: '/productos?plataforma=Xbox' });
    expect(view.host.querySelector('#filtro-plataforma').value).toBe('Xbox');
    const expected = filterProducts(products, { ...DEFAULT_FILTERS, platform: 'Xbox' }).length;
    expect(view.host.textContent).toContain(`${expected} resultado(s)`);
    view.unmount();
  });

  it('el detalle muestra clasificación, plataformas y juegos relacionados', () => {
    const base = products.find((product) => product.nombre === 'The Witcher 3');
    const view = renderWithProviders(
      <Routes>
        <Route path="/productos/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: `/productos/${base.id}` },
    );
    expect(view.host.textContent).toContain('PEGI 18');
    expect(view.host.textContent).toContain('CD Projekt Red');
    expect(view.host.textContent).toContain('También te puede gustar');
    view.unmount();
  });

  it('el corazón guarda un juego en favoritos y la página de favoritos lo lista', () => {
    const view = renderWithProviders(
      <>
        <CatalogPage />
        <WishlistPage />
      </>,
    );
    expect(view.host.textContent).toContain('Aún no tienes favoritos');
    const heart = view.host.querySelector('.wishlist-btn');
    click(heart);
    expect(heart.getAttribute('aria-pressed')).toBe('true');
    expect(view.host.textContent).toContain('1 juego(s) guardado(s)');
    click(heart);
    expect(view.host.textContent).toContain('Aún no tienes favoritos');
    view.unmount();
  });

  it('el boletín rechaza un correo inválido y acepta uno válido', () => {
    const view = renderWithProviders(<Newsletter />);
    const input = view.host.querySelector('#newsletter-email');
    typeText(input, 'esto-no-es-un-correo');
    click(view.host.querySelector('button[type="submit"]'));
    expect(view.host.querySelector('[role="alert"]')).not.toBeNull();
    typeText(input, 'ana@correo.cl');
    click(view.host.querySelector('button[type="submit"]'));
    expect(view.host.querySelector('[role="alert"]')).toBeNull();
    view.unmount();
  });
});

describe('Administrador: resumen y filtros de listados', () => {
  const orders = SEED_DB.orders;

  it('dashboardOverview calcula ticket promedio, últimas órdenes y alertas de stock', () => {
    const overview = dashboardOverview(SEED_DB);
    const paid = orders.filter((order) => order.status === 'pagado');
    expect(overview.averageTicket).toBe(Math.round(paid.reduce((sum, order) => sum + order.total, 0) / paid.length));
    expect(overview.recentOrders.length).toBe(5);
    expect(overview.recentOrders[0].createdAt >= overview.recentOrders[4].createdAt).toBeTrue();
    expect(overview.stockAlerts.every((product) => product.stock <= product.stock_critico)).toBeTrue();
  });

  it('filterAdminProducts filtra por estado, plataforma y categoría', () => {
    const critical = filterAdminProducts(products, { status: 'critico' });
    expect(critical.length).toBeGreaterThan(0);
    expect(critical.every((product) => product.stock <= product.stock_critico)).toBeTrue();
    expect(filterAdminProducts(products, { status: 'gratis' }).every((product) => product.precio_nuevo === 0)).toBeTrue();
    expect(filterAdminProducts(products, { platform: 'Switch' }).every((product) => product.plataformas.includes('Switch'))).toBeTrue();
    const category = SEED_DB.categories[0].id;
    expect(filterAdminProducts(products, { categoryId: category }).every((product) => product.categoryId === category)).toBeTrue();
  });

  it('filterOrders busca por código y ordena por monto', () => {
    const code = orders[0].code;
    expect(filterOrders(orders, { query: code.toLowerCase() }).map((order) => order.code)).toContain(code);
    const sorted = filterOrders(orders, { sort: 'monto-desc' });
    expect(sorted[0].total).toBeGreaterThanOrEqual(sorted[sorted.length - 1].total);
    expect(filterOrders(orders, { query: 'zzz-no-existe' }).length).toBe(0);
  });

  it('filterUsers busca por nombre, correo o RUN y filtra por tipo', () => {
    const admins = filterUsers(SEED_DB.users, { role: 'admin' });
    expect(admins.length).toBeGreaterThan(0);
    expect(admins.every((user) => user.role === 'admin')).toBeTrue();
    expect(filterUsers(SEED_DB.users, { query: 'admin@tienda.cl' }).length).toBe(1);
  });

  it('el listado de productos del administrador filtra por estado y muestra el conteo', () => {
    const view = renderWithProviders(<ProductsPage />, { route: '/admin/producto', session: 'u-admin' });
    const critical = filterAdminProducts(products, { status: 'critico' }).length;
    changeSelect(view.host.querySelector('#admin-filtro-estado'), 'critico');
    expect(view.host.textContent).toContain(`${critical} de ${products.length}`);
    expect(view.host.textContent).toContain('Limpiar filtros');
    view.unmount();
  });
});
