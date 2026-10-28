// Estado compartido del carrito. Persiste las líneas en localStorage para sobrevivir recargas.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../data/storage.js';
import { addToCart, removeLine, sanitizeLines, setLineQuantity } from '../utils/cart.js';

export const CART_KEY = 'mi-tienda:cart';

const CartContext = createContext(null);

export function CartProvider({ children, initialLines, persist = true, storage }) {
  const [lines, setLines] = useState(() => sanitizeLines(initialLines ?? readJson(CART_KEY, [], storage)));

  useEffect(() => {
    if (persist) writeJson(CART_KEY, lines, storage);
  }, [lines, persist, storage]);

  const addItem = useCallback((productId, quantity = 1) => {
    setLines((previous) => addToCart(previous, productId, quantity));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setLines((previous) => setLineQuantity(previous, productId, quantity));
  }, []);

  const removeItem = useCallback((productId) => {
    setLines((previous) => removeLine(previous, productId));
  }, []);

  // Vaciar solo se invoca al confirmar un pago exitoso o desde el propio carrito; un fallo no lo vacía.
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, addItem, setQuantity, removeItem, clear }),
    [lines, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
