// Compra exitosa (comprar-ok.html del template): código de orden, número de compra, datos, productos, total y boleta.
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import OrderReceipt from '../../components/checkout/OrderReceipt.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const { db } = useStore();
  const order = db.orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <div className="container mt-5">
        <EmptyState title="Compra no encontrada" description="Revisa el identificador de compra o vuelve a la tienda." actionLabel="Volver a la tienda" actionTo="/" />
      </div>
    );
  }

  return (
    <section id="productos-comprados" className="py-3">
      <div className="container">
        <div className="text-end">
          <small>Código orden: {order.code}</small>
        </div>
        <h3 className="card-title">
          <i className="bi bi-check-circle text-success" aria-hidden="true" /> Se ha realizado la compra. nro #{order.id}
        </h3>
        <p className="mb-3">
          <Link to="/productos">Seguir comprando</Link>
        </p>
        <OrderReceipt order={order} />
      </div>
    </section>
  );
}
