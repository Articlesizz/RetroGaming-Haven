// Simulación determinista de pasarela de pago. NO procesa dinero real ni captura datos de tarjetas.
// El mismo escenario siempre produce el mismo resultado, lo que permite probarlo.
export const PAYMENT_SCENARIOS = [
  { value: 'aprobado', label: 'Aprobado (simulación)' },
  { value: 'rechazado', label: 'Rechazado (simulación)' },
];

export function simulatePayment({ amount, scenario = 'aprobado' }) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) {
    return { status: 'rejected', code: 'SIM-MONTO', message: 'El monto a pagar no es válido.', amount: value };
  }
  if (scenario === 'rechazado') {
    return {
      status: 'rejected',
      code: 'SIM-RECHAZO',
      message: 'La simulación rechazó el pago. No se realizó ningún cargo.',
      amount: value,
    };
  }
  return { status: 'approved', code: 'SIM-APROBADO', message: 'Pago aprobado (simulación).', amount: value };
}
