// Recuperar contraseña: el enlace existe en el template (iniciar-sesion.html) pero la página no. Aquí es una SIMULACIÓN
// que valida el correo y explica que no hay un servicio de correo configurado.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/common/FormField.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { isValidEmail } from '../../utils/validators.js';

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Ingresa un correo válido.');
      setStatus(null);
      return;
    }
    setError('');
    setStatus({ status: 'warning', message: 'Simulación: no hay un servicio de correo configurado, por lo que no se envió ningún mensaje.' });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '520px' }}>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Recuperar contraseña</h2>
          <form noValidate onSubmit={handleSubmit} className="row g-3" aria-label="Recuperar contraseña">
            <FormField id="recuperar-correo" label="Correo" error={error} required className="col-12">
              <input id="recuperar-correo" type="email" className={`form-control${error ? ' is-invalid' : ''}`} value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormField>
            <div className="col-12 d-grid">
              <button type="submit" className="btn btn-primary">
                <strong>ENVIAR INSTRUCCIONES</strong>
              </button>
            </div>
            <div className="col-12">
              <StatusAlert status={status?.status} message={status?.message} />
            </div>
          </form>
          <p className="text-center mb-0 mt-3">
            <Link to="/iniciar-sesion">Volver a iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
