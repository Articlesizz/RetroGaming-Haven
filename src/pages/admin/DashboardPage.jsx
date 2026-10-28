// Dashboard (admin/index.html del template): indicadores calculados desde los datos, ventas por mes, más vendidos,
// alertas de stock crítico, últimas órdenes y accesos rápidos. Nada de esto son cifras fijas.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import ChartCanvas from '../../components/reports/ChartCanvas.jsx';
import { color } from '../../utils/chartData.js';
import { dashboardOverview, dashboardStats, salesByMonth } from '../../utils/reports.js';
import { formatDateTime, formatPrice } from '../../utils/money.js';

const QUICK_ACTIONS = [
  { to: '/admin/producto/nuevo', label: 'Nuevo producto', icon: 'bi-plus-circle', className: 'btn-primary' },
  { to: '/admin/categoria/nuevo', label: 'Nueva categoría', icon: 'bi-tag', className: 'btn-outline-primary' },
  { to: '/admin/usuario/nuevo', label: 'Nuevo usuario', icon: 'bi-person-plus', className: 'btn-outline-primary' },
  { to: '/admin/reporte', label: 'Ver reportes', icon: 'bi-graph-up-arrow', className: 'btn-outline-secondary' },
];

const monthLabel = (key) => {
  const [year, month] = key.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('es-CL', { month: 'short', year: '2-digit' });
};

export default function DashboardPage() {
  const { db } = useStore();
  const { user } = useSession();
  const stats = dashboardStats(db);
  const overview = dashboardOverview(db);

  const monthly = useMemo(() => salesByMonth(db.orders).slice(-6), [db.orders]);
  const salesChart = useMemo(
    () => ({
      labels: monthly.map((item) => monthLabel(item.month)),
      datasets: [{ label: 'Ventas pagadas (CLP)', data: monthly.map((item) => item.total), backgroundColor: color(0, 0.6), borderColor: color(0, 1), borderWidth: 1, borderRadius: 6 }],
    }),
    [monthly],
  );
  const topChart = useMemo(
    () => ({
      labels: overview.topProducts.map((item) => item.nombre),
      datasets: [{ label: 'Unidades vendidas', data: overview.topProducts.map((item) => item.units), backgroundColor: overview.topProducts.map((_, index) => color(index + 1, 0.6)) }],
    }),
    // overview se recalcula en cada render: se depende del contenido para no recrear el gráfico.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db.orders],
  );
  const barOptions = useMemo(() => ({ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }), []);
  const hBarOptions = useMemo(() => ({ indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }), []);

  return (
    <div className="mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h4 className="card-title">Hola, {user?.name ?? 'administrador'} 👋</h4>
          <p className="card-text">Resumen de la tienda al día de hoy</p>
        </div>
        <div className="d-flex flex-wrap gap-2" role="group" aria-label="Acciones rápidas">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.to} to={action.to} className={`btn btn-sm ${action.className}`}>
              <i className={`bi ${action.icon}`} aria-hidden="true" /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="row">
        <StatCard title="Ventas del mes" value={formatPrice(overview.monthSales)} detail={`${overview.monthOrders} compra(s) pagada(s) este mes`} color="primary" icon="bi-cash-coin" className="col-12 col-md-6 col-xl-3" />
        <StatCard title="Compras" value={stats.totalOrders} detail={`Ventas pagadas: ${formatPrice(stats.totalSales)} · ticket promedio ${formatPrice(overview.averageTicket)}`} color="success" icon="bi-cart-fill" className="col-12 col-md-6 col-xl-3" />
        <StatCard title="Productos" value={stats.productCount} detail={`Inventario actual: ${stats.totalStock} unidades`} color="info" icon="bi-controller" className="col-12 col-md-6 col-xl-3" />
        <StatCard title="Stock crítico" value={stats.criticalCount} detail="Productos en o bajo su stock crítico" color="danger" icon="bi-exclamation-triangle-fill" className="col-12 col-md-6 col-xl-3" />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="h6 mb-3">Ventas por mes (últimos 6 meses)</h5>
              {monthly.length === 0 ? <p className="text-secondary mb-0">Aún no hay ventas pagadas.</p> : <ChartCanvas type="bar" data={salesChart} options={barOptions} label="Ventas pagadas por mes" />}
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="h6 mb-3">Juegos más vendidos</h5>
              {overview.topProducts.length === 0 ? <p className="text-secondary mb-0">Aún no hay ventas pagadas.</p> : <ChartCanvas type="bar" data={topChart} options={hBarOptions} label="Unidades vendidas por juego" />}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="h6 mb-0">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-1" aria-hidden="true" />
                  Alertas de stock
                </h5>
                <Link to="/admin/producto/criticos" className="small">
                  Ver todos
                </Link>
              </div>
              {overview.stockAlerts.length === 0 ? (
                <p className="text-success mb-0">
                  <i className="bi bi-check-circle-fill" aria-hidden="true" /> Todo el inventario está sobre su stock crítico.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {overview.stockAlerts.map((product) => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span>
                        {product.nombre}
                        <br />
                        <small className={product.stock === 0 ? 'text-danger fw-bold' : 'text-secondary'}>{product.stock === 0 ? 'AGOTADO' : `Quedan ${product.stock} (crítico: ${product.stock_critico})`}</small>
                      </span>
                      <Link to={`/admin/producto/${product.id}/editar`} className="btn btn-outline-primary btn-sm">
                        Reponer
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="h6 mb-0">Últimas órdenes</h5>
                <Link to="/admin/ordenes" className="small">
                  Ver todas
                </Link>
              </div>
              {overview.recentOrders.length === 0 ? (
                <p className="text-secondary mb-0">Aún no hay compras registradas.</p>
              ) : (
                <div className="table-responsive small">
                  <table className="table table-sm table-hover align-middle mb-0">
                    <caption className="visually-hidden">Últimas órdenes</caption>
                    <thead>
                      <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Monto</th>
                        <th scope="col">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <Link to={`/admin/ordenes/${order.id}`}>{order.code}</Link>
                          </td>
                          <td>{formatDateTime(order.createdAt)}</td>
                          <td>{formatPrice(order.total)}</td>
                          <td>
                            <span className={`badge ${order.status === 'pagado' ? 'text-bg-success' : 'text-bg-secondary'}`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
