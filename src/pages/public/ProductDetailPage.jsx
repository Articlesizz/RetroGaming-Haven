// Detalle de producto (producto1.html del template): migas de pan, imagen, valoración, precios, descripción,
// características y "Agregar al Carrito". Cada visita suma al contador de "Los más vistos".
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import AppButton from '../../components/common/AppButton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductImage from '../../components/common/ProductImage.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { cartAddBlocker } from '../../utils/cart.js';
import PlatformBadges from '../../components/products/PlatformBadges.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import Rating from '../../components/products/Rating.jsx';
import WishlistButton from '../../components/products/WishlistButton.jsx';
import { discountPercent, hasOffer, isFree, isInStock, relatedProducts } from '../../utils/catalog.js';
import { formatPrice } from '../../utils/money.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { db, registerView } = useStore();
  const { lines, addItem } = useCart();
  const { notify } = useToast();
  const [error, setError] = useState('');

  useEffect(() => {
    registerView(id);
  }, [id, registerView]);

  const product = db.products.find((item) => item.id === id);
  if (!product) {
    return (
      <div className="container mt-5">
        <EmptyState title="Producto no encontrado" description="Puede que el producto ya no esté disponible." actionLabel="Volver al catálogo" actionTo="/productos" />
      </div>
    );
  }

  const category = db.categories.find((item) => item.id === product.categoryId);

  const handleAdd = () => {
    const blocker = cartAddBlocker(lines, product, db.products);
    if (blocker) {
      setError(blocker);
      return;
    }
    setError('');
    addItem(product.id);
    notify(`${product.nombre} añadido al carrito.`);
  };

  return (
    <div className="page-gray pb-5">
      <div className="container pt-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Volver</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/categorias">Categorías</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {category?.nombre}
            </li>
          </ol>
        </nav>

        <div className="card">
          <div className="card-body row">
            <div className="col-md-6">
              <ProductImage product={product} className="product-img" width="600" />
            </div>
            <div className="col-md-6">
              <div className="product-detail p-4">
                <h1 className="mb-3 h2">{product.nombre}</h1>
                <div className="mb-2">
                  <Rating value={product.rating} />
                </div>
                {product.plataformas && (
                  <div className="mb-3">
                    <PlatformBadges platforms={product.plataformas} labels />
                  </div>
                )}
                <div className="d-flex flex-column mb-3">
                  <span className="precio-descuento text-decoration-line-through">{hasOffer(product) ? formatPrice(product.precio_descuento) : <br />}</span>
                  <span className="precio-nuevo fw-bolder">
                    {isFree(product) ? 'FREE' : formatPrice(product.precio_nuevo)}
                    {discountPercent(product) > 0 && <span className="badge text-bg-danger ms-2 align-middle fs-6">-{discountPercent(product)}%</span>}
                  </span>
                </div>
                <p className="mb-2">{product.descripcion}</p>
                {product.detalle && <p className="text-secondary mb-4">{product.detalle}</p>}
                <ul className="mb-4">
                  <li>Categoría: {category?.nombre}</li>
                  {product.clasificacion && (
                    <li>
                      Clasificación: <span className="badge text-bg-dark">PEGI {product.clasificacion}</span>
                    </li>
                  )}
                  {product.anio && <li>Lanzamiento: {product.anio}</li>}
                  {product.desarrollador && <li>Desarrollador: {product.desarrollador}</li>}
                  <li>Disponibilidad: {isInStock(product) ? `Disponible (${product.stock} unidades)` : 'Agotado'}</li>
                  <li>Visitas al producto: {product.vistas ?? 0}</li>
                </ul>
                <div className="d-grid gap-2">
                  <AppButton label="Agregar al Carrito" variant="primary" className="btn-lg" disabled={!isInStock(product)} onClick={handleAdd} />
                  <WishlistButton product={product} label />
                </div>
                <div className="mt-3">
                  <StatusAlert status="error" message={error} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5" aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="h4 mb-3">
            También te puede gustar
          </h2>
          <ProductGrid products={relatedProducts(db.products, product, 4)} categories={db.categories} variant="add" cols="row-cols-2 row-cols-md-4 g-4" />
        </section>
      </div>
    </div>
  );
}
