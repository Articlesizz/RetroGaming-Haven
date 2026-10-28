// "Ver Perfil" e "Historial" del menú móvil del template: perfil del cliente con sesión y su historial de compras.
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import UserForm from '../../components/forms/UserForm.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { formatDate, formatPrice } from '../../utils/money.js';
import { placeholderImage } from '../../utils/placeholder.js';
import { purchaseHistory } from '../../utils/reports.js';

export default function MyAccountPage() {
  const { db, updateUser } = useStore();
  const { user } = useSession();
  const [message, setMessage] = useState(null);

  if (!user) return <Navigate to="/iniciar-sesion" replace state={{ from: '/mi-cuenta' }} />;

  const orders = purchaseHistory(db.orders, user.id);

  const handleSubmit = (values) => {
    const result = updateUser(user.id, { ...values, role: user.role });
    if (result.ok) setMessage({ status: 'success', message: 'Datos actualizados.' });
    return result;
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="card mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-4 col-md-2 text-center p-3">
            <img src={user.imagen ?? placeholderImage(80, 80, 'Avatar')} alt={`Avatar de ${user.name}`} className="avatar rounded-pill" />
          </div>
          <div className="col-8 col-md-10">
            <div className="card-body">
              <h4 className="card-title mb-1">
                {user.name} {user.lastName}
              </h4>
              <p className="card-text mb-0">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 id="historial" className="h4 mb-3">
        Historial de compras
      </h2>
      {orders.length === 0 ? (
        <p className="text-secondary">Aún no tienes compras.</p>
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Monto Final</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.code}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <Link className="btn btn-primary btn-sm" to={`/comprar-ok/${order.id}`}>
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="h4 mb-3">Mis datos</h2>
      <StatusAlert status={message?.status} message={message?.message} />
      <div className="card">
        <div className="card-body">
          <UserForm key={user.id} user={user} allowRoleChange={false} showPassword={false} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}
