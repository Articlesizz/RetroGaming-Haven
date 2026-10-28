// Perfil (admin/perfil del template): "Información personal" y "Cambiar contraseña" del usuario con sesión.
import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import PasswordForm from '../../components/forms/PasswordForm.jsx';
import UserForm from '../../components/forms/UserForm.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';

export default function ProfilePage() {
  const { updateUser, changePassword } = useStore();
  const { user } = useSession();
  const [message, setMessage] = useState(null);

  const handleSubmit = (values) => {
    const result = updateUser(user.id, { ...values, role: user.role });
    if (result.ok) setMessage({ status: 'success', message: 'Perfil actualizado.' });
    return result;
  };

  return (
    <div className="mt-4">
      <h4>Información personal</h4>
      <StatusAlert status={message?.status} message={message?.message} />
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Usuario</h5>
          <UserForm key={user.id} user={user} allowRoleChange={false} showPassword={false} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Cambiar contraseña</h5>
          <PasswordForm onSubmit={(password) => changePassword(user.id, password)} />
        </div>
      </div>
    </div>
  );
}
