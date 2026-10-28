// Íconos de las plataformas en las que se puede jugar un producto. Con `labels` muestra también el nombre.
import PropTypes from 'prop-types';
import { PLATFORMS } from '../../data/fichas.js';

export default function PlatformBadges({ platforms = [], labels = false }) {
  const known = PLATFORMS.filter((platform) => platforms.includes(platform.id));
  if (known.length === 0) return null;
  return (
    <ul className="platform-badges list-unstyled d-flex flex-wrap gap-1 mb-0" aria-label="Plataformas">
      {known.map((platform) => (
        <li key={platform.id} className="platform-badge" title={platform.label}>
          <i className={`bi ${platform.icon}`} aria-hidden="true" />
          {labels ? <span className="ms-1">{platform.label}</span> : <span className="visually-hidden">{platform.label}</span>}
        </li>
      ))}
    </ul>
  );
}

PlatformBadges.propTypes = {
  platforms: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.bool,
};
