// Formulario de contacto (contacto.html del template). El envío es una SIMULACIÓN: no hay correo configurado.
import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import StatusAlert from '../common/StatusAlert.jsx';
import { hasErrors, validateContact } from '../../utils/validators.js';

const EMPTY = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateContact(values);
    setErrors(validation);
    if (hasErrors(validation)) {
      setStatus({ status: 'error', message: 'Revisa los campos marcados.' });
      return;
    }
    setStatus({ status: 'warning', message: 'Mensaje validado. Simulación: no hay un servicio de correo configurado, así que no se envió.' });
    setValues(EMPTY);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="row g-3" aria-label="Formulario de contacto">
      <FormField id="nombre-contacto" label="Nombre" error={errors.name} required>
        <input id="nombre-contacto" type="text" placeholder="Tu nombre" className={`form-control${errors.name ? ' is-invalid' : ''}`} value={values.name} onChange={update('name')} />
      </FormField>
      <FormField id="email-contacto" label="Email" error={errors.email} required>
        <input id="email-contacto" type="email" placeholder="Tu correo electrónico" className={`form-control${errors.email ? ' is-invalid' : ''}`} value={values.email} onChange={update('email')} />
      </FormField>
      <FormField id="mensaje-contacto" label="Mensaje" error={errors.message} required className="col-12">
        <textarea id="mensaje-contacto" rows={3} placeholder="Tu mensaje" className={`form-control${errors.message ? ' is-invalid' : ''}`} value={values.message} onChange={update('message')} />
      </FormField>
      <div className="col-12">
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </div>
      <div className="col-12">
        <StatusAlert status={status?.status} message={status?.message} />
      </div>
    </form>
  );
}
