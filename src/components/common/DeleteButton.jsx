// Botón de eliminación con confirmación previa (window.confirm). Solo ejecuta onConfirm si el usuario acepta.
import PropTypes from 'prop-types';
import AppButton from './AppButton.jsx';

export default function DeleteButton({
  onConfirm,
  message = '¿Eliminar este registro? Esta acción no se puede deshacer.',
  label = 'Eliminar',
  disabled = false,
}) {
  const handleClick = () => {
    if (window.confirm(message)) onConfirm();
  };
  return <AppButton label={label} variant="outline-danger" className="btn-sm" onClick={handleClick} disabled={disabled} />;
}

DeleteButton.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
