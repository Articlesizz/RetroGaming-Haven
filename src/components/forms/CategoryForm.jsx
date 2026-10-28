// Formulario de categoría (nuevo.html y #id del template): nombre, descripción e imagen.
import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import ImageField from '../common/ImageField.jsx';
import StatusAlert from '../common/StatusAlert.jsx';

export default function CategoryForm({ category, onSubmit, submitLabel = 'Guardar' }) {
  const [values, setValues] = useState({ nombre: category?.nombre ?? '', descripcion: category?.descripcion ?? '', imagen: category?.imagen ?? '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors(result.errors);
      setMessage(result.errors.form ?? 'Revisa los campos marcados.');
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="row g-3" aria-label="Formulario de categoría">
      <FormField id="categoria-nombre" label="Nombre de la categoría" error={errors.nombre} required className="col-12 col-md-6">
        <input id="categoria-nombre" type="text" placeholder="Ingrese el nombre" className={`form-control${errors.nombre ? ' is-invalid' : ''}`} value={values.nombre} onChange={update('nombre')} />
      </FormField>
      <ImageField id="categoria-imagen" label="Imagen" value={values.imagen} onChange={(dataUrl) => setValues((current) => ({ ...current, imagen: dataUrl }))} />
      <FormField id="categoria-descripcion" label="Descripción" error={errors.descripcion} required className="col-12">
        <textarea id="categoria-descripcion" rows={3} className={`form-control${errors.descripcion ? ' is-invalid' : ''}`} value={values.descripcion} onChange={update('descripcion')} />
      </FormField>
      <div className="col-12 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          <strong>{submitLabel}</strong>
        </button>
      </div>
      <div className="col-12">
        <StatusAlert status="error" message={message} />
      </div>
    </form>
  );
}
