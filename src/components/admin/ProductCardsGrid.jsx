// Productos en formato tarjeta (index-formato.html del template). Cada tarjeta lleva al detalle de administración.
import { Link } from 'react-router-dom';
import ProductImage from '../common/ProductImage.jsx';
import { hasOffer, isFree } from '../../utils/catalog.js';
import { formatPrice } from '../../utils/money.js';

export default function ProductCardsGrid({ products }) {
  if (products.length === 0) return <p className="text-secondary">No hay productos que coincidan.</p>;
  return (
    <div className="row my-3" id="productContainer">
      {products.map((product) => (
        <div className="col-6 col-md-4 col-xl-3 mb-4" key={product.id}>
          <Link to={`/admin/producto/${product.id}`} className="text-decoration-none">
            <div className="card card-producto h-100">
              <ProductImage product={product} className="card-img-top" />
              <div className="card-body">
                <p className="card-title link-none">{product.nombre}</p>
                <div className="d-flex flex-column mb-3">
                  <span className="precio-descuento text-decoration-line-through">{hasOffer(product) ? formatPrice(product.precio_descuento) : <br />}</span>
                  <span className="precio-nuevo fw-bolder">{isFree(product) ? 'FREE' : formatPrice(product.precio_nuevo)}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
