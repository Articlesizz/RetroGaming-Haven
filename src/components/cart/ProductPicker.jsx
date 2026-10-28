// "Lista de productos" de carrito.html: tarjetas con nombre, categoría, precios, stock y botón "Añadir".
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Link } from 'react-router-dom';
import ProductImage from '../common/ProductImage.jsx';
import { cartAddBlocker } from '../../utils/cart.js';
import { hasOffer, isFree, isInStock } from '../../utils/catalog.js';
import { formatPrice } from '../../utils/money.js';

export default function ProductPicker({ products, categories }) {
  const { lines, addItem } = useCart();
  const { notify } = useToast();
  const categoryNames = new Map(categories.map((category) => [category.id, category.nombre]));

  const handleAdd = (product) => {
    const blocker = cartAddBlocker(lines, product, products);
    if (blocker) {
      notify(blocker, 'danger');
      return;
    }
    addItem(product.id);
  };

  return (
    <div className="row g-3" id="product-list">
      {products.map((product) => (
        <div className="col-6 col-lg-4 col-xxl-3" key={product.id}>
          <div className="card card-producto h-100">
            <ProductImage product={product} className="card-img-top" />
            <div className="card-body d-flex flex-column">
              <Link to={`/productos/${product.id}`} className="link-none">
                <p className="card-title mb-0">{product.nombre}</p>
                <small className="text-muted">{categoryNames.get(product.categoryId)}</small>
              </Link>
              <div className="d-flex flex-column mb-3">
                <span className="precio-descuento text-decoration-line-through">{hasOffer(product) ? formatPrice(product.precio_descuento) : <br />}</span>
                <span className="precio-nuevo fw-bolder">{isFree(product) ? 'FREE' : formatPrice(product.precio_nuevo)}</span>
              </div>
              <div className="d-grid mt-auto">
                <small className="text-muted">Stock Disponible {product.stock}</small>
                <button type="button" className="btn btn-dark" disabled={!isInStock(product)} onClick={() => handleAdd(product)}>
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
