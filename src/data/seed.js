// Fuente de datos simulada (similar a una base de datos).
// Productos y usuarios provienen de data/productos.js y data/usuarios.js del template (Anexo 3), generados en
// productos.js / usuarios.js de esta carpeta. Las cuentas de demostración usan las credenciales del template (admin / usuario, clave 12345).
// Las órdenes de ejemplo son datos de demostración para que historiales y reportes tengan contenido.
import { PRODUCTOS_INICIALES } from './productos.js';
import { USUARIOS_INICIALES } from './usuarios.js';
import { FICHAS } from './fichas.js';
import { formatRun, makeRun } from '../utils/run.js';

export const SEED_VERSION = 6;

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const categoryNames = [...new Set(PRODUCTOS_INICIALES.map((product) => product.categoria))];

const SEED_CATEGORIES = categoryNames.map((nombre) => ({
  id: `cat-${slugify(nombre)}`,
  nombre,
  slug: slugify(nombre),
  descripcion: `Videojuegos de la categoría ${nombre}.`,
  imagen: null,
}));

const ROLE_BY_TIPO = { 1: 'admin', 2: 'vendedor', 3: 'cliente' };

const SEED_PRODUCTS = PRODUCTOS_INICIALES.map((product, index) => ({
  id: product.id,
  nombre: product.nombre,
  descripcion: product.descripcion,
  categoryId: SEED_CATEGORIES.find((category) => category.nombre === product.categoria).id,
  precio_descuento: product.precio_descuento,
  precio_nuevo: product.precio_nuevo,
  stock: product.stock,
  stock_critico: product.stock_critico ?? 5,
  disponibilidad: product.stock > 0 ? 'Disponible' : 'Agotado',
  imagen: product.imagen ?? null,
  // Contador de visitas al detalle: ordena "Los más vistos". Valores de ejemplo deterministas.
  vistas: 20 + ((index * 37) % 90),
  createdAt: product.createdAt,
  ...FICHAS[product.nombre],
}));

// Separa "Benjamin Mora" en nombre y apellidos para los formularios.
const splitName = (fullName) => {
  const [name, ...rest] = fullName.split(' ');
  return { name, lastName: rest.join(' ') };
};

const SEED_USERS = [
  {
    id: 'u-admin',
    name: 'Administrador',
    lastName: 'Demo',
    email: 'admin@tienda.cl',
    username: 'admin',
    password: '12345',
    run: formatRun(makeRun(11111111)),
    birthDate: '1990-05-10',
    role: 'admin',
    phone: '',
    imagen: null,
    street: 'Av. Providencia 1234',
    department: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Providencia',
    notes: '',
    createdAt: '2026-01-05',
  },
  {
    id: 'u-usuario',
    name: 'Usuario',
    lastName: 'Demo',
    email: 'usuario@tienda.cl',
    username: 'usuario',
    password: '12345',
    run: formatRun(makeRun(12222222)),
    birthDate: '1998-09-21',
    role: 'cliente',
    phone: '',
    imagen: null,
    street: 'Calle Demo 123',
    department: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Maipú',
    notes: '',
    createdAt: '2026-02-01',
  },
  ...USUARIOS_INICIALES.map((user, index) => ({
    id: `u-${user.id}`,
    ...splitName(user.name),
    email: user.email,
    username: '',
    password: '',
    run: formatRun(makeRun(13000000 + index * 1234567 + 11)),
    birthDate: '1995-01-15',
    role: ROLE_BY_TIPO[user.tipo] ?? 'cliente',
    phone: user.phone,
    imagen: null,
    street: '',
    department: '',
    region: '',
    comuna: '',
    notes: '',
    createdAt: '2026-01-20',
  })),
];

const productById = (id) => SEED_PRODUCTS.find((product) => product.id === id);

function makeOrder(number, userId, date, items, delivery = 'retiro') {
  const user = SEED_USERS.find((item) => item.id === userId);
  const lines = items.map(([productId, quantity]) => {
    const product = productById(productId);
    return {
      productId,
      nombre: product.nombre,
      imagen: product.imagen,
      unitPrice: product.precio_nuevo,
      quantity,
      subtotal: product.precio_nuevo * quantity,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const deliveryCost = delivery === 'despacho' ? 2990 : 0;
  const code = String(number).padStart(4, '0');
  return {
    id: `ord-demo${code}`,
    code: `ORDER-DEMO${code}`,
    customerId: userId,
    customer: { name: user.name, lastName: user.lastName, email: user.email },
    address: {
      street: user.street || 'Calle Demo 123',
      department: '',
      region: user.region || 'Región Metropolitana de Santiago',
      comuna: user.comuna || 'Maipú',
      notes: '',
    },
    lines,
    delivery: { type: delivery, label: delivery === 'retiro' ? 'Retiro en tienda' : 'Despacho a domicilio', cost: deliveryCost },
    subtotal,
    deliveryCost,
    total: subtotal + deliveryCost,
    status: 'pagado',
    payment: { provider: 'Simulación local', code: 'SIM-APROBADO' },
    createdAt: `${date}T12:00:00.000Z`,
  };
}

const SEED_ORDERS = [
  makeOrder(1, 'u-usuario', '2026-03-15', [['1', 1]]),
  makeOrder(2, 'u-usuario', '2026-05-02', [['3', 2], ['7', 1]], 'despacho'),
  makeOrder(3, 'u-usuario', '2026-09-18', [['5', 1], ['11', 1]]),
  makeOrder(4, 'u-admin', '2026-02-10', [['6', 1]]),
  makeOrder(5, 'u-admin', '2026-04-22', [['8', 1], ['17', 1]]),
  makeOrder(6, 'u-admin', '2026-09-05', [['20', 1]], 'despacho'),
  makeOrder(7, 'u-admin', '2026-10-12', [['2', 1], ['15', 1]]),
  makeOrder(8, 'u-admin', '2026-10-20', [['19', 1]]),
  makeOrder(9, 'u-10001', '2026-06-11', [['12', 1], ['14', 1]]),
  makeOrder(10, 'u-10001', '2026-08-30', [['9', 1]]),
  makeOrder(11, 'u-10009', '2026-07-07', [['1', 1], ['4', 1]]),
  makeOrder(12, 'u-10006', '2026-10-02', [['16', 1], ['18', 1]], 'despacho'),
];

export const SEED_DB = {
  version: SEED_VERSION,
  settings: { lowStockThreshold: 5 },
  categories: SEED_CATEGORIES,
  products: SEED_PRODUCTS,
  users: SEED_USERS,
  orders: SEED_ORDERS,
};
