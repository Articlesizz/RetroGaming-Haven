// Botón reutilizable de Bootstrap: recibe la etiqueta, la variante visual y el callback onClick.
import PropTypes from 'prop-types';

export default function AppButton({ label, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

AppButton.propTypes = {
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
