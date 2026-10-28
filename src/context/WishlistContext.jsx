// Lista de deseos (favoritos): ids de productos guardados en localStorage. No requiere sesión.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../data/storage.js';

export const WISHLIST_KEY = 'mi-tienda:wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children, initialIds, persist = true, storage }) {
  const [ids, setIds] = useState(() => {
    const stored = initialIds ?? readJson(WISHLIST_KEY, [], storage);
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : [];
  });

  useEffect(() => {
    if (persist) writeJson(WISHLIST_KEY, ids, storage);
  }, [ids, persist, storage]);

  const toggle = useCallback((id) => {
    setIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const value = useMemo(() => ({ ids, has: (id) => ids.includes(id), toggle }), [ids, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  return context;
}
