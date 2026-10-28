// Formulario de compra (comprar.html del template): datos del cliente, dirección, entrega y pago con importe.
// Es controlado: la página guarda los valores y recibe cada cambio por onFieldChange.
import FormField from '../common/FormField.jsx';
import { REGION_NAMES, comunasDeRegion } from '../../utils/geo.js';
import { DELIVERY_OPTIONS } from '../../services/orderService.js';
import { PAYMENT_SCENARIOS } from '../../services/paymentSimulator.js';
import { formatPrice } from '../../utils/money.js';

export default function CheckoutForm({ form, errors, onFieldChange, onSubmit, scenario, onScenarioChange, total }) {
  const comunas = comunasDeRegion(form.region);

  const control = (name) => ({
    id: `checkout-${name}`,
    name,
    value: form[name] ?? '',
    onChange: (event) => onFieldChange(name, event.target.value),
    className: `form-control${errors[name] ? ' is-invalid' : ''}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `checkout-${name}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Datos de compra y pago">
      <fieldset className="mb-4">
        <legend className="h5">Detalles del usuario</legend>
        <div className="row g-3">
          <FormField id="checkout-name" label="Nombre" error={errors.name} required className="col-12 col-md-4">
            <input type="text" autoComplete="given-name" {...control('name')} />
          </FormField>
          <FormField id="checkout-lastName" label="Apellidos" error={errors.lastName} required className="col-12 col-md-4">
            <input type="text" autoComplete="family-name" {...control('lastName')} />
          </FormField>
          <FormField id="checkout-email" label="Correo" error={errors.email} required className="col-12 col-md-4">
            <input type="email" autoComplete="email" {...control('email')} />
          </FormField>
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h5">Dirección de entrega de los productos</legend>
        <div className="row g-3">
          <FormField id="checkout-street" label="Calle" error={errors.street} required className="col-12 col-md-6">
            <input type="text" autoComplete="address-line1" placeholder="Ej: Los Crisantemos 603" {...control('street')} />
          </FormField>
          <FormField id="checkout-department" label="Departamento (opcional)" error={errors.department} className="col-12 col-md-6">
            <input type="text" autoComplete="address-line2" placeholder="Ej: Depto 603" {...control('department')} />
          </FormField>
          <FormField id="checkout-region" label="Región" error={errors.region} required className="col-12 col-md-6">
            <select {...control('region')} onChange={(event) => onFieldChange('region', event.target.value)}>
              <option value="">Seleccione una región</option>
              {REGION_NAMES.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="checkout-comuna" label="Comuna" error={errors.comuna} required className="col-12 col-md-6">
            <select {...control('comuna')} disabled={!form.region}>
              <option value="">Seleccione una comuna</option>
              {comunas.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="checkout-notes" label="Indicaciones para la entrega (opcional)" error={errors.notes} className="col-12">
            <textarea rows={2} placeholder="Ej: Entre calles, color del edificio, no tiene timbre." {...control('notes')} />
          </FormField>
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h5">Selección de entrega</legend>
        {Object.entries(DELIVERY_OPTIONS).map(([key, option]) => (
          <div className="form-check" key={key}>
            <input className="form-check-input" type="radio" id={`delivery-${key}`} name="delivery" value={key} checked={form.delivery === key} onChange={() => onFieldChange('delivery', key)} />
            <label className="form-check-label" htmlFor={`delivery-${key}`}>
              {option.label} · {option.cost ? formatPrice(option.cost) : 'Gratis'}
            </label>
          </div>
        ))}
        {errors.delivery && <div className="text-danger small">{errors.delivery}</div>}
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h5">Simulación de pago</legend>
        <label htmlFor="checkout-escenario" className="form-label">
          Resultado simulado de la pasarela
        </label>
        <select id="checkout-escenario" className="form-select mb-2" value={scenario} onChange={(event) => onScenarioChange(event.target.value)}>
          {PAYMENT_SCENARIOS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="small text-secondary mb-0">Simulación: no se cobra dinero real y no se piden datos de tarjeta.</p>
      </fieldset>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-success btn-lg">
          Pagar ahora {formatPrice(total)}
        </button>
      </div>
    </form>
  );
}
