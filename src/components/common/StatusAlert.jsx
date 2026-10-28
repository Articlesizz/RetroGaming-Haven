// Mensaje de estado. Distingue éxito, error, advertencia e información con color e icono.
// No renderiza nada si no hay mensaje (renderizado condicional).
import PropTypes from 'prop-types';
const ALERT_CLASS = { success: 'success', error: 'danger', warning: 'warning', info: 'info' };
const ICONS = { success: '✔', error: '✖', warning: '⚠', info: 'ℹ' };

export default function StatusAlert({ status = 'info', message }) {
  if (!message) return null;
  return (
    <div
      className={`alert alert-${ALERT_CLASS[status] ?? 'info'} d-flex gap-2 align-items-start`}
      role={status === 'error' ? 'alert' : 'status'}
    >
      <span aria-hidden="true">{ICONS[status] ?? ICONS.info}</span>
      <span>{message}</span>
    </div>
  );
}

StatusAlert.propTypes = {
  status: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  message: PropTypes.string,
};
