// Totales y pedidos. Los totales se recalculan siempre desde las líneas.
import { cartTotals } from '../utils/cart.js';

export const DELIVERY_OPTIONS = {
  retiro: { label: 'Retiro en tienda', cost: 0 },
  // Costo de despacho de demostración (el template no define envíos).
  despacho: { label: 'Despacho a domicilio', cost: 2990 },
};

export function calculateOrderTotals(details, deliveryType) {
  const { itemCount, subtotal } = cartTotals(details);
  const deliveryCost = DELIVERY_OPTIONS[deliveryType]?.cost ?? 0;
  return { itemCount, subtotal, deliveryCost, total: subtotal + deliveryCost };
}

// Problemas de stock de las líneas (lista vacía = todo disponible).
export function stockProblems(lines, products) {
  return lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return [`${line.nombre} ya no está disponible.`];
    if (product.stock < line.quantity) return [`Stock insuficiente para ${product.nombre} (disponible: ${product.stock}).`];
    return [];
  });
}

export function buildOrder({ id, customer, address, details, deliveryType, payment, createdAt = new Date().toISOString() }) {
  const totals = calculateOrderTotals(details, deliveryType);
  return {
    id,
    code: `ORDER-${id.slice(-8).toUpperCase()}`,
    customerId: customer.customerId ?? null,
    customer: { name: customer.name, lastName: customer.lastName, email: customer.email },
    address: {
      street: address.street,
      department: address.department ?? '',
      region: address.region,
      comuna: address.comuna,
      notes: address.notes ?? '',
    },
    lines: details.map((item) => ({
      productId: item.productId,
      nombre: item.nombre,
      imagen: item.imagen ?? null,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    delivery: {
      type: deliveryType,
      label: DELIVERY_OPTIONS[deliveryType]?.label ?? DELIVERY_OPTIONS.retiro.label,
      cost: totals.deliveryCost,
    },
    subtotal: totals.subtotal,
    deliveryCost: totals.deliveryCost,
    total: totals.total,
    status: 'pagado',
    payment: { provider: 'Simulación local', code: payment.code },
    createdAt,
  };
}
