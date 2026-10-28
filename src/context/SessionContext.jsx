// Sesión local de DEMOSTRACIÓN (credenciales del template). No es autenticación segura.
// Solo guarda el id del usuario activo en localStorage.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readJson, removeKey, writeJson } from '../data/storage.js';
import { useStore } from './StoreContext.jsx';

export const SESSION_KEY = 'mi-tienda:session';

const SessionContext = createContext(null);

export function SessionProvider({ children, storage }) {
  const { db, createUser } = useStore();
  const [userId, setUserId] = useState(() => readJson(SESSION_KEY, null, storage));
  const user = useMemo(() => db.users.find((item) => item.id === userId) ?? null, [db.users, userId]);

  const startSession = useCallback(
    (id) => {
      setUserId(id);
      writeJson(SESSION_KEY, id, storage);
    },
    [storage],
  );

  // Busca por usuario y clave (cuentas con username del template). Devuelve el usuario o null.
  const login = useCallback(
    (username, password) => {
      const found = db.users.find(
        (item) => item.username && item.username === String(username ?? '').trim() && item.password === password,
      );
      if (!found) return null;
      startSession(found.id);
      return found;
    },
    [db.users, startSession],
  );

  const register = useCallback(
    (data) => {
      const result = createUser({ ...data, role: 'cliente' });
      if (result.ok) startSession(result.record.id);
      return result;
    },
    [createUser, startSession],
  );

  const logout = useCallback(() => {
    setUserId(null);
    removeKey(SESSION_KEY, storage);
  }, [storage]);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession debe usarse dentro de SessionProvider');
  return context;
}
