// Validaciones de formularios. Cada función devuelve { campo: mensaje }; objeto vacío = válido.
import { cleanRun, isValidRun } from './run.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value ?? '').trim());
const isBlank = (value) => String(value ?? '').trim() === '';
const isMoney = (value) => Number.isFinite(value) && value >= 0;
export const isWholeNumber = (value) => Number.isInteger(value) && value >= 0;
export const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;
export const hasErrors = (errors) => Object.keys(errors).length > 0;

// Fecha de nacimiento: debe existir, ser pasada y posterior a 1900.
export function isValidBirthDate(value, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && date <= now && date.getFullYear() >= 1900;
}

export function validateQuantity(quantity, stock) {
  if (!isPositiveInteger(quantity)) return 'La cantidad debe ser un entero mayor que 0.';
  if (stock !== undefined && Number(quantity) > stock) return `Solo hay ${stock} unidad(es) disponibles.`;
  return null;
}

export function validateProduct(product, categories = [], { products = [], creating = false } = {}) {
  const errors = {};
  if (creating && product.codigo) {
    if (!/^[A-Za-z0-9-]{1,20}$/.test(product.codigo)) errors.codigo = 'El código admite letras, números y guiones (máximo 20).';
    else if (products.some((item) => item.id === product.codigo)) errors.codigo = 'Ya existe un producto con ese código.';
  }
  if (isBlank(product.nombre) || product.nombre.length < 2) errors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres).';
  if (!categories.some((category) => category.id === product.categoryId)) errors.categoryId = 'Selecciona una categoría válida.';
  if (!isMoney(product.precio_nuevo)) errors.precio_nuevo = 'El precio debe ser un número mayor o igual a 0 (0 = gratis).';
  if (product.precio_descuento !== null && product.precio_descuento !== undefined) {
    if (!isMoney(product.precio_descuento)) {
      errors.precio_descuento = 'El precio normal debe ser un número mayor o igual a 0.';
    } else if (isMoney(product.precio_nuevo) && product.precio_descuento < product.precio_nuevo) {
      errors.precio_descuento = 'El precio normal debe ser mayor o igual al precio final.';
    }
  }
  if (!isWholeNumber(product.stock)) errors.stock = 'El stock debe ser un entero mayor o igual a 0.';
  if (!isWholeNumber(product.stock_critico)) errors.stock_critico = 'El stock crítico debe ser un entero mayor o igual a 0.';
  if (!['Disponible', 'Agotado'].includes(product.disponibilidad)) errors.disponibilidad = 'Selecciona la disponibilidad.';
  else if (product.disponibilidad === 'Disponible' && product.stock === 0) {
    errors.disponibilidad = 'Un producto sin stock no puede estar disponible.';
  }
  if (product.descripcion.length > 300) errors.descripcion = 'La descripción no puede superar 300 caracteres.';
  return errors;
}

export function validateCategory(category, categories = [], currentId = null) {
  const errors = {};
  if (isBlank(category.nombre)) errors.nombre = 'El nombre de la categoría es obligatorio.';
  const duplicated = categories.some(
    (item) => item.id !== currentId && item.nombre.toLowerCase() === category.nombre.toLowerCase(),
  );
  if (duplicated) errors.nombre = 'Ya existe una categoría con ese nombre.';
  if (isBlank(category.descripcion)) errors.descripcion = 'La descripción es obligatoria.';
  return errors;
}

export function validateUser(user, users = [], { creating = false, currentId = null } = {}) {
  const errors = {};
  if (!isValidRun(user.run)) errors.run = 'Ingresa un RUN válido (ej: 11.111.111-1).';
  else if (users.some((item) => item.id !== currentId && cleanRun(item.run) === cleanRun(user.run))) {
    errors.run = 'Ya existe un usuario con ese RUN.';
  }
  if (isBlank(user.name)) errors.name = 'El nombre es obligatorio.';
  if (isBlank(user.lastName)) errors.lastName = 'Los apellidos son obligatorios.';
  if (!isValidEmail(user.email)) errors.email = 'Ingresa un correo válido.';
  else if (users.some((item) => item.id !== currentId && item.email === user.email)) {
    errors.email = 'Ya existe un usuario con ese correo.';
  }
  if (!isValidBirthDate(user.birthDate)) errors.birthDate = 'Ingresa una fecha de nacimiento válida (no futura).';
  if (!['admin', 'vendedor', 'cliente'].includes(user.role)) errors.role = 'Rol no válido.';
  if (creating && !user.password) errors.password = 'La contraseña es obligatoria (mínimo 6 caracteres).';
  else if (user.password && user.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  return errors;
}

export function validateCheckout(form, { hasItems = true } = {}) {
  const errors = {};
  if (isBlank(form.name)) errors.name = 'El nombre es obligatorio.';
  if (isBlank(form.lastName)) errors.lastName = 'Los apellidos son obligatorios.';
  if (!isValidEmail(form.email)) errors.email = 'Ingresa un correo válido.';
  if (isBlank(form.street)) errors.street = 'La calle es obligatoria.';
  if (isBlank(form.region)) errors.region = 'Selecciona una región.';
  if (isBlank(form.comuna)) errors.comuna = 'Selecciona una comuna.';
  if (!['retiro', 'despacho'].includes(form.delivery)) errors.delivery = 'Selecciona un tipo de entrega.';
  if (String(form.notes ?? '').length > 200) errors.notes = 'Las indicaciones no pueden superar 200 caracteres.';
  if (!hasItems) errors.cart = 'El carrito está vacío.';
  return errors;
}

// Registro público (crear-sesion.html): datos personales, contraseña repetida y dirección obligatoria.
export function validateRegister(form) {
  const errors = validateUser({ ...form, role: 'cliente' }, [], { creating: true });
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
  if (isBlank(form.street)) errors.street = 'La calle es obligatoria.';
  if (isBlank(form.region)) errors.region = 'Selecciona una región.';
  if (isBlank(form.comuna)) errors.comuna = 'Selecciona una comuna.';
  return errors;
}

export function validateLogin(form) {
  const errors = {};
  if (isBlank(form.username)) errors.username = 'Ingresa tu usuario.';
  if (isBlank(form.password)) errors.password = 'Ingresa tu contraseña.';
  return errors;
}

export function validateContact(form) {
  const errors = {};
  if (isBlank(form.name)) errors.name = 'Tu nombre es obligatorio.';
  if (!isValidEmail(form.email)) errors.email = 'Ingresa un correo válido.';
  if (String(form.message ?? '').trim().length < 10) errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  return errors;
}

// Cambio de contraseña del perfil.
export function validatePasswordChange(form) {
  const errors = {};
  if (!form.password || form.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
  return errors;
}
