// Tarjeta de indicador (dashboard-card del template). Los valores llegan calculados desde los datos.
import PropTypes from 'prop-types';

export default function StatCard({ title, value, detail, color = 'primary', icon, className = 'col-12 col-sm-6 col-xl-3' }) {
  return (
    <div className={`${className} mb-3`}>
      <div className={`card ${color === 'warning' ? 'text-dark' : 'text-white'} dashboard-card card-${color} h-100`}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="dashboard-icon">
              <i className={`bi ${icon}`} aria-hidden="true" />
            </div>
            <div className="ms-4">
              <h5 className="card-title">{title}</h5>
              <h3 className="card-text">{value}</h3>
            </div>
          </div>
          {detail && <p className="card-text text-center mt-3 mb-0">{detail}</p>}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  detail: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'info', 'danger']),
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};
