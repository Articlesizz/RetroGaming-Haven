// Estrellas de valoración (0 a 5, con medias estrellas). Sin valoración no muestra nada.
import PropTypes from 'prop-types';

export default function Rating({ value, showNumber = true }) {
  if (!value) return null;
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="rating-stars" role="img" aria-label={`Valoración ${String(value).replace('.', ',')} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bi ${rounded >= star ? 'bi-star-fill' : rounded >= star - 0.5 ? 'bi-star-half' : 'bi-star'}`} aria-hidden="true" />
      ))}
      {showNumber && <small className="text-secondary ms-1">{value.toFixed(1).replace('.', ',')}</small>}
    </span>
  );
}

Rating.propTypes = {
  value: PropTypes.number,
  showNumber: PropTypes.bool,
};
