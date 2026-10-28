// Gráfico Chart.js dentro de un componente React. Se destruye al desmontar para no dejar instancias huérfanas.
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function ChartCanvas({ type, data, options = {}, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(canvasRef.current, { type, data, options: { responsive: true, maintainAspectRatio: false, ...options } });
    return () => chart.destroy();
  }, [type, data, options]);

  return (
    <div style={{ height: '280px' }}>
      <canvas ref={canvasRef} role="img" aria-label={label} />
    </div>
  );
}
