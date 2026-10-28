// Detalle de una orden en el panel (ordenes/10001 y usuario/3312/historial/10009 del template).
import { Link } from 'react-router-dom';
import OrderReceipt from '../checkout/OrderReceipt.jsx';

export default function OrderDetailView({ order, backTo, backLabel }) {
  return (
    <div className="mt-4">
      <h4>
        <Link to={backTo} className="text-secondary me-2 decoration-none" aria-label={backLabel}>
          <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
        </Link>
        Orden de compra #{order.id}
      </h4>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">--&gt; Orden de compra. nro #{order.id}</h5>
          <p className="small text-secondary">Código de orden: {order.code}</p>
          <OrderReceipt order={order} title="Datos de la orden" showEmailAction={false} />
        </div>
      </div>
    </div>
  );
}
