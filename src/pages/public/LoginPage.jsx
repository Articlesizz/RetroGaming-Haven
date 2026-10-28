// Iniciar sesión (iniciar-sesion.html del template): imagen a la izquierda, formulario a la derecha y "Acceso directo".
// Los administradores van a /admin; el resto vuelve a la tienda (o a la ruta que pidieron).
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import LoginForm from '../../components/forms/LoginForm.jsx';
import { placeholderImage } from '../../utils/placeholder.js';

export default function LoginPage() {
  const { user: sessionUser, login } = useSession();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Solo redirige a quien llega con sesión; al iniciar aquí, handleLogin decide el destino.
  const [arrivedLoggedIn] = useState(Boolean(sessionUser));
  if (arrivedLoggedIn) return <Navigate to={location.state?.from ?? '/mi-cuenta'} replace />;

  const handleLogin = (username, password) => {
    const user = login(username, password);
    if (user) {
      notify(`Bienvenido/a, ${user.name}.`, 'success');
      navigate(location.state?.from ?? (user.role === 'admin' ? '/admin' : '/'), { replace: true });
    }
    return user;
  };

  // Acceso directo de demostración con las cuentas del template.
  const quickLogin = (username) => handleLogin(username, '12345');

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="card">
          <div className="card-body row">
            <div className="col-md-6 d-none d-md-block">
              <img src={placeholderImage(600, 400, 'Iniciar sesión')} className="product-img" alt="Ilustración de inicio de sesión" />
            </div>
            <div className="col-md-6">
              <h2 className="mb-4 text-center">Iniciar Sesión</h2>
              <LoginForm onSubmit={handleLogin} />
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center pb-5">
        <div className="col-md-6">
          <div className="card mt-3 text-center bg-info">
            <div className="card-body">
              <h5 className="card-title">Acceso directo</h5>
              <p className="small mb-2">Cuentas de demostración: usuario <code>usuario</code> y <code>admin</code>, clave <code>12345</code>.</p>
              <button type="button" className="btn btn-danger me-1" onClick={() => quickLogin('usuario')}>
                <strong>ENTRAR COMO CLIENTE</strong>
              </button>
              <button type="button" className="btn btn-dark" onClick={() => quickLogin('admin')}>
                <strong>ENTRAR COMO ADMINISTRADOR</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
