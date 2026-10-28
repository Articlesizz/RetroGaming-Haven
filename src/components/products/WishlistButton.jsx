// Corazón para guardar un juego en favoritos. Con `label` se muestra como botón con texto (detalle de producto).
import PropTypes from 'prop-types';
import { productShape } from '../../utils/propShapes.js';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function WishlistButton({ product, label = false, className = '' }) {
  const { has, toggle } = useWishlist();
  const { notify } = useToast();
  const active = has(product.id);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(product.id);
    notify(active ? `${product.nombre} se quitó de favoritos.` : `${product.nombre} se guardó en favoritos.`, active ? 'secondary' : 'success');
  };

  const text = active ? 'Quitar de favoritos' : 'Añadir a favoritos';
  return (
    <button
      type="button"
      className={label ? `btn btn-outline-danger ${className}` : `wishlist-btn ${active ? 'active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={`${text}: ${product.nombre}`}
      onClick={handleClick}
    >
      <i className={`bi ${active ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true" />
      {label && <span className="ms-2">{text}</span>}
    </button>
  );
}

WishlistButton.propTypes = {
  product: productShape.isRequired,
  label: PropTypes.bool,
  className: PropTypes.string,
};
