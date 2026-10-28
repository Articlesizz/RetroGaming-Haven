// Barra de filtros de los listados del administrador. Cada campo es { id, label, type: 'search' | 'select', value, onChange, options? }.
// Muestra cuántos resultados hay y "Limpiar filtros" cuando hay alguno activo.
import PropTypes from 'prop-types';

export default function FilterBar({ fields, total, shown, onClear, label = 'Filtros del listado' }) {
  const active = fields.some((field) => field.value !== '');
  return (
    <form className="admin-filters card card-body py-2 mb-3" role="search" aria-label={label} onSubmit={(event) => event.preventDefault()}>
      <div className="row g-2 align-items-end">
        {fields.map((field) => (
          <div key={field.id} className={field.className ?? 'col-6 col-md'}>
            <label htmlFor={field.id} className="form-label">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select id={field.id} className="form-select form-select-sm" value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input id={field.id} type="search" className="form-control form-control-sm" placeholder={field.placeholder} value={field.value} onChange={(event) => field.onChange(event.target.value)} />
            )}
          </div>
        ))}
        <div className="col-12 col-md-auto d-flex align-items-center gap-2">
          <small className="text-secondary" aria-live="polite">
            {shown} de {total}
          </small>
          {active && (
            <button type="button" className="btn btn-link btn-sm p-0" onClick={onClear}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

FilterBar.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['search', 'select']).isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    }),
  ).isRequired,
  total: PropTypes.number.isRequired,
  shown: PropTypes.number.isRequired,
  onClear: PropTypes.func.isRequired,
  label: PropTypes.string,
};
