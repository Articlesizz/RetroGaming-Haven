// Cuadrícula de gráficos: cada elemento de charts es { id, title, type, data, options } (ver utils/chartData.js).
import ChartCanvas from './ChartCanvas.jsx';

export default function ChartGrid({ charts, columns = 'col-12 col-xl-6' }) {
  return (
    <div className="row g-4">
      {charts.map((chart) => (
        <div className={columns} key={chart.id}>
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="h6 mb-3">{chart.title}</h4>
              <ChartCanvas type={chart.type} data={chart.data} options={chart.options} label={chart.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
