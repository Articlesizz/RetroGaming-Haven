// Tarjeta de producto (card-producto del template). Tres modelos:
//  - "ver":   botón "Ver" (modelo 1 del inicio)
//  - "click": toda la tarjeta es un enlace (modelo 2 y "Los más vistos")
//  - "add":   botones "Ver" y "Añadir" (catálogo, categorías y ofertas)
// "Añadir" respeta el stock, los productos agotados y la regla de un solo producto gratis.
import PropTypes from 'prop-types';
import { productShape } from '../../utils/propShapes.js';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import ProductImage from '../common/ProductImage.jsx';
import PlatformBadges from './PlatformBadges.jsx';
import Rating from './Rating.jsx';
import WishlistButton from './WishlistButton.jsx';
import { cartAddBlocker } from '../../utils/cart.js';
import { discountPercent, hasOffer, isFree, isInStock } from '../../utils/catalog.js';
import { formatPrice } from '../../utils/money.js';

export default function ProductCard({ product, categoryName = '', variant = 'ver', showStock = false }) {
  const navigate = useNavigate();
  const { db } = useStore();
  const { lines, addItem } = useCart();
  const { notify } = useToast();
  const detailPath = `/productos/${product.id}`;
  const available = isInStock(product);

  const handleAdd = () => {
    const blocker = cartAddBlocker(lines, product, db.products);
    if (blocker) {
      notify(blocker, 'danger');
      return;
    }
    addItem(product.id);
    notify(`${product.nombre} añadido al carrito.`);
  };

  const clickable = variant === 'click';

  return (
    <article
      className={`card card-producto product-card h-100`}
      onClick={clickable ? () => navigate(detailPath) : undefined}
      onKeyDown={clickable ? (event) => event.key === 'Enter' && navigate(detailPath) : undefined}
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Ver ${product.nombre}` : undefined}
    >
      <div className="card-media position-relative">
        <ProductImage product={product} className="card-img-top" />
        {discountPercent(product) > 0 && <span className="badge-discount">-{discountPercent(product)}%</span>}
        {isFree(product) && <span className="badge-discount badge-free">GRATIS</span>}
        {!available && <span className="badge-soldout">AGOTADO</span>}
        <WishlistButton product={product} className="card-wish" />
      </div>
      <div className="card-body d-flex flex-column">
        <Link to={detailPath} className="link-none">
          <p className="card-title mb-1">{product.nombre}</p>
        </Link>
        {categoryName && <small className="text-muted">{categoryName}</small>}
        <Rating value={product.rating} />
        <div className="my-2">
          <PlatformBadges platforms={product.plataformas} />
        </div>
        <div className="d-flex flex-column mb-3">
          <span className="precio-descuento text-decoration-line-through">{hasOffer(product) ? formatPrice(product.precio_descuento) : <br />}</span>
          <span className="precio-nuevo fw-bolder">{isFree(product) ? 'FREE' : formatPrice(product.precio_nuevo)}</span>
        </div>
        {showStock && <small className="text-muted mb-2">{available ? `Stock Disponible ${product.stock}` : 'Agotado'}</small>}
        {variant === 'ver' && (
          <div className="d-grid mt-auto">
            <Link className="btn btn-dark" to={detailPath}>
              Ver
            </Link>
          </div>
        )}
        {variant === 'add' && (
          <div className="d-grid gap-2 mt-auto">
            <Link className="btn btn-dark" to={detailPath}>
              Ver
            </Link>
            <button type="button" className="btn btn-outline-secondary" onClick={handleAdd} disabled={!available}>
              Añadir
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: productShape.isRequired,
  categoryName: PropTypes.string,
  variant: PropTypes.oneOf(['ver', 'click', 'add']),
  showStock: PropTypes.bool,
};
