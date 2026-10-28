// Selector numérico de cantidad con botones − y +. Siempre entrega un entero entre min y max.
import PropTypes from 'prop-types';
import AppButton from './AppButton.jsx';

export default function QuantityInput({ value, min = 1, max, onChange, label = 'Cantidad' }) {
  const clamp = (next) => Math.max(min, max === undefined ? next : Math.min(max, next));

  return (
    <div className="input-group input-group-sm" style={{ width: '130px' }}>
      <AppButton
        label="−"
        variant="outline-secondary"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
      />
      <input
        type="number"
        className="form-control text-center"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
      />
      <AppButton
        label="+"
        variant="outline-secondary"
        onClick={() => onChange(clamp(value + 1))}
        disabled={max !== undefined && value >= max}
      />
    </div>
  );
}

QuantityInput.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
