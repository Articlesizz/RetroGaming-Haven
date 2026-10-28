// Tabla de usuarios con avatar e insignias de tipo (usuario/index.html del template). No elimina la sesión activa.
import { Link } from 'react-router-dom';
import DeleteButton from '../common/DeleteButton.jsx';
import { placeholderImage } from '../../utils/placeholder.js';

export const ROLE_BADGES = {
  admin: { label: 'ADMINISTRADOR', className: 'bg-primary' },
  vendedor: { label: 'VENDEDOR', className: 'bg-success' },
  cliente: { label: 'CLIENTE', className: 'bg-warning text-dark' },
};

export default function UsersTable({ users, currentUserId, onDelete, readOnly = false }) {
  return (
    <div className="card text-start">
      <div className="card-body">
        <div className="table-responsive small">
          <table className="table table-sm table-hover align-middle">
            <caption className="visually-hidden">Listado de usuarios</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imagen</th>
                <th scope="col">Nombre Completo</th>
                <th scope="col">Correo Electrónico</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Tipo</th>
                {!readOnly && <th scope="col">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row">{user.id.replace(/^u-/, '')}</th>
                  <td>
                    <img src={user.imagen ?? placeholderImage(50, 50, '')} alt={`Avatar de ${user.name}`} className="user-img" />
                  </td>
                  <td>{readOnly ? `${user.name} ${user.lastName}`.trim() : <Link to={`/admin/usuario/${user.id}`}>{`${user.name} ${user.lastName}`.trim()}</Link>}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || ''}</td>
                  <td>
                    <h6 className="mb-0">
                      <span className={`badge ${ROLE_BADGES[user.role]?.className ?? 'bg-secondary'}`}>{ROLE_BADGES[user.role]?.label ?? user.role}</span>
                    </h6>
                  </td>
                  {!readOnly && (
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Link className="btn btn-outline-secondary btn-sm" to={`/admin/usuario/${user.id}/editar`}>
                          Editar
                        </Link>
                        <DeleteButton disabled={user.id === currentUserId} message={`¿Eliminar al usuario ${user.email}?`} onConfirm={() => onDelete(user.id)} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
