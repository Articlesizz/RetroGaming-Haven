// RUN chileno: limpieza, dígito verificador (módulo 11), validación y formato.
export const cleanRun = (value) => String(value ?? '').replace(/[^0-9kK]/g, '').toUpperCase();

export function computeDv(body) {
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const rest = 11 - (sum % 11);
  if (rest === 11) return '0';
  if (rest === 10) return 'K';
  return String(rest);
}

// Cuerpo de 7 u 8 dígitos más el dígito verificador.
export function isValidRun(value) {
  const run = cleanRun(value);
  if (run.length < 8 || run.length > 9) return false;
  return computeDv(run.slice(0, -1)) === run.slice(-1);
}

export function formatRun(value) {
  const run = cleanRun(value);
  if (run.length < 2) return run;
  const body = run.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${run.slice(-1)}`;
}

// Construye un RUN válido a partir de un número (para datos de ejemplo).
export const makeRun = (number) => `${number}${computeDv(String(number))}`;
