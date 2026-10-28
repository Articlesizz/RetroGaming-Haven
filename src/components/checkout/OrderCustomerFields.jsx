// Datos del cliente y dirección en campos de solo lectura (como comprar-ok.html, comprar-error.html y el detalle de orden del admin).
import { REGION_NAMES } from '../../utils/geo.js';

function ReadOnlyField({ id, label, value, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input type="text" className="form-control" id={id} value={value ?? ''} readOnly disabled />
    </div>
  );
}

export default function OrderCustomerFields({ customer, address, idPrefix = 'orden' }) {
  const regionKnown = REGION_NAMES.includes(address.region);
  return (
    <>
      <div className="row">
        <ReadOnlyField id={`${idPrefix}-nombre`} label="Nombre" value={customer.name} className="col-6 mb-3 col-md-4" />
        <ReadOnlyField id={`${idPrefix}-apellidos`} label="Apellidos" value={customer.lastName} className="col-6 mb-3 col-md-4" />
        <ReadOnlyField id={`${idPrefix}-correo`} label="Correo" value={customer.email} className="mb-3 col-12 col-md-4" />
      </div>
      <h5 className="card-title">Dirección de entrega de los productos</h5>
      <div className="row">
        <ReadOnlyField id={`${idPrefix}-calle`} label="Calle" value={address.street} className="mb-3 col-12 col-md-6" />
        <ReadOnlyField id={`${idPrefix}-depto`} label="Departamento" value={address.department} className="mb-3 col-12 col-md-6" />
        <ReadOnlyField id={`${idPrefix}-region`} label="Región" value={regionKnown ? address.region : `${address.region} (región no listada)`} className="mb-3 col-12 col-md-6" />
        <ReadOnlyField id={`${idPrefix}-comuna`} label="Comuna" value={address.comuna} className="mb-3 col-12 col-md-6" />
        <div className="mb-3">
          <label htmlFor={`${idPrefix}-indicaciones`} className="form-label">
            Indicaciones para la entrega
          </label>
          <textarea className="form-control" id={`${idPrefix}-indicaciones`} rows={3} value={address.notes ?? ''} readOnly disabled />
        </div>
      </div>
    </>
  );
}
