// Validaciones de formularios: obligatorios, correo, RUN, fecha de nacimiento, cantidades, stock y coherencia de precios.
import { SEED_DB } from '../src/data/seed.js';
import { normalizeProduct } from '../src/services/normalize.js';
import { cleanRun, computeDv, formatRun, isValidRun, makeRun } from '../src/utils/run.js';
import {
  hasErrors,
  isValidBirthDate,
  isValidEmail,
  validateCategory,
  validateCheckout,
  validateContact,
  validateLogin,
  validatePasswordChange,
  validateProduct,
  validateQuantity,
  validateRegister,
  validateUser,
} from '../src/utils/validators.js';

const validProduct = {
  codigo: '',
  nombre: 'Palta Game',
  descripcion: 'Juego de prueba',
  categoryId: SEED_DB.categories[0].id,
  precio_descuento: 7000,
  precio_nuevo: 6000,
  stock: 5,
  stock_critico: 3,
  disponibilidad: 'Disponible',
  imagen: null,
};

const validCheckout = {
  name: 'Ana',
  lastName: 'Pérez',
  email: 'ana@example.com',
  street: 'Calle 1',
  department: '',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Maipú',
  notes: '',
  delivery: 'retiro',
};

const validUser = {
  run: makeRun(14141414),
  name: 'Ana',
  lastName: 'Pérez',
  email: 'ana.nueva@example.com',
  birthDate: '1999-04-12',
  role: 'cliente',
  password: '123456',
};

describe('RUN', () => {
  it('calcula el dígito verificador con módulo 11', () => {
    expect(computeDv('11111111')).toBe('1');
    expect(computeDv('12345678')).toBe('5');
  });

  it('valida el RUN completo y rechaza dígitos verificadores incorrectos', () => {
    expect(isValidRun('11.111.111-1')).toBeTrue();
    expect(isValidRun('12.345.678-5')).toBeTrue();
    expect(isValidRun('12.345.678-9')).toBeFalse();
    expect(isValidRun('123')).toBeFalse();
  });

  it('limpia y da formato con puntos y guion', () => {
    expect(cleanRun('11.111.111-k')).toBe('11111111K');
    expect(formatRun('111111111')).toBe('11.111.111-1');
  });
});

describe('Validaciones', () => {
  it('acepta correos bien formados y rechaza los incompletos', () => {
    expect(isValidEmail('ana@example.com')).toBeTrue();
    expect(isValidEmail('ana@example')).toBeFalse();
    expect(isValidEmail('')).toBeFalse();
  });

  it('acepta un producto correcto sin errores', () => {
    expect(hasErrors(validateProduct(validProduct, SEED_DB.categories))).toBeFalse();
  });

  it('permite productos gratis (precio 0)', () => {
    expect(validateProduct({ ...validProduct, precio_nuevo: 0 }, SEED_DB.categories).precio_nuevo).toBeUndefined();
  });

  it('exige que el precio normal sea mayor o igual al precio final', () => {
    expect(validateProduct({ ...validProduct, precio_descuento: 5000 }, SEED_DB.categories).precio_descuento).toContain('mayor o igual');
  });

  it('rechaza precios negativos, stock decimal, stock crítico vacío y categorías inexistentes', () => {
    const errors = validateProduct({ ...validProduct, precio_nuevo: -1, stock: 2.5, stock_critico: NaN, categoryId: 'no-existe' }, SEED_DB.categories);
    expect(errors.precio_nuevo).toBeDefined();
    expect(errors.stock).toBeDefined();
    expect(errors.stock_critico).toBeDefined();
    expect(errors.categoryId).toBeDefined();
  });

  it('un producto sin stock no puede quedar como Disponible', () => {
    const errors = validateProduct({ ...validProduct, stock: 0, disponibilidad: 'Disponible' }, SEED_DB.categories);
    expect(errors.disponibilidad).toContain('sin stock');
    expect(validateProduct({ ...validProduct, stock: 0, disponibilidad: 'Agotado' }, SEED_DB.categories).disponibilidad).toBeUndefined();
  });

  it('el código de un producto nuevo debe ser único y con formato válido', () => {
    const options = { products: SEED_DB.products, creating: true };
    expect(validateProduct({ ...validProduct, codigo: '1' }, SEED_DB.categories, options).codigo).toContain('Ya existe');
    expect(validateProduct({ ...validProduct, codigo: 'mal código!' }, SEED_DB.categories, options).codigo).toBeDefined();
    expect(validateProduct({ ...validProduct, codigo: 'JUEGO-100' }, SEED_DB.categories, options).codigo).toBeUndefined();
  });

  it('normaliza el precio normal vacío a null y el texto a números', () => {
    const normalized = normalizeProduct({ ...validProduct, precio_descuento: '', precio_nuevo: '2000', stock: '4', stock_critico: '2' });
    expect(normalized.precio_descuento).toBeNull();
    expect(normalized.precio_nuevo).toBe(2000);
    expect(normalized.stock).toBe(4);
    expect(normalized.stock_critico).toBe(2);
  });

  it('exige campos obligatorios en el checkout y no exige departamento', () => {
    const errors = validateCheckout({ ...validCheckout, name: '', email: 'x', street: '' });
    expect(errors.name).toBe('El nombre es obligatorio.');
    expect(errors.email).toBeDefined();
    expect(errors.street).toBeDefined();
    expect(errors.department).toBeUndefined();
  });

  it('acepta el checkout completo y marca el carrito vacío como error', () => {
    expect(hasErrors(validateCheckout(validCheckout))).toBeFalse();
    expect(validateCheckout(validCheckout, { hasItems: false }).cart).toBeDefined();
  });

  it('valida cantidades positivas y dentro del stock', () => {
    expect(validateQuantity(0, 5)).toContain('mayor que 0');
    expect(validateQuantity(3, 2)).toContain('Solo hay 2');
    expect(validateQuantity(2, 5)).toBeNull();
  });

  it('acepta un usuario completo y detecta RUN inválido', () => {
    expect(hasErrors(validateUser(validUser, SEED_DB.users, { creating: true }))).toBeFalse();
    expect(validateUser({ ...validUser, run: '11.111.111-9' }, SEED_DB.users, { creating: true }).run).toContain('RUN válido');
  });

  it('detecta RUN y correo repetidos y exige contraseña al crear usuarios', () => {
    const existing = SEED_DB.users[1];
    const errors = validateUser({ ...validUser, run: existing.run, email: existing.email, password: '' }, SEED_DB.users, { creating: true });
    expect(errors.run).toContain('Ya existe');
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('no considera repetido el correo ni el RUN del propio usuario al editar', () => {
    const own = SEED_DB.users[1];
    const errors = validateUser({ run: own.run, name: own.name, lastName: own.lastName, email: own.email, birthDate: own.birthDate, role: own.role }, SEED_DB.users, { currentId: own.id });
    expect(hasErrors(errors)).toBeFalse();
  });

  it('valida la fecha de nacimiento: formato, no futura y posterior a 1900', () => {
    expect(isValidBirthDate('1999-04-12')).toBeTrue();
    expect(isValidBirthDate('2999-01-01')).toBeFalse();
    expect(isValidBirthDate('1850-01-01')).toBeFalse();
    expect(isValidBirthDate('12/04/1999')).toBeFalse();
  });

  it('el registro público exige contraseñas iguales y dirección completa', () => {
    const errors = validateRegister({ ...validUser, confirmPassword: 'otra', street: '', region: '', comuna: '' });
    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden.');
    expect(errors.street).toBeDefined();
    expect(errors.region).toBeDefined();
    expect(errors.comuna).toBeDefined();
  });

  it('valida el cambio de contraseña del perfil', () => {
    expect(validatePasswordChange({ password: '123', confirmPassword: '123' }).password).toBeDefined();
    expect(validatePasswordChange({ password: '123456', confirmPassword: '654321' }).confirmPassword).toBeDefined();
    expect(hasErrors(validatePasswordChange({ password: '123456', confirmPassword: '123456' }))).toBeFalse();
  });

  it('exige usuario y contraseña para iniciar sesión', () => {
    const errors = validateLogin({ username: '', password: '' });
    expect(errors.username).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('impide categorías duplicadas y exige descripción', () => {
    expect(validateCategory({ nombre: SEED_DB.categories[0].nombre.toUpperCase(), descripcion: 'x' }, SEED_DB.categories).nombre).toContain('Ya existe');
    expect(validateCategory({ nombre: 'Nueva', descripcion: '' }, SEED_DB.categories).descripcion).toBeDefined();
  });

  it('valida el mensaje de contacto', () => {
    expect(validateContact({ name: 'Ana', email: 'ana@example.com', message: 'corto' }).message).toBeDefined();
  });
});
