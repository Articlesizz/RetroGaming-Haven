// Carrito (carrito.html del template): aviso con "Vistas", lista de productos a la izquierda y carrito a la derecha.
// Cambiar cantidades, eliminar con confirmación (modal), "Limpiar" y "Comprar ahora".
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import CartTable from '../../components/cart/CartTable.jsx';
import ProductPicker from '../../components/cart/ProductPicker.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { buildCartDetails, cartTotals } from '../../utils/cart.js';

export default function CartPage() {
  const { db } = useStore();
  const { lines, setQuantity, removeItem, clear } = useCart();
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [showNotice, setShowNotice] = useState(true);
  const details = buildCartDetails(lines, db.products);
  const totals = cartTotals(details);
  const lastOrder = db.orders[db.orders.length - 1];

  const changeQuantity = (productId, delta) => {
    const item = details.find((line) => line.productId === productId);
    if (!item) return;
    setQuantity(productId, Math.min(Math.max(item.quantity + delta, 1), item.stock));
  };

  return (
    <section id="productos" className="py-4">
      <div className="container">
        {showNotice && (
          <div className="alert alert-primary alert-dismissible fade show" role="alert">
            <strong>¡Vista Carrito de compra!</strong> Esta vista fue diseñada para aprender y demostrar la implementación del carrito de compra con React.
            <div className="btn-group dropup ms-2">
              <button type="button" className="btn btn-secondary">
                Vistas
              </button>
              <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#product-list">
                  1.- Lista de productos
                </a>
                <Link className="dropdown-item" to="/comprar">
                  2.- Detalles de la compra
                </Link>
                {lastOrder ? (
                  <Link className="dropdown-item" to={`/comprar-ok/${lastOrder.id}`}>
                    3.- Final del pago
                  </Link>
                ) : (
                  <span className="dropdown-item disabled">3.- Final del pago</span>
                )}
              </div>
            </div>
            <br />
            <small>
              La información es almacenada en <strong>Localstorage</strong>
            </small>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowNotice(false)} />
          </div>
        )}

        <div className="row mt-4 g-4">
          <div className="col-lg-6">
            <h2 className="text-start mb-4">Lista de productos</h2>
            <ProductPicker products={db.products} categories={db.categories} />
          </div>
          <div className="col-lg-6">
            <h2>Carrito de Compras</h2>
            {details.length === 0 ? (
              <EmptyState title="Tu carrito está vacío" description="Agrega productos desde la lista para continuar." />
            ) : (
              <>
                <CartTable
                  items={details}
                  total={totals.subtotal}
                  onIncrement={(productId) => changeQuantity(productId, 1)}
                  onDecrement={(productId) => changeQuantity(productId, -1)}
                  onRemove={setPendingRemoval}
                />
                <div className="text-end">
                  <button id="purchase-button" className="btn btn-secondary btn-lg me-1" type="button" onClick={clear}>
                    Limpiar
                  </button>
                  <Link className="btn btn-success btn-lg" to="/comprar">
                    Comprar ahora
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={pendingRemoval !== null}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto del carrito?"
        onConfirm={() => {
          removeItem(pendingRemoval);
          setPendingRemoval(null);
        }}
        onCancel={() => setPendingRemoval(null)}
      />
    </section>
  );
}
