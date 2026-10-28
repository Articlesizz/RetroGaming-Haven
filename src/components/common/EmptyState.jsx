// Estado vacío: se muestra cuando una lista o búsqueda no tiene resultados.
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="text-center py-5 px-3 border rounded-3 bg-white">
      <h2 className="h5">{title}</h2>
      {description && <p className="text-secondary mb-3">{description}</p>}
      {actionLabel && actionTo && (
        <Link className="btn btn-success" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionTo: PropTypes.string,
};
