// Carrito y catálogo: cantidades, reglas del template (stock y un solo producto gratis), totales, filtros y reportes.
import { SEED_DB } from '../src/data/seed.js';
import { addToCart, buildCartDetails, cartAddBlocker, cartTotals, removeLine, sanitizeLines, setLineQuantity } from '../src/utils/cart.js';
import { filterProducts, hasOffer, isCritical, isFree, mostViewed } from '../src/utils/catalog.js';
import { criticalProducts, dashboardStats, salesByMonth, salesByProduct } from '../src/utils/reports.js';

const byId = (id) => SEED_DB.products.find((product) => product.id === id);

describe('Carrito', () => {
  it('añade un producto nuevo y suma cantidades si ya existe', () => {
    const lines = addToCart(addToCart([], '1'), '1', 2);
    expect(lines).toEqual([{ productId: '1', quantity: 3 }]);
  });

  it('cambia la cantidad y elimina la línea si la cantidad no es positiva', () => {
    const lines = [{ productId: '1', quantity: 2 }];
    expect(setLineQuantity(lines, '1', 5)).toEqual([{ productId: '1', quantity: 5 }]);
    expect(setLineQuantity(lines, '1', 0)).toEqual([]);
  });

  it('elimina una línea concreta', () => {
    expect(removeLine([{ productId: '1', quantity: 1 }, { productId: '2', quantity: 1 }], '1')).toEqual([{ productId: '2', quantity: 1 }]);
  });

  it('descarta líneas guardadas inválidas y duplicadas', () => {
    const cleaned = sanitizeLines([
      { productId: '1', quantity: 2 },
      { productId: '1', quantity: 9 },
      { productId: '2', quantity: -1 },
      null,
    ]);
    expect(cleaned).toEqual([{ productId: '1', quantity: 2 }]);
    expect(sanitizeLines('no es una lista')).toEqual([]);
  });

  it('impide añadir más unidades que el stock', () => {
    const product = byId('13'); // FIFA 21, stock 2
    const blocker = cartAddBlocker([{ productId: '13', quantity: 2 }], product, SEED_DB.products);
    expect(blocker).toContain('No puedes añadir más de 2 unidades');
  });

  it('solo permite un producto gratis por compra', () => {
    const lines = [{ productId: '4', quantity: 1 }];
    expect(cartAddBlocker(lines, byId('10'), SEED_DB.products)).toBe('Solo puedes añadir un producto gratis por compra.');
    expect(cartAddBlocker([], byId('10'), SEED_DB.products)).toBeNull();
  });

  it('calcula subtotales con el precio final y suma productos gratis con subtotal 0', () => {
    const details = buildCartDetails([{ productId: '1', quantity: 2 }, { productId: '4', quantity: 1 }], SEED_DB.products);
    expect(details[0].subtotal).toBe(2 * 5999);
    expect(details[1].free).toBeTrue();
    expect(cartTotals(details)).toEqual({ itemCount: 3, subtotal: 2 * 5999 });
  });

  it('omite líneas de productos que ya no existen', () => {
    expect(buildCartDetails([{ productId: 'desaparecido', quantity: 1 }], SEED_DB.products)).toEqual([]);
  });
});

describe('Catálogo y reportes', () => {
  it('detecta ofertas y productos gratis desde los precios del template', () => {
    expect(hasOffer(byId('1'))).toBeTrue();
    expect(isFree(byId('4'))).toBeTrue();
    expect(isFree(byId('1'))).toBeFalse();
  });

  it('filtra por texto en nombre o descripción', () => {
    expect(filterProducts(SEED_DB.products, { query: 'zelda' }).map((p) => p.id)).toEqual(['1']);
  });

  it('filtra solo productos en oferta', () => {
    const offers = filterProducts(SEED_DB.products, { onlyOffers: true });
    expect(offers.length).toBe(SEED_DB.products.filter(hasOffer).length);
  });

  it('filtra por categoría y solo con stock', () => {
    const category = SEED_DB.categories[0].id;
    const result = filterProducts(SEED_DB.products, { categoryId: category, onlyInStock: true });
    expect(result.every((product) => product.categoryId === category && product.stock > 0)).toBeTrue();
  });

  it('ordena por precio final de menor a mayor', () => {
    const asc = filterProducts(SEED_DB.products, { sort: 'precio-asc' });
    expect(asc[0].precio_nuevo).toBe(0);
    expect(asc[asc.length - 1].precio_nuevo).toBe(Math.max(...SEED_DB.products.map((p) => p.precio_nuevo)));
  });

  it('un producto es crítico cuando su stock llega al stock crítico definido en el propio producto', () => {
    const fifa = byId('13'); // stock 2, stock crítico 5
    expect(isCritical(fifa)).toBeTrue();
    expect(isCritical({ ...fifa, stock: 6 })).toBeFalse();
    expect(isCritical({ ...fifa, stock: 6, stock_critico: 10 })).toBeTrue();
    expect(criticalProducts(SEED_DB.products).map((p) => p.id)).toContain('13');
  });

  it('"Los más vistos" ordena por visitas y desempata por id', () => {
    const viewed = mostViewed(SEED_DB.products, 3);
    expect(viewed.length).toBe(3);
    expect(viewed[0].vistas).toBeGreaterThanOrEqual(viewed[1].vistas);
    expect(viewed[1].vistas).toBeGreaterThanOrEqual(viewed[2].vistas);
  });

  it('calcula el dashboard desde los datos', () => {
    const stats = dashboardStats(SEED_DB, new Date('2026-02-15T12:00:00'));
    expect(stats.totalOrders).toBe(SEED_DB.orders.length);
    expect(stats.totalSales).toBe(SEED_DB.orders.reduce((sum, order) => sum + order.total, 0));
    expect(stats.criticalCount).toBe(criticalProducts(SEED_DB.products).length);
    expect(stats.productCount).toBe(SEED_DB.products.length);
    expect(stats.userCount).toBe(SEED_DB.users.length);
    expect(stats.newUsersThisMonth).toBe(1);
  });

  it('agrupa ventas por producto y por mes solo con pedidos pagados', () => {
    const sales = salesByProduct(SEED_DB.orders);
    const units = SEED_DB.orders.flatMap((order) => order.lines).reduce((sum, line) => sum + line.quantity, 0);
    expect(sales.reduce((sum, row) => sum + row.units, 0)).toBe(units);
    expect(sales[0].units).toBeGreaterThanOrEqual(sales[sales.length - 1].units);
    const months = salesByMonth(SEED_DB.orders);
    expect(months.length).toBeGreaterThan(1);
    expect(months.reduce((sum, row) => sum + row.total, 0)).toBe(SEED_DB.orders.reduce((sum, order) => sum + order.total, 0));
  });
});
