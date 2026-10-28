// Boleta de compra (comprar-ok.html del template). Imprimir usa el diálogo del navegador ("Guardar como PDF").
// El envío por email es una SIMULACIÓN: no existe un servicio de correo configurado.
import { useState } from 'react';
import OrderLinesTable from '../cart/OrderLinesTable.jsx';
import OrderCustomerFields from './OrderCustomerFields.jsx';
import AppButton from '../common/AppButton.jsx';
import StatusAlert from '../common/StatusAlert.jsx';
import { formatDate, formatPrice } from '../../utils/money.js';

export default function OrderReceipt({ order, showEmailAction = true, title = 'Detalle de la compra' }) {
  const [emailStatus, setEmailStatus] = useState(null);

  const handleEmail = () => {
    setEmailStatus({
      status: 'warning',
      message: `Simulación: no hay un servicio de correo configurado, por lo que la boleta no se envió a ${order.customer.email}.`,
    });
  };

  return (
    <article aria-label="Boleta de compra">
      <p className="card-text text-secondary">
        {title} · Fecha: {formatDate(order.createdAt)} · Entrega: {order.delivery.label}
      </p>
      <OrderCustomerFields customer={order.customer} address={order.address} idPrefix={`orden-${order.id}`} />

      <h5 className="card-title">Detalle de la compra</h5>
      <OrderLinesTable lines={order.lines} />

      <dl className="row mt-2 mb-3 text-end">
        <dt className="col-8">Subtotal productos</dt>
        <dd className="col-4">{formatPrice(order.subtotal)}</dd>
        <dt className="col-8">Despacho</dt>
        <dd className="col-4">{formatPrice(order.deliveryCost)}</dd>
      </dl>

      <div className="text-center mb-3">
        <div className="card bg-white">
          <div className="card-body">
            <h4>
              Total pagado: <strong>{formatPrice(order.total)}</strong>
            </h4>
            <p className="small text-secondary">Boleta de demostración académica: no tiene validez tributaria.</p>
            <div className="text-center no-print d-flex flex-wrap justify-content-center gap-2">
              <AppButton label="Imprimir boleta en PDF" variant="danger" className="btn-sm" onClick={() => window.print()} />
              {showEmailAction && <AppButton label="Enviar boleta por email" variant="success" className="btn-sm" onClick={handleEmail} />}
            </div>
            <div className="no-print mt-3">
              <StatusAlert status={emailStatus?.status} message={emailStatus?.message} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
