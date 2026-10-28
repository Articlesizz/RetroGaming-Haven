// Carrito. Reglas del template: no más unidades que el stock; un solo producto gratis por compra.
import { effectivePrice, isFree, isInStock } from './catalog.js';

export function sanitizeLines(lines) {
  if (!Array.isArray(lines)) return [];
  return lines.reduce((accumulated, line) => {
    const valid = line && typeof line.productId === 'string' && Number.isInteger(line.quantity) && line.quantity > 0;
    if (!valid || accumulated.some((item) => item.productId === line.productId)) return accumulated;
    return [...accumulated, { productId: line.productId, quantity: line.quantity }];
  }, []);
}

export function addToCart(lines, productId, quantity = 1) {
  if (!lines.some((line) => line.productId === productId)) return [...lines, { productId, quantity }];
  return lines.map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line));
}

export function removeLine(lines, productId) {
  return lines.filter((line) => line.productId !== productId);
}

export function setLineQuantity(lines, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) return removeLine(lines, productId);
  return lines.map((line) => (line.productId === productId ? { ...line, quantity } : line));
}

// Motivo por el que no se puede añadir el producto, o null si se puede.
export function cartAddBlocker(lines, product, products = []) {
  const inCart = lines.find((line) => line.productId === product.id)?.quantity ?? 0;
  if (!isInStock(product)) return `${product.nombre} está agotado.`;
  if (inCart >= product.stock) return `No puedes añadir más de ${product.stock} unidades de ${product.nombre}.`;
  if (isFree(product)) {
    const otherFree = lines.some((line) => {
      const item = products.find((p) => p.id === line.productId);
      return item && item.id !== product.id && isFree(item);
    });
    if (otherFree || inCart >= 1) return 'Solo puedes añadir un producto gratis por compra.';
  }
  return null;
}

// Une líneas y productos. Las líneas de productos que ya no existen se omiten.
export function buildCartDetails(lines, products) {
  return lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return [];
    const unitPrice = effectivePrice(product);
    return [
      {
        productId: product.id,
        nombre: product.nombre,
        imagen: product.imagen,
        stock: product.stock,
        free: isFree(product),
        unitPrice,
        quantity: line.quantity,
        subtotal: unitPrice * line.quantity,
      },
    ];
  });
}

export function cartTotals(details) {
  return {
    itemCount: details.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: details.reduce((sum, item) => sum + item.subtotal, 0),
  };
}
