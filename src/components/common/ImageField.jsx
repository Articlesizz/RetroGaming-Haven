// Campo para subir una imagen (type="file"). Guarda la imagen como data URL (máximo 300 KB) y muestra una vista previa.
import PropTypes from 'prop-types';
import { useState } from 'react';
import FormField from './FormField.jsx';
import { readImageFile } from '../../utils/imageFile.js';

export default function ImageField({ id, label, value, onChange, className = 'col-12 col-md-6' }) {
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    try {
      const dataUrl = await readImageFile(file);
      setError('');
      onChange(dataUrl);
    } catch (readError) {
      setError(readError.message);
      event.target.value = '';
    }
  };

  return (
    <FormField id={id} label={label} error={error} className={className}>
      <input id={id} type="file" accept="image/*" className={`form-control${error ? ' is-invalid' : ''}`} onChange={handleFile} />
      {value && (
        <div className="mt-2 d-flex align-items-center gap-2">
          <img src={value} alt="Vista previa" width="60" height="60" style={{ objectFit: 'cover', borderRadius: 6 }} />
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onChange('')}>
            Quitar imagen
          </button>
        </div>
      )}
    </FormField>
  );
}

ImageField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
