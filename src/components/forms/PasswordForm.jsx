// "Cambiar contraseña" del perfil (admin/perfil del template). Valida longitud y que ambas coincidan.
import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import StatusAlert from '../common/StatusAlert.jsx';
import { hasErrors, validatePasswordChange } from '../../utils/validators.js';

export default function PasswordForm({ onSubmit }) {
  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validatePasswordChange(values);
    setErrors(validation);
    if (hasErrors(validation)) {
      setStatus(null);
      return;
    }
    const result = onSubmit(values.password);
    setStatus(result.ok ? { status: 'success', message: 'Contraseña actualizada.' } : { status: 'error', message: result.error });
    if (result.ok) setValues({ password: '', confirmPassword: '' });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="row g-3" aria-label="Cambiar contraseña">
      <FormField id="perfil-password" label="Contraseña" error={errors.password} required className="col-12 col-md-6">
        <input id="perfil-password" type="password" autoComplete="new-password" className={`form-control${errors.password ? ' is-invalid' : ''}`} value={values.password} onChange={update('password')} />
      </FormField>
      <FormField id="perfil-confirmar" label="Repetir Contraseña" error={errors.confirmPassword} required className="col-12 col-md-6">
        <input id="perfil-confirmar" type="password" autoComplete="new-password" className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`} value={values.confirmPassword} onChange={update('confirmPassword')} />
      </FormField>
      <div className="col-12 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          <strong>Guardar</strong>
        </button>
      </div>
      <div className="col-12">
        <StatusAlert status={status?.status} message={status?.message} />
      </div>
    </form>
  );
}
