// Tabla de órdenes (ordenes/index.html) o del historial de un usuario (historial.html, con Región y Comuna).
import { Link } from 'react-router-dom';
import { formatDateTime, formatPrice } from '../../utils/money.js';

export default function OrdersTable({ orders, detailPath = (order) => `/admin/ordenes/${order.id}`, history = false }) {
  if (orders.length === 0) return <p className="text-secondary">Aún no hay compras registradas.</p>;

  return (
    <div className="card text-start">
      <div className="card-body">
        <div className="table-responsive small">
          <table className="table table-sm table-hover align-middle">
            <caption className="visually-hidden">{history ? 'Historial de compras' : 'Listado de órdenes y boletas'}</caption>
            <thead>
              <tr>
                <th>ID de Orden</th>
                <th>Código</th>
                <th>Fecha y Hora</th>
                <th>Monto Final</th>
                {history ? <th>Región, Comuna</th> : <th>Comuna</th>}
                {!history && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <Link to={detailPath(order)}>{order.code}</Link>
                  </td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{history ? `${order.address.region}, ${order.address.comuna}` : order.address.comuna}</td>
                  {!history && (
                    <td>
                      <Link className="btn btn-primary btn-sm" to={detailPath(order)}>
                        DETALLES
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
