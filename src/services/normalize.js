// Convierte los datos de los formularios (texto) al formato del modelo antes de validar y guardar.
import { cleanRun, formatRun } from '../utils/run.js';

const toText = (value) => String(value ?? '').trim();

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function normalizeProduct(data) {
  return {
    // Código opcional al crear: pasa a ser el id del producto.
    codigo: toText(data.codigo),
    nombre: toText(data.nombre),
    descripcion: toText(data.descripcion),
    categoryId: toText(data.categoryId),
    // Precio "normal" (tachado). Vacío = sin descuento.
    precio_descuento: toText(data.precio_descuento) === '' ? null : Number(data.precio_descuento),
    precio_nuevo: Number(data.precio_nuevo),
    stock: Number(data.stock),
    stock_critico: toText(data.stock_critico) === '' ? NaN : Number(data.stock_critico),
    disponibilidad: toText(data.disponibilidad),
    imagen: toText(data.imagen) || null,
    // Ficha del juego: solo se incluye si el formulario la envía, para no borrar la de un producto al editar otros datos.
    ...('plataformas' in data ? { plataformas: Array.isArray(data.plataformas) ? data.plataformas : [] } : {}),
    ...('clasificacion' in data ? { clasificacion: toText(data.clasificacion) === '' ? null : Number(data.clasificacion) } : {}),
    ...('anio' in data ? { anio: toText(data.anio) === '' ? null : Number(data.anio) } : {}),
    ...('desarrollador' in data ? { desarrollador: toText(data.desarrollador) } : {}),
    ...('detalle' in data ? { detalle: toText(data.detalle) } : {}),
  };
}

export function normalizeCategory(data) {
  const nombre = toText(data.nombre);
  return { nombre, slug: slugify(nombre), descripcion: toText(data.descripcion), imagen: toText(data.imagen) || null };
}

export function normalizeUser(data) {
  const password = toText(data.password);
  return {
    run: formatRun(cleanRun(data.run)),
    name: toText(data.name),
    lastName: toText(data.lastName),
    email: toText(data.email).toLowerCase(),
    birthDate: toText(data.birthDate),
    phone: toText(data.phone),
    role: ['admin', 'vendedor', 'cliente'].includes(data.role) ? data.role : 'cliente',
    imagen: toText(data.imagen) || null,
    street: toText(data.street),
    department: toText(data.department),
    region: toText(data.region),
    comuna: toText(data.comuna),
    notes: toText(data.notes),
    // Sin contraseña nueva no se sobrescribe la existente (edición).
    ...(password ? { password } : {}),
  };
}
