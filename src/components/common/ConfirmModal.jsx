// Modal de confirmación con el markup de Bootstrap del template ("Confirmar Eliminación").
// Está abierto solo si open es true; no usa JS de Bootstrap, así que es controlado por React.
import PropTypes from 'prop-types';
import AppButton from './AppButton.jsx';

export default function ConfirmModal({ open, title = 'Confirmar eliminación', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmModalTitle">
                {title}
              </h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancel} />
            </div>
            <div className="modal-body">{message}</div>
            <div className="modal-footer">
              <AppButton label="Cancelar" variant="secondary" onClick={onCancel} />
              <AppButton label="Eliminar" variant="danger" onClick={onConfirm} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
