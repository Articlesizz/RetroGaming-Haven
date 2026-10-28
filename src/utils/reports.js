// Indicadores e informes calculados desde los datos (no son cifras fijas). Alimentan el dashboard, el perfil y los gráficos.
import { isCritical } from './catalog.js';

export const paidOrders = (orders) => orders.filter((order) => order.status === 'pagado');

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function previousMonthKey(date = new Date()) {
  return monthKey(new Date(date.getFullYear(), date.getMonth() - 1, 1));
}

export const criticalProducts = (products) => products.filter(isCritical);

export function dashboardStats(db, now = new Date()) {
  const paid = paidOrders(db.orders);
  const currentMonth = monthKey(now);
  return {
    totalOrders: db.orders.length,
    totalSales: paid.reduce((sum, order) => sum + order.total, 0),
    productCount: db.products.length,
    totalStock: db.products.reduce((sum, product) => sum + product.stock, 0),
    criticalCount: criticalProducts(db.products).length,
    userCount: db.users.length,
    newUsersThisMonth: db.users.filter((user) => user.createdAt?.slice(0, 7) === currentMonth).length,
  };
}

// Estadísticas del perfil de un usuario (compras del mes, del mes anterior, totales y montos).
export function userStats(orders, userId, now = new Date()) {
  const own = paidOrders(orders).filter((order) => order.customerId === userId);
  const current = monthKey(now);
  const previous = previousMonthKey(now);
  const inMonth = (key) => own.filter((order) => order.createdAt.slice(0, 7) === key);
  const sum = (list) => list.reduce((total, order) => total + order.total, 0);
  return {
    monthPurchases: inMonth(current).length,
    previousMonthPurchases: inMonth(previous).length,
    totalPurchases: own.length,
    yearPurchases: own.filter((order) => order.createdAt.slice(0, 4) === String(now.getFullYear())).length,
    monthAmount: sum(inMonth(current)),
    totalAmount: sum(own),
  };
}

export function salesByProduct(orders) {
  const totals = new Map();
  paidOrders(orders).forEach((order) => {
    order.lines.forEach((line) => {
      const current = totals.get(line.productId) ?? { productId: line.productId, nombre: line.nombre, units: 0, revenue: 0 };
      totals.set(line.productId, { ...current, units: current.units + line.quantity, revenue: current.revenue + line.subtotal });
    });
  });
  return [...totals.values()].sort((a, b) => b.units - a.units);
}

export function salesByMonth(orders) {
  const months = new Map();
  paidOrders(orders).forEach((order) => {
    const key = order.createdAt.slice(0, 7);
    const current = months.get(key) ?? { month: key, orders: 0, total: 0, units: 0 };
    const units = order.lines.reduce((sum, line) => sum + line.quantity, 0);
    months.set(key, { ...current, orders: current.orders + 1, total: current.total + order.total, units: current.units + units });
  });
  return [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function stockValueByCategory(db) {
  return db.categories.map((category) => {
    const products = db.products.filter((product) => product.categoryId === category.id);
    return {
      categoryId: category.id,
      nombre: category.nombre,
      products: products.length,
      units: products.reduce((sum, product) => sum + product.stock, 0),
      views: products.reduce((sum, product) => sum + (product.vistas ?? 0), 0),
      value: products.reduce((sum, product) => sum + product.stock * product.precio_nuevo, 0),
    };
  });
}

export function purchaseHistory(orders, userId) {
  return orders.filter((order) => order.customerId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Usuarios acumulados por mes de alta.
export function usersGrowth(users) {
  const byMonth = new Map();
  users.forEach((user) => {
    const key = (user.createdAt ?? '').slice(0, 7);
    if (key) byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  });
  const labels = [...byMonth.keys()].sort();
  let accumulated = 0;
  return { labels, values: labels.map((label) => (accumulated += byMonth.get(label))) };
}

// Unidades vendidas por categoría (pedidos pagados).
export function unitsByCategory(db) {
  const categoryOf = new Map(db.products.map((product) => [product.id, product.categoryId]));
  const units = new Map(db.categories.map((category) => [category.id, 0]));
  paidOrders(db.orders).forEach((order) => {
    order.lines.forEach((line) => {
      const categoryId = categoryOf.get(line.productId);
      if (units.has(categoryId)) units.set(categoryId, units.get(categoryId) + line.quantity);
    });
  });
  return db.categories.map((category) => ({ categoryId: category.id, nombre: category.nombre, units: units.get(category.id) }));
}

// Ventas por categoría y por mes (para el gráfico de barras apiladas).
export function salesByCategoryAndMonth(db) {
  const categoryOf = new Map(db.products.map((product) => [product.id, product.categoryId]));
  const months = salesByMonth(db.orders).map((row) => row.month);
  const series = db.categories.map((category) => ({ categoryId: category.id, nombre: category.nombre, data: months.map(() => 0) }));
  paidOrders(db.orders).forEach((order) => {
    const monthIndex = months.indexOf(order.createdAt.slice(0, 7));
    order.lines.forEach((line) => {
      const serie = series.find((item) => item.categoryId === categoryOf.get(line.productId));
      if (serie && monthIndex >= 0) serie.data[monthIndex] += line.subtotal;
    });
  });
  return { months, series: series.filter((serie) => serie.data.some((value) => value > 0)) };
}

// Segmentación de clientes por cantidad de compras pagadas.
export function customerSegments(db) {
  const counts = new Map();
  paidOrders(db.orders).forEach((order) => counts.set(order.customerId, (counts.get(order.customerId) ?? 0) + 1));
  const customers = db.users.filter((user) => user.role === 'cliente' || counts.has(user.id));
  return {
    sinCompras: customers.filter((user) => !counts.has(user.id)).length,
    nuevos: customers.filter((user) => counts.get(user.id) === 1).length,
    recurrentes: customers.filter((user) => (counts.get(user.id) ?? 0) >= 2).length,
  };
}

// Resumen ampliado del dashboard: ventas del mes, ticket promedio, últimas órdenes y los más vendidos.
export function dashboardOverview(db, now = new Date()) {
  const paid = paidOrders(db.orders);
  const month = monthKey(now);
  const monthOrders = paid.filter((order) => order.createdAt.slice(0, 7) === month);
  const sum = (list) => list.reduce((total, order) => total + order.total, 0);
  return {
    paidCount: paid.length,
    monthSales: sum(monthOrders),
    monthOrders: monthOrders.length,
    averageTicket: paid.length === 0 ? 0 : Math.round(sum(paid) / paid.length),
    recentOrders: [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    topProducts: salesByProduct(db.orders).slice(0, 5),
    // Más urgentes primero: sin stock y luego los de menor stock.
    stockAlerts: [...criticalProducts(db.products)].sort((a, b) => a.stock - b.stock).slice(0, 6),
  };
}

export const ORDER_SORTS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'antiguas', label: 'Más antiguas' },
  { value: 'monto-desc', label: 'Mayor monto' },
  { value: 'monto-asc', label: 'Menor monto' },
];

// Listado de órdenes: búsqueda por id, código, comuna o región, y orden por fecha o monto.
export function filterOrders(orders, { query = '', sort = 'recientes' } = {}) {
  const text = query.trim().toLowerCase();
  const matches = (order) =>
    !text || [order.id, order.code, order.address?.comuna, order.address?.region].some((field) => String(field ?? '').toLowerCase().includes(text));
  const sorters = {
    recientes: (a, b) => b.createdAt.localeCompare(a.createdAt),
    antiguas: (a, b) => a.createdAt.localeCompare(b.createdAt),
    'monto-desc': (a, b) => b.total - a.total,
    'monto-asc': (a, b) => a.total - b.total,
  };
  return orders.filter(matches).sort(sorters[sort] ?? sorters.recientes);
}

// Listado de usuarios: búsqueda por nombre, correo o RUN y filtro por tipo.
export function filterUsers(users, { query = '', role = '' } = {}) {
  const text = query.trim().toLowerCase();
  return users.filter((user) => {
    const matchesText = !text || [`${user.name} ${user.lastName}`, user.email, user.run].some((field) => String(field ?? '').toLowerCase().includes(text));
    return matchesText && (!role || user.role === role);
  });
}
