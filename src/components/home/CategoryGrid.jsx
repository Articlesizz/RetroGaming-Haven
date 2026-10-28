// Fila de tarjetas de categoría del inicio (cuatro por fila en escritorio).
import PropTypes from 'prop-types';
import CategoryCard from './CategoryCard.jsx';

export default function CategoryGrid({ categories, products }) {
  return (
    <div className="row g-3">
      {categories.map((category) => (
        <div className="col-6 col-md-4 col-lg-3" key={category.id}>
          <CategoryCard category={category} productCount={products.filter((product) => product.categoryId === category.id).length} />
        </div>
      ))}
    </div>
  );
}

CategoryGrid.propTypes = {
  categories: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};
