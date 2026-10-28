// Formulario de usuario del template (crear-sesion, usuario/nuevo, usuario/edit y perfil).
// Campos: RUN, fecha de nacimiento, nombre, apellidos, correo, contraseña y repetición, tipo, imagen y dirección.
//  - requireAddress: la dirección es obligatoria (registro público).
//  - allowRoleChange: muestra el tipo de usuario (solo administración).
//  - showPassword: muestra los campos de contraseña (el perfil usa un formulario aparte).
import { useEffect, useState } from 'react';
import FormField from '../common/FormField.jsx';
import ImageField from '../common/ImageField.jsx';
import StatusAlert from '../common/StatusAlert.jsx';
import { REGION_NAMES, comunasDeRegion } from '../../utils/geo.js';
import { hasErrors, validateRegister } from '../../utils/validators.js';

const ROLE_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'admin', label: 'Administrador' },
];

const FIELD_IDS = {
  run: 'usuario-run',
  birthDate: 'usuario-nacimiento',
  name: 'usuario-nombre',
  lastName: 'usuario-apellidos',
  email: 'usuario-correo',
  password: 'usuario-password',
  confirmPassword: 'usuario-confirmar',
  street: 'usuario-calle',
  region: 'usuario-region',
  comuna: 'usuario-comuna',
};
const FIELD_ORDER = Object.keys(FIELD_IDS);

export default function UserForm({
  user,
  creating = false,
  allowRoleChange = true,
  requireAddress = false,
  showPassword = true,
  onSubmit,
  submitLabel = 'Guardar',
}) {
  const [values, setValues] = useState({
    run: user?.run ?? '',
    birthDate: user?.birthDate ?? '',
    name: user?.name ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    role: user?.role ?? 'cliente',
    password: '',
    confirmPassword: '',
    imagen: user?.imagen ?? '',
    street: user?.street ?? '',
    department: user?.department ?? '',
    region: user?.region ?? '',
    comuna: user?.comuna ?? '',
    notes: user?.notes ?? '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  // Tras un envío con errores, lleva el foco al primer campo inválido (el formulario es largo).
  useEffect(() => {
    if (attempt === 0) return;
    const first = FIELD_ORDER.find((field) => errors[field]);
    const target = first ? document.getElementById(FIELD_IDS[first]) : null;
    if (target) {
      target.scrollIntoView({ block: 'center' });
      target.focus({ preventScroll: true });
    }
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  const invalid = (field) => (errors[field] ? ' is-invalid' : '');
  const comunas = comunasDeRegion(values.region);

  const handleSubmit = (event) => {
    event.preventDefault();
    let local = {};
    if (requireAddress) local = validateRegister(values);
    else if (values.password && values.password !== values.confirmPassword) local = { confirmPassword: 'Las contraseñas no coinciden.' };
    if (hasErrors(local)) {
      setErrors(local);
      setMessage('Revisa los campos marcados.');
      setAttempt((n) => n + 1);
      return;
    }
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors(result.errors);
      setMessage(result.errors.form ?? 'Revisa los campos marcados.');
      setAttempt((n) => n + 1);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Formulario de usuario">
      <h4 className="card-title">{creating ? 'Registro de nuevo usuario' : 'Datos del usuario'}</h4>
      <div className="row g-3 mb-4">
        <FormField id="usuario-run" label="Run" error={errors.run} required className="col-12 col-md-6">
          <input id="usuario-run" type="text" placeholder="ej: 11.111.111-1" className={`form-control${invalid('run')}`} value={values.run} onChange={update('run')} />
        </FormField>
        <FormField id="usuario-nacimiento" label="Fecha nacimiento" error={errors.birthDate} required className="col-12 col-md-6">
          <input id="usuario-nacimiento" type="date" className={`form-control${invalid('birthDate')}`} value={values.birthDate} onChange={update('birthDate')} />
        </FormField>
        <FormField id="usuario-nombre" label="Nombre" error={errors.name} required className="col-12 col-md-6">
          <input id="usuario-nombre" type="text" autoComplete="given-name" className={`form-control${invalid('name')}`} value={values.name} onChange={update('name')} />
        </FormField>
        <FormField id="usuario-apellidos" label="Apellidos" error={errors.lastName} required className="col-12 col-md-6">
          <input id="usuario-apellidos" type="text" autoComplete="family-name" className={`form-control${invalid('lastName')}`} value={values.lastName} onChange={update('lastName')} />
        </FormField>
        <FormField id="usuario-correo" label="Correo" error={errors.email} required className="col-12 col-md-6">
          <input id="usuario-correo" type="email" autoComplete="email" className={`form-control${invalid('email')}`} value={values.email} onChange={update('email')} />
        </FormField>
        <FormField id="usuario-telefono" label="Teléfono (opcional)" className="col-12 col-md-6">
          <input id="usuario-telefono" type="text" className="form-control" value={values.phone} onChange={update('phone')} />
        </FormField>
        {showPassword && (
          <>
            <FormField id="usuario-password" label={creating ? 'Contraseña' : 'Nueva contraseña (vacío = sin cambios)'} error={errors.password} required={creating} className="col-12 col-md-6">
              <input id="usuario-password" type="password" autoComplete="new-password" className={`form-control${invalid('password')}`} value={values.password} onChange={update('password')} />
            </FormField>
            <FormField id="usuario-confirmar" label="Repetir Contraseña" error={errors.confirmPassword} required={creating} className="col-12 col-md-6">
              <input id="usuario-confirmar" type="password" autoComplete="new-password" className={`form-control${invalid('confirmPassword')}`} value={values.confirmPassword} onChange={update('confirmPassword')} />
            </FormField>
          </>
        )}
        {allowRoleChange && (
          <FormField id="usuario-rol" label="Tipo Usuario" error={errors.role} required className="col-12 col-md-6">
            <select id="usuario-rol" className="form-select" value={values.role} onChange={update('role')}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        )}
        <ImageField id="usuario-imagen" label="Imagen del usuario" value={values.imagen} onChange={(dataUrl) => setValues((current) => ({ ...current, imagen: dataUrl }))} />
      </div>

      <h4 className="card-title">Dirección de entrega de los productos</h4>
      <div className="row g-3 mb-4">
        <FormField id="usuario-calle" label="Calle" error={errors.street} required={requireAddress} className="col-12 col-md-6">
          <input id="usuario-calle" type="text" className={`form-control${invalid('street')}`} value={values.street} onChange={update('street')} />
        </FormField>
        <FormField id="usuario-departamento" label="Departamento (opcional)" className="col-12 col-md-6">
          <input id="usuario-departamento" type="text" placeholder="Ej: 603" className="form-control" value={values.department} onChange={update('department')} />
        </FormField>
        <FormField id="usuario-region" label="Región" error={errors.region} required={requireAddress} className="col-12 col-md-6">
          <select id="usuario-region" className={`form-select${invalid('region')}`} value={values.region} onChange={(event) => setValues((current) => ({ ...current, region: event.target.value, comuna: '' }))}>
            <option value="">Seleccione una región</option>
            {REGION_NAMES.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="usuario-comuna" label="Comuna" error={errors.comuna} required={requireAddress} className="col-12 col-md-6">
          <select id="usuario-comuna" className={`form-select${invalid('comuna')}`} value={values.comuna} onChange={update('comuna')} disabled={!values.region}>
            <option value="">Seleccione una comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="usuario-notas" label="Indicaciones para la entrega (opcional)" className="col-12">
          <textarea id="usuario-notas" rows={3} placeholder="Ej: Entre calles, color del edificio, no tiene timbre." className="form-control" value={values.notes} onChange={update('notes')} />
        </FormField>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary">
          <strong>{submitLabel}</strong>
        </button>
      </div>
      <div className="mt-3">
        <StatusAlert status="error" message={message} />
      </div>
    </form>
  );
}
