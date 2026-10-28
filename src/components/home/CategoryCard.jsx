// Tarjeta de categoría del inicio (index.html del template): ícono o imagen, nombre y cantidad de juegos.
// Toda la tarjeta es un solo enlace a la categoría (reemplaza al botón "Explorar" para que la lista sea compacta).
import PropTypes from 'prop-types';
import { categoryShape } from '../../utils/propShapes.js';
import { Link } from 'react-router-dom';
import CategoryVisual from './CategoryVisual.jsx';

export default function CategoryCard({ category, productCount }) {
  return (
    <div className="card category-tile h-100">
      <CategoryVisual category={category} height={110} className="card-img-top" />
      <div className="card-body py-2 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h6 card-title mb-0">
            <Link to={`/categorias/${category.slug}`} className="stretched-link link-none">
              {category.nombre}
            </Link>
          </h3>
          <small className="text-muted">{productCount} juego(s)</small>
        </div>
        <i className="bi bi-chevron-right text-secondary" aria-hidden="true" />
      </div>
    </div>
  );
}

CategoryCard.propTypes = {
  category: categoryShape.isRequired,
  productCount: PropTypes.number.isRequired,
};
