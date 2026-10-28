// Suscripción al boletín. SIMULADA: valida el correo y avisa, no guarda ni envía nada.
import { useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { isValidEmail } from '../../utils/validators.js';

export default function Newsletter() {
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Ingresa un correo válido.');
      return;
    }
    setError('');
    setEmail('');
    notify('¡Listo! Te avisaremos de las ofertas (simulación: no se guardó el correo).');
  };

  return (
    <section className="newsletter py-5" aria-labelledby="titulo-newsletter">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-7">
            <h2 id="titulo-newsletter" className="h3 mb-2">
              <i className="bi bi-envelope-paper-heart me-2" aria-hidden="true" />
              No te pierdas ninguna oferta
            </h2>
            <p className="mb-3">Suscríbete y recibe lanzamientos y descuentos antes que nadie.</p>
            <form className="d-flex gap-2 justify-content-center flex-wrap" onSubmit={handleSubmit} noValidate>
              <label htmlFor="newsletter-email" className="visually-hidden">
                Correo electrónico
              </label>
              <input id="newsletter-email" type="email" className={`form-control w-auto flex-grow-1${error ? ' is-invalid' : ''}`} style={{ maxWidth: '360px' }} placeholder="tu@correo.cl" value={email} onChange={(event) => setEmail(event.target.value)} />
              <button type="submit" className="btn btn-warning fw-bold">
                Suscribirme
              </button>
            </form>
            {error && (
              <p className="text-warning-emphasis small mt-2 mb-0" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
