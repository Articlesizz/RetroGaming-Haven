// Usuarios (admin/usuario del template): listado, personajes (APIs públicas), nuevo, perfil con estadísticas, editar e historial.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import AdminTabs from '../../components/admin/AdminTabs.jsx';
import FilterBar from '../../components/admin/FilterBar.jsx';
import OrderDetailView from '../../components/admin/OrderDetailView.jsx';
import OrdersTable from '../../components/admin/OrdersTable.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import UsersTable, { ROLE_BADGES } from '../../components/admin/UsersTable.jsx';
import UserForm from '../../components/forms/UserForm.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { fetchCharacterUsers } from '../../services/characterService.js';
import { formatPrice } from '../../utils/money.js';
import { placeholderImage } from '../../utils/placeholder.js';
import { filterUsers, purchaseHistory, userStats } from '../../utils/reports.js';

const LIST_TABS = [
  { to: '/admin/usuario', label: 'Listado de usuarios' },
  { to: '/admin/usuario/personajes', label: 'Listado personajes' },
  { to: '/admin/usuario/nuevo', label: 'Nuevo usuario' },
];

function UserTabs({ user }) {
  return (
    <AdminTabs
      tabs={[
        { to: `/admin/usuario/${user.id}`, label: `#${user.id.replace(/^u-/, '')} - ${user.name} ${user.lastName}`.trim() },
        { to: `/admin/usuario/${user.id}/historial`, label: 'Historial de compras', end: false },
      ]}
    />
  );
}

function UserHeader({ user, title = 'Perfil usuario' }) {
  return (
    <h4>
      <Link to="/admin/usuario" className="text-secondary me-2 decoration-none" aria-label="Volver a usuarios">
        <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
      </Link>
      {title} #{user.id.replace(/^u-/, '')} - <strong>{`${user.name} ${user.lastName}`.trim()}</strong>
    </h4>
  );
}

export function UsersPage() {
  const { db, deleteUser } = useStore();
  const { user: currentUser } = useSession();
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const users = filterUsers(db.users, { query, role });

  const handleDelete = (id) => {
    const result = deleteUser(id);
    setMessage(result.ok ? { status: 'success', message: 'Usuario eliminado.' } : { status: 'error', message: result.error });
  };

  return (
    <div className="mt-4">
      <h4 className="card-title">Usuarios</h4>
      <p className="card-text">Listado de usuarios</p>
      <AdminTabs tabs={LIST_TABS} />
      <StatusAlert status={message?.status} message={message?.message} />
      <FilterBar
        label="Filtros de usuarios"
        total={db.users.length}
        shown={users.length}
        onClear={() => {
          setQuery('');
          setRole('');
        }}
        fields={[
          { id: 'admin-buscar-usuario', label: 'Buscar', type: 'search', placeholder: 'Nombre, correo o RUN', value: query, onChange: setQuery, className: 'col-12 col-md-5' },
          { id: 'admin-filtro-tipo', label: 'Tipo de usuario', type: 'select', value: role, onChange: setRole, options: [{ value: '', label: 'Todos' }, { value: 'admin', label: 'Administrador' }, { value: 'vendedor', label: 'Vendedor' }, { value: 'cliente', label: 'Cliente' }] },
        ]}
      />
      <UsersTable users={users} currentUserId={currentUser?.id} onDelete={handleDelete} />
    </div>
  );
}

export function CharactersPage() {
  const [state, setState] = useState({ loading: true, users: [], errors: [] });

  useEffect(() => {
    const controller = new AbortController();
    fetchCharacterUsers({ signal: controller.signal })
      .then((result) => setState({ loading: false, ...result }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ loading: false, users: [], errors: ['las APIs públicas'] });
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="mt-4">
      <h4 className="card-title">Usuarios</h4>
      <p className="card-text">Personajes obtenidos de APIs públicas (Rick and Morty y PokéAPI), con formato de usuario</p>
      <AdminTabs tabs={LIST_TABS} />
      {state.loading && (
        <div className="d-flex align-items-center gap-2 mb-3" role="status">
          <div className="spinner-border spinner-border-sm" aria-hidden="true" /> Cargando personajes…
        </div>
      )}
      <StatusAlert status="warning" message={state.errors.length > 0 ? `No se pudo cargar: ${state.errors.join(', ')}. Revisa tu conexión a internet.` : ''} />
      {!state.loading && state.users.length > 0 && <UsersTable users={state.users} readOnly />}
    </div>
  );
}

export function UserCreatePage() {
  const { createUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const result = createUser(values);
    if (result.ok) navigate(`/admin/usuario/${result.record.id}`);
    return result;
  };

  return (
    <div className="mt-4">
      <h4>Nuevo usuario</h4>
      <AdminTabs tabs={LIST_TABS} />
      <div className="card">
        <div className="card-body">
          <UserForm creating onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}

export function UserShowPage() {
  const { id } = useParams();
  const { db } = useStore();
  const user = db.users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="mt-4">
        <EmptyState title="Usuario no encontrado" actionLabel="Volver a usuarios" actionTo="/admin/usuario" />
      </div>
    );
  }

  const stats = userStats(db.orders, user.id);
  const badge = ROLE_BADGES[user.role];

  return (
    <div className="mt-4">
      <UserHeader user={user} />
      <UserTabs user={user} />
      <div className="card">
        <div className="card-body row">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="row g-0 mb-3">
                <div className="col-4 d-flex align-items-center justify-content-center">
                  <img src={user.imagen ?? placeholderImage(80, 80, 'Avatar')} alt={`Avatar de ${user.name}`} className="avatar rounded-pill" />
                </div>
                <div className="col-8">
                  <div className="card-body">
                    <h5 className="card-title">{`${user.name} ${user.lastName}`.trim()}</h5>
                    <p className="card-text">{user.email}</p>
                    <h6>
                      <span className={`badge ${badge?.className ?? 'bg-secondary'}`}>{badge?.label ?? user.role}</span>
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="d-grid gap-2 mx-4">
                    <Link className="btn btn-secondary" to={`/admin/usuario/${user.id}/editar`}>
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              <StatCard title="Compras mes" value={stats.monthPurchases} detail={`Mes anterior ${stats.previousMonthPurchases} compras`} color="success" icon="bi-basket-fill" className="col-12 col-sm-6" />
              <StatCard title="Compras realizadas" value={stats.totalPurchases} detail={`Este año ${stats.yearPurchases} compras`} color="success" icon="bi-cart-check" className="col-12 col-sm-6" />
              <StatCard title="Monto recaudado" value={formatPrice(stats.monthAmount)} detail="Compras de este mes" color="primary" icon="bi-cart-fill" className="col-12 col-sm-6" />
              <StatCard title="Monto total recaudado" value={formatPrice(stats.totalAmount)} detail="Todas las compras" color="primary" icon="bi-cart-fill" className="col-12 col-sm-6" />
            </div>
          </div>
        </div>
        <div className="card-body border-top">
          <dl className="row mb-0 small">
            <dt className="col-sm-3">RUN</dt>
            <dd className="col-sm-9">{user.run}</dd>
            <dt className="col-sm-3">Fecha de nacimiento</dt>
            <dd className="col-sm-9">{user.birthDate}</dd>
            <dt className="col-sm-3">Teléfono</dt>
            <dd className="col-sm-9">{user.phone || 'Sin dato'}</dd>
            <dt className="col-sm-3">Dirección</dt>
            <dd className="col-sm-9">{[user.street, user.department, user.comuna, user.region].filter(Boolean).join(', ') || 'Sin dato'}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function UserEditPage() {
  const { id } = useParams();
  const { db, updateUser } = useStore();
  const navigate = useNavigate();
  const user = db.users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="mt-4">
        <EmptyState title="Usuario no encontrado" actionLabel="Volver a usuarios" actionTo="/admin/usuario" />
      </div>
    );
  }

  const handleSubmit = (values) => {
    const result = updateUser(user.id, values);
    if (result.ok) navigate(`/admin/usuario/${user.id}`);
    return result;
  };

  return (
    <div className="mt-4">
      <h4>
        <Link to={`/admin/usuario/${user.id}`} className="text-secondary me-2 decoration-none" aria-label="Volver al perfil">
          <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
        </Link>
        Editar usuario
      </h4>
      <div className="card">
        <div className="card-body">
          <UserForm key={user.id} user={user} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}

export function PurchaseHistoryPage() {
  const { id } = useParams();
  const { db } = useStore();
  const user = db.users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="mt-4">
        <EmptyState title="Usuario no encontrado" actionLabel="Volver a usuarios" actionTo="/admin/usuario" />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <UserHeader user={user} />
      <UserTabs user={user} />
      <OrdersTable orders={purchaseHistory(db.orders, user.id)} history detailPath={(order) => `/admin/usuario/${user.id}/historial/${order.id}`} />
    </div>
  );
}

export function UserOrderDetailPage() {
  const { id, orderId } = useParams();
  const { db } = useStore();
  const order = db.orders.find((item) => item.id === orderId && item.customerId === id);

  if (!order) {
    return (
      <div className="mt-4">
        <EmptyState title="Orden no encontrada" actionLabel="Volver al historial" actionTo={`/admin/usuario/${id}/historial`} />
      </div>
    );
  }
  return <OrderDetailView order={order} backTo={`/admin/usuario/${id}/historial`} backLabel="Volver al historial" />;
}
