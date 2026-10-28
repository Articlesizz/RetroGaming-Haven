// Formas (PropTypes) compartidas por varios componentes: describen los objetos del modelo de datos.
import PropTypes from 'prop-types';

export const productShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string,
  categoryId: PropTypes.string,
  precio_nuevo: PropTypes.number,
  precio_descuento: PropTypes.number,
  stock: PropTypes.number,
  rating: PropTypes.number,
  plataformas: PropTypes.arrayOf(PropTypes.string),
});

export const categoryShape = PropTypes.shape({
  id: PropTypes.string,
  nombre: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  imagen: PropTypes.string,
});
