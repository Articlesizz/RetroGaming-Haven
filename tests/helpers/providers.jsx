// Monta la aplicación con sus proveedores reales, sin persistencia en localStorage y con datos de prueba.
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '../../src/context/StoreContext.jsx';
import { SessionProvider } from '../../src/context/SessionContext.jsx';
import { CartProvider } from '../../src/context/CartContext.jsx';
import { WishlistProvider } from '../../src/context/WishlistContext.jsx';
import { ToastProvider } from '../../src/context/ToastContext.jsx';
import { SEED_DB } from '../../src/data/seed.js';
import { render, memoryStorage } from './dom.js';

// session: id del usuario con sesión iniciada (p. ej. 'u-usuario').
export function renderWithProviders(ui, { db = structuredClone(SEED_DB), lines = [], route = '/', session = null } = {}) {
  const storage = memoryStorage(session ? { 'mi-tienda:session': JSON.stringify(session) } : {});
  return render(
    <MemoryRouter initialEntries={[route]}>
      <StoreProvider initialDb={db} persist={false}>
        <SessionProvider storage={storage}>
          <CartProvider initialLines={lines} persist={false}>
            <WishlistProvider persist={false}>
              <ToastProvider>{ui}</ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </StoreProvider>
    </MemoryRouter>,
  );
}
