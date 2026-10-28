// Reglas del catálogo: precios con descuento, productos gratis, stock, filtros y orden. Funciones puras.
import { placeholderImage } from './placeholder.js';

export const DEFAULT_FILTERS = {
  query: '',
  categoryId: '',
  platform: '',
  sort: 'orden',
  onlyOffers: false,
  onlyInStock: false,
};

export const SORT_OPTIONS = [
  { value: 'orden', label: 'Orden original' },
  { value: 'nombre', label: 'Nombre (A-Z)' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'valoracion', label: 'Mejor valorados' },
  { value: 'descuento', label: 'Mayor descuento' },
  { value: 'recientes', label: 'Más recientes' },
];

// Imagen del producto: data URL subida desde el admin, archivo de public/imagenes/productos o marcador 400 x 300.
export function productImageUrl(product, width = 400, height = 300) {
  if (!product.imagen) return placeholderImage(width, height, product.nombre ?? 'Producto');
  if (product.imagen.startsWith('data:') || product.imagen.startsWith('http')) return product.imagen;
  return `/imagenes/productos/${product.imagen}`;
}

export const hasOffer = (product) =>
  product.precio_descuento !== null && product.precio_descuento !== undefined && product.precio_descuento > product.precio_nuevo;
export const effectivePrice = (product) => product.precio_nuevo;
// Porcentaje de rebaja respecto del precio normal (0 si no hay oferta).
export const discountPercent = (product) =>
  hasOffer(product) ? Math.round(((product.precio_descuento - product.precio_nuevo) / product.precio_descuento) * 100) : 0;
export const supportsPlatform = (product, platform) => (product.plataformas ?? []).includes(platform);
export const isFree = (product) => product.precio_nuevo === 0;
// Un producto se puede comprar si tiene stock y no está marcado como agotado.
export const isInStock = (product) => product.stock > 0 && product.disponibilidad !== 'Agotado';
// Crítico: el stock llegó al "stock crítico" configurado en cada producto.
export const isCritical = (product) => product.stock <= (product.stock_critico ?? 0);

const SORTERS = {
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  'precio-asc': (a, b) => effectivePrice(a) - effectivePrice(b),
  'precio-desc': (a, b) => effectivePrice(b) - effectivePrice(a),
  valoracion: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  descuento: (a, b) => discountPercent(b) - discountPercent(a),
  recientes: (a, b) => (b.anio ?? 0) - (a.anio ?? 0) || (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
};

export function filterProducts(products, filters = DEFAULT_FILTERS) {
  const query = (filters.query ?? '').trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesQuery =
      !query || product.nombre.toLowerCase().includes(query) || product.descripcion.toLowerCase().includes(query);
    const matchesCategory = !filters.categoryId || product.categoryId === filters.categoryId;
    const matchesOffer = !filters.onlyOffers || hasOffer(product);
    const matchesPlatform = !filters.platform || supportsPlatform(product, filters.platform);
    const matchesStock = !filters.onlyInStock || isInStock(product);
    return matchesQuery && matchesCategory && matchesOffer && matchesStock && matchesPlatform;
  });
  const sorter = SORTERS[filters.sort];
  return sorter ? [...filtered].sort(sorter) : filtered;
}

// "Los más vistos": ordena por visitas al detalle (empates por id).
export function mostViewed(products, limit = 8) {
  return [...products].sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0) || Number(a.id) - Number(b.id)).slice(0, limit);
}

export const topRated = (products, limit = 6) => [...products].filter((p) => p.rating).sort(SORTERS.valoracion).slice(0, limit);
export const bestDeals = (products, limit = 6) => products.filter((p) => hasOffer(p) && !isFree(p)).sort(SORTERS.descuento).slice(0, limit);
export const freeGames = (products) => products.filter(isFree);
export const newest = (products, limit = 6) => [...products].filter((p) => p.anio).sort(SORTERS.recientes).slice(0, limit);

// Juegos parecidos: misma categoría primero y luego plataformas en común. Excluye el propio producto.
export function relatedProducts(products, product, limit = 4) {
  const score = (other) =>
    (other.categoryId === product.categoryId ? 2 : 0) + (other.plataformas ?? []).filter((p) => (product.plataformas ?? []).includes(p)).length * 0.1;
  return products
    .filter((other) => other.id !== product.id)
    .sort((a, b) => score(b) - score(a) || (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export const ADMIN_STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'critico', label: 'Stock crítico' },
  { value: 'agotado', label: 'Agotados' },
  { value: 'oferta', label: 'En oferta' },
  { value: 'gratis', label: 'Gratis' },
];

// Filtros del listado de productos del administrador: texto, categoría, plataforma y estado.
export function filterAdminProducts(products, { query = '', categoryId = '', platform = '', status = '' } = {}) {
  return filterProducts(products, { ...DEFAULT_FILTERS, query, categoryId, platform }).filter((product) => {
    if (status === 'critico') return isCritical(product);
    if (status === 'agotado') return !isInStock(product);
    if (status === 'oferta') return hasOffer(product);
    if (status === 'gratis') return isFree(product);
    return true;
  });
}
