// Inicio de sesión (iniciar-sesion.html del template): aviso descartable, enlaces de registro y recuperación.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { hasErrors, validateLogin } from '../../utils/validators.js';

export default function LoginForm({ onSubmit }) {
  const [values, setValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(false);

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateLogin(values);
    setErrors(validation);
    if (hasErrors(validation)) {
      setFailed(false);
      return;
    }
    const user = onSubmit(values.username, values.password);
    setFailed(!user);
  };

  return (
    <>
      {failed && (
        <div id="error" className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>¡Error!</strong> Usuarios o Contraseña mal ingresados.
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setFailed(false)} />
        </div>
      )}
      <form id="loginForm" noValidate onSubmit={handleSubmit} aria-label="Iniciar sesión">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Usuario
          </label>
          <input type="text" className={`form-control${errors.username ? ' is-invalid' : ''}`} id="username" autoComplete="username" value={values.username} onChange={update('username')} />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input type="password" className={`form-control${errors.password ? ' is-invalid' : ''}`} id="password" autoComplete="current-password" value={values.password} onChange={update('password')} />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <Link to="/crear-sesion">¿No tienes cuenta? Regístrate aquí</Link>
          <Link to="/recuperar-contrasena" className="float-end">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          <strong>INICIAR SESIÓN</strong>
        </button>
      </form>
    </>
  );
}
