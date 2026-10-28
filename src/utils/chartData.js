// Configuración de los gráficos de reportes (admin/reporte y admin/producto/reporte del template).
// Los datos de ejemplo del template se reemplazan por cálculos sobre los datos de la tienda.
import { customerSegments, salesByCategoryAndMonth, salesByMonth, salesByProduct, stockValueByCategory, unitsByCategory, usersGrowth } from './reports.js';

const PALETTE = [
  [54, 162, 235],
  [255, 99, 132],
  [255, 206, 86],
  [75, 192, 192],
  [153, 102, 255],
  [255, 159, 64],
  [25, 135, 84],
  [108, 117, 125],
  [13, 110, 253],
  [214, 51, 132],
];

export const color = (index, alpha = 0.5) => {
  const [r, g, b] = PALETTE[index % PALETTE.length];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const colors = (count, alpha = 0.5) => Array.from({ length: count }, (_, index) => color(index, alpha));

const monthLabels = (rows) => rows.map((row) => row.month);

// Los 10 gráficos de reportes generales, en el mismo orden y con los mismos tipos que el template.
export function generalCharts(db) {
  const months = salesByMonth(db.orders);
  const growth = usersGrowth(db.users);
  const stock = stockValueByCategory(db);
  const segments = customerSegments(db);
  const stacked = salesByCategoryAndMonth(db);

  return [
    {
      id: 'bar',
      title: '1. Gráfico de Barras: Ventas Mensuales',
      type: 'bar',
      data: { labels: monthLabels(months), datasets: [{ label: 'Ventas (CLP)', data: months.map((row) => row.total), backgroundColor: color(0), borderColor: color(0, 1), borderWidth: 1 }] },
      options: { scales: { y: { beginAtZero: true } } },
    },
    {
      id: 'line',
      title: '2. Gráfico de Líneas: Crecimiento de Usuarios',
      type: 'line',
      data: { labels: growth.labels, datasets: [{ label: 'Usuarios acumulados', data: growth.values, fill: false, borderColor: color(3, 1), tension: 0.1 }] },
      options: {},
    },
    {
      id: 'pie',
      title: '3. Gráfico Circular: Distribución de Productos',
      type: 'pie',
      data: { labels: stock.map((row) => row.nombre), datasets: [{ data: stock.map((row) => row.products), backgroundColor: colors(stock.length), borderColor: colors(stock.length, 1), borderWidth: 1 }] },
      options: {},
    },
    {
      id: 'radar',
      title: '4. Gráfico de Radar: Popularidad por Categoría',
      type: 'radar',
      data: { labels: stock.map((row) => row.nombre), datasets: [{ label: 'Visitas', data: stock.map((row) => row.views), backgroundColor: color(4, 0.2), borderColor: color(4, 1), borderWidth: 1 }] },
      options: {},
    },
    {
      id: 'doughnut',
      title: '5. Gráfico de Donut: Segmentación de Clientes',
      type: 'doughnut',
      data: {
        labels: ['Clientes nuevos (1 compra)', 'Clientes recurrentes (2 o más)', 'Clientes sin compras'],
        datasets: [{ data: [segments.nuevos, segments.recurrentes, segments.sinCompras], backgroundColor: colors(3), borderColor: colors(3, 1), borderWidth: 1 }],
      },
      options: {},
    },
    {
      id: 'polar',
      title: '6. Gráfico de Polar Area: Stock por Categoría',
      type: 'polarArea',
      data: { labels: stock.map((row) => row.nombre), datasets: [{ data: stock.map((row) => row.units), backgroundColor: colors(stock.length), borderColor: colors(stock.length, 1), borderWidth: 1 }] },
      options: {},
    },
    {
      id: 'scatter',
      title: '7. Gráfico de Dispersión: Precio vs Stock',
      type: 'scatter',
      data: { datasets: [{ label: 'Productos', data: db.products.map((product) => ({ x: product.precio_nuevo, y: product.stock })), backgroundColor: color(0), borderColor: color(0, 1) }] },
      options: { scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Precio' } }, y: { title: { display: true, text: 'Stock' } } } },
    },
    {
      id: 'bubble',
      title: '8. Gráfico de Burbujas: Precio, Visitas y Stock',
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Productos (radio = stock)',
            data: db.products.map((product) => ({ x: product.precio_nuevo, y: product.vistas ?? 0, r: Math.max(4, Math.min(24, Math.round(product.stock / 2))) })),
            backgroundColor: color(1),
            borderColor: color(1, 1),
          },
        ],
      },
      options: { scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Precio' } }, y: { title: { display: true, text: 'Visitas' } } } },
    },
    {
      id: 'stacked-bar',
      title: '9. Gráfico de Barras Apiladas: Ventas por Categoría',
      type: 'bar',
      data: {
        labels: stacked.months,
        datasets: stacked.series.map((serie, index) => ({ label: serie.nombre, data: serie.data, backgroundColor: color(index), borderColor: color(index, 1) })),
      },
      options: { plugins: { title: { display: true, text: 'Ventas mensuales por categoría' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } },
    },
    {
      id: 'stacked-line',
      title: '10. Gráfico de Línea Apilada: Ingresos y Unidades',
      type: 'line',
      data: {
        labels: monthLabels(months),
        datasets: [
          { label: 'Ingresos (CLP)', data: months.map((row) => row.total), borderColor: color(6, 1), backgroundColor: color(6, 0.3), fill: true, yAxisID: 'y' },
          { label: 'Unidades vendidas', data: months.map((row) => row.units), borderColor: color(1, 1), backgroundColor: color(1, 0.3), fill: true, yAxisID: 'y1' },
        ],
      },
      options: { scales: { y: { stacked: false, beginAtZero: true, position: 'left' }, y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } } } },
    },
  ];
}

// Los 4 gráficos de admin/producto/reporte.
export function productCharts(db) {
  const topProducts = salesByProduct(db.orders).slice(0, 8);
  const months = salesByMonth(db.orders);
  const sold = unitsByCategory(db).filter((row) => row.units > 0);
  const viewed = [...db.products].sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0)).slice(0, 6);

  return [
    {
      id: 'ventas-productos',
      title: '1. Gráfico de Barras: Ventas de Productos',
      type: 'bar',
      data: { labels: topProducts.map((row) => row.nombre), datasets: [{ label: 'Unidades vendidas', data: topProducts.map((row) => row.units), backgroundColor: color(0), borderColor: color(0, 1), borderWidth: 1 }] },
      options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
    },
    {
      id: 'tendencia',
      title: '2. Gráfico de Líneas: Tendencias de Ventas Mensuales',
      type: 'line',
      data: { labels: monthLabels(months), datasets: [{ label: 'Ventas (CLP)', data: months.map((row) => row.total), borderColor: color(3, 1), fill: false, tension: 0.1 }] },
      options: {},
    },
    {
      id: 'categorias-vendidas',
      title: '3. Gráfico Circular: Distribución de Categorías de Juegos Vendidos',
      type: 'pie',
      data: { labels: sold.map((row) => row.nombre), datasets: [{ data: sold.map((row) => row.units), backgroundColor: colors(sold.length), borderColor: colors(sold.length, 1), borderWidth: 1 }] },
      options: {},
    },
    {
      id: 'popularidad',
      title: '4. Gráfico de Radar: Popularidad de Juegos',
      type: 'radar',
      data: { labels: viewed.map((product) => product.nombre), datasets: [{ label: 'Visitas', data: viewed.map((product) => product.vistas ?? 0), backgroundColor: color(4, 0.2), borderColor: color(4, 1), borderWidth: 1 }] },
      options: {},
    },
  ];
}
