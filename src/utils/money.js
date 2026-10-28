// Formato de precios y fechas en español (Chile). Los precios se guardan como números.
export const formatPrice = (value) => `$${Number(value ?? 0).toLocaleString('es-CL')}`;

export function formatDate(value) {
  if (!value) return '';
  const date = value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString('es-CL');
}

// Fecha y hora cortas en español (Chile), p. ej. "15-03-2026 09:30".
export function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}
