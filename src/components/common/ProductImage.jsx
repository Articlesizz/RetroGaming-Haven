// Imagen de producto con texto alternativo. Sin foto propia usa el marcador con dimensiones.
import PropTypes from 'prop-types';
import { productShape } from '../../utils/propShapes.js';
import { productImageUrl } from '../../utils/catalog.js';

export default function ProductImage({ product, className = 'thumb', width }) {
  return (
    <img
      src={productImageUrl(product)}
      alt={product.nombre ? `Imagen de ${product.nombre}` : 'Producto sin nombre'}
      className={className}
      width={width}
      loading="lazy"
    />
  );
}

ProductImage.propTypes = {
  product: productShape.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
