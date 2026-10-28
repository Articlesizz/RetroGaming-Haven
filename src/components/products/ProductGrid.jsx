// Cuadrícula de productos. Las columnas se eligen con la prop cols (clases row-cols de Bootstrap):
// "row-cols-2 row-cols-md-6" (modelo 1 y 2 del inicio) o "row-cols-2 row-cols-md-4" (categorías, más vistos).
import PropTypes from 'prop-types';
import EmptyState from '../common/EmptyState.jsx';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({
  products,
  categories = [],
  variant = 'ver',
  cols = 'row-cols-2 row-cols-md-4 g-4',
  showStock = false,
  emptyTitle = 'No hay productos para mostrar',
  emptyDescription = 'Prueba con otros filtros o términos de búsqueda.',
}) {
  if (products.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  const categoryNames = new Map(categories.map((category) => [category.id, category.nombre]));

  return (
    <div className={`row ${cols}`}>
      {products.map((product) => (
        <div className="col" key={product.id}>
          <ProductCard product={product} categoryName={categoryNames.get(product.categoryId) ?? ''} variant={variant} showStock={showStock} />
        </div>
      ))}
    </div>
  );
}

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  categories: PropTypes.array,
  variant: PropTypes.oneOf(['ver', 'click', 'add']),
  cols: PropTypes.string,
  showStock: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
};
