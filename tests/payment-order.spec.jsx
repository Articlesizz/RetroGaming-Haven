// Pago simulado y pedidos: determinismo, totales, stock e idempotencia ante reintentos.
import { useStore } from '../src/context/StoreContext.jsx';
import { SEED_DB } from '../src/data/seed.js';
import { buildOrder, calculateOrderTotals } from '../src/services/orderService.js';
import { simulatePayment } from '../src/services/paymentSimulator.js';
import { buildCartDetails } from '../src/utils/cart.js';
import { runAction } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

let store;
function StoreProbe() {
  store = useStore();
  return null;
}

function zeldaOrder(orderId, quantity = 2) {
  const details = buildCartDetails([{ productId: '1', quantity }], store.db.products);
  return buildOrder({
    id: orderId,
    customer: { customerId: 'u-usuario', name: 'Usuario', lastName: 'Demo', email: 'usuario@tienda.cl' },
    address: { street: 'Calle 1', department: '', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', notes: '' },
    details,
    deliveryType: 'retiro',
    payment: simulatePayment({ amount: 1, scenario: 'aprobado' }),
  });
}

describe('Pago simulado y pedidos', () => {
  it('la simulación es determinista: mismo escenario, mismo resultado', () => {
    expect(simulatePayment({ amount: 100, scenario: 'aprobado' })).toEqual(simulatePayment({ amount: 100, scenario: 'aprobado' }));
    expect(simulatePayment({ amount: 100 }).status).toBe('approved');
  });

  it('el escenario rechazado no aprueba el pago y lo declara', () => {
    const result = simulatePayment({ amount: 100, scenario: 'rechazado' });
    expect(result.status).toBe('rejected');
    expect(result.message).toContain('No se realizó ningún cargo');
  });

  it('rechaza montos no válidos', () => {
    expect(simulatePayment({ amount: -5 }).status).toBe('rejected');
    expect(simulatePayment({ amount: 'abc' }).status).toBe('rejected');
  });

  it('recalcula totales desde las líneas y suma el despacho', () => {
    const details = buildCartDetails([{ productId: '1', quantity: 2 }], SEED_DB.products);
    expect(calculateOrderTotals(details, 'retiro').total).toBe(2 * 5999);
    expect(calculateOrderTotals(details, 'despacho').total).toBe(2 * 5999 + 2990);
  });

  it('registra el pedido una sola vez aunque se reintente con el mismo intento', () => {
    const view = renderWithProviders(<StoreProbe />);
    const order = zeldaOrder('ord-test-1');
    const ordersBefore = store.db.orders.length;
    const stockBefore = store.db.products.find((p) => p.id === '1').stock;

    const first = runAction(() => store.registerOrder(order));
    expect(first.ok).toBeTrue();
    expect(first.created).toBeTrue();
    expect(store.db.orders.length).toBe(ordersBefore + 1);
    expect(store.db.products.find((p) => p.id === '1').stock).toBe(stockBefore - 2);

    const retry = runAction(() => store.registerOrder(order));
    expect(retry.ok).toBeTrue();
    expect(retry.created).toBeFalse();
    expect(store.db.orders.length).toBe(ordersBefore + 1);
    expect(store.db.products.find((p) => p.id === '1').stock).toBe(stockBefore - 2);
    view.unmount();
  });

  it('no registra un pedido si no hay stock suficiente', () => {
    const view = renderWithProviders(<StoreProbe />);
    const details = buildCartDetails([{ productId: '13', quantity: 3 }], store.db.products); // FIFA 21 tiene stock 2
    const order = buildOrder({
      id: 'ord-sin-stock',
      customer: { name: 'A', lastName: 'B', email: 'a@b.cl' },
      address: { street: 'X', region: 'R', comuna: 'C' },
      details,
      deliveryType: 'retiro',
      payment: { code: 'SIM-APROBADO' },
    });
    const result = runAction(() => store.registerOrder(order));
    expect(result.ok).toBeFalse();
    expect(result.error).toContain('Stock insuficiente');
    expect(store.db.orders.find((o) => o.id === 'ord-sin-stock')).toBeUndefined();
    view.unmount();
  });
});
