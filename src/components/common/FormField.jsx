// Campo de formulario con etiqueta asociada, marca de obligatorio y mensaje de error accesible.
import PropTypes from 'prop-types';

export default function FormField({ id, label, error, required = false, className = 'col-12 col-md-6', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {children}
      {error && (
        <div className="invalid-feedback d-block" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
