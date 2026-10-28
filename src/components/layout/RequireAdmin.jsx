// Protege las rutas /admin: sin sesión va a /iniciar-sesion; sin rol de administrador vuelve a la tienda.
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';

export default function RequireAdmin({ children }) {
  const { user } = useSession();
  const location = useLocation();

  if (!user) return <Navigate to="/iniciar-sesion" replace state={{ from: location.pathname }} />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
