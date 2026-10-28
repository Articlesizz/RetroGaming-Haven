// Crear cuenta (crear-sesion.html del template): RUN, fecha de nacimiento, datos, contraseña, imagen y dirección.
// Al crearla queda con sesión iniciada y el checkout precarga sus datos.
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import UserForm from '../../components/forms/UserForm.jsx';

export default function RegisterPage() {
  const { user, register } = useSession();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Solo redirige a quien llega con sesión; al registrarse aquí, handleRegister decide el destino.
  const [arrivedLoggedIn] = useState(Boolean(user));
  if (arrivedLoggedIn) return <Navigate to={location.state?.from ?? '/mi-cuenta'} replace />;

  const handleRegister = (values) => {
    const result = register(values);
    if (result.ok) {
      notify(`¡Cuenta creada! Bienvenido/a, ${values.name}.`, 'success');
      navigate(location.state?.from ?? '/', { replace: true });
    }
    return result;
  };

  return (
    <div className="container mt-5 pb-5">
      <h2 className="mb-4 text-center">Nuevo usuario</h2>
      <div className="card">
        <div className="card-body">
          <UserForm creating requireAddress allowRoleChange={false} onSubmit={handleRegister} submitLabel="REGISTRAR" />
        </div>
      </div>
    </div>
  );
}
