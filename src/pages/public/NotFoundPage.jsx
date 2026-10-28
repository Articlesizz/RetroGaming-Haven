// Página 404 para rutas que no existen.
import EmptyState from '../../components/common/EmptyState.jsx';

export default function NotFoundPage() {
  return <EmptyState title="Página no encontrada" description="La dirección que buscas no existe." actionLabel="Ir al inicio" actionTo="/" />;
}
