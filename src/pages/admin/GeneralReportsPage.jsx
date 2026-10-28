// Reportes (admin/reporte/index.html del template): los 10 gráficos del template, calculados con los datos de la tienda.
import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import ChartGrid from '../../components/reports/ChartGrid.jsx';
import { generalCharts } from '../../utils/chartData.js';
import { formatPrice } from '../../utils/money.js';
import { dashboardStats } from '../../utils/reports.js';

export default function GeneralReportsPage() {
  const { db } = useStore();
  const charts = useMemo(() => generalCharts(db), [db]);
  const stats = dashboardStats(db);

  return (
    <div className="mt-4">
      <h4 className="card-title">Reportes</h4>
      <p className="card-text">
        Ventas pagadas: <strong>{formatPrice(stats.totalSales)}</strong> · Pedidos: {stats.totalOrders} · Usuarios: {stats.userCount}
      </p>
      <ChartGrid charts={charts} />
    </div>
  );
}
