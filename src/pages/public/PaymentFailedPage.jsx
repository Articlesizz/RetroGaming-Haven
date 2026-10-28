// Pago fallido (comprar-error.html del template): mensaje, botón para reintentar, datos del cliente y detalle.
// El carrito y el borrador se conservaron; el reintento reutiliza el mismo intento (no duplica pedidos).
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import OrderLinesTable from '../../components/cart/OrderLinesTable.jsx';
import OrderCustomerFields from '../../components/checkout/OrderCustomerFields.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { readJson } from '../../data/storage.js';
import { buildCartDetails } from '../../utils/cart.js';
import { formatPrice } from '../../utils/money.js';
import { CHECKOUT_DRAFT_KEY } from './CheckoutPage.jsx';

export default function PaymentFailedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { db } = useStore();
  const { lines } = useCart();
  const failure = location.state;

  if (!failure) {
    return (
      <div className="container mt-5">
        <EmptyState title="No hay un intento de pago reciente" description="Vuelve al carrito para intentar la compra." actionLabel="Ir al carrito" actionTo="/carrito" />
      </div>
    );
  }

  const details = buildCartDetails(lines, db.products);
  const draft = readJson(CHECKOUT_DRAFT_KEY, {});
  const customer = { name: draft.name, lastName: draft.lastName, email: draft.email };
  const address = { street: draft.street, department: draft.department, region: draft.region ?? '', comuna: draft.comuna, notes: draft.notes };

  return (
    <section id="productos-comprados" className="py-3">
      <div className="container">
        <h3 className="card-title">
          <i className="bi bi-x-circle text-danger" aria-hidden="true" /> No se pudo realizar el pago. nro #{failure.attemptId}
        </h3>
        <StatusAlert status="error" message={failure.reason} />
        <p className="card-text">Detalle de compra</p>
        <div className="text-center mb-3">
          <button className="btn btn-success btn-lg" type="button" onClick={() => navigate('/comprar', { state: { attemptId: failure.attemptId } })}>
            VOLVER A REALIZAR EL PAGO
          </button>
          <p className="small text-secondary mt-2 mb-0">Tu carrito y tus datos se conservaron.</p>
        </div>

        <OrderCustomerFields customer={customer} address={address} idPrefix="error" />

        <h5 className="card-title">Detalle de la compra</h5>
        {details.length > 0 ? <OrderLinesTable lines={details} hover /> : <p className="text-secondary">El carrito está vacío.</p>}
        <div className="text-center mb-3 mt-3">
          <div className="card bg-white">
            <div className="card-body">
              {/* La captura del template dice "Total pagado", que contradice el fallo: se muestra el monto del pedido. */}
              <h4>
                Total a pagar: <strong>{formatPrice(failure.amount)}</strong>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
