// Menú móvil (offcanvas del template): tarjeta del usuario, acordeón de categorías, ofertas e historial.
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { placeholderImage } from '../../utils/placeholder.js';
import CartButton from './CartButton.jsx';

export default function MobileMenu() {
  const { db } = useStore();
  const { user, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasMobileMenu" aria-labelledby="offcanvasMobileMenuLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasMobileMenuLabel">
          Menú
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar" />
      </div>
      <div className="offcanvas-body">
        {user ? (
          <div className="card">
            <div className="row g-0">
              <div className="col-4 d-flex align-items-center justify-content-center">
                <img src={user.imagen ?? placeholderImage(80, 80, 'Avatar')} alt={`Avatar de ${user.name}`} className="avatar rounded-pill" />
              </div>
              <div className="col-8">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text small">{user.email}</p>
                  <div className="d-flex justify-content-between gap-1">
                    <Link to="/mi-cuenta" className="btn btn-primary btn-sm" data-bs-dismiss="offcanvas">
                      Ver Perfil
                    </Link>
                    <button type="button" className="btn btn-danger btn-sm" data-bs-dismiss="offcanvas" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex my-3">
            <Link to="/iniciar-sesion" className="btn btn-outline-primary ms-2" data-bs-dismiss="offcanvas">
              Iniciar Sesión
            </Link>
            <Link to="/crear-sesion" className="btn btn-primary ms-2" data-bs-dismiss="offcanvas">
              Crear Cuenta
            </Link>
          </div>
        )}

        <ul className="list-group mt-3">
          <li className="list-group-item">
            <Link to="/" className="link-none" data-bs-dismiss="offcanvas">
              Home
            </Link>
          </li>
          <li className="list-group-item">
            <div className="accordion accordion-flush" id="accordionCategorias">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-categorias" aria-expanded="false" aria-controls="flush-categorias">
                    Categorías
                  </button>
                </h2>
                <div id="flush-categorias" className="accordion-collapse collapse" data-bs-parent="#accordionCategorias">
                  <ul className="list-group">
                    {db.categories.map((category) => (
                      <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/categorias/${category.slug}`} className="link-none" data-bs-dismiss="offcanvas">
                          {category.nombre}
                        </Link>
                        <span className="badge bg-primary rounded-pill">{db.products.filter((product) => product.categoryId === category.id).length}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item">
            <Link to="/ofertas" className="link-none" data-bs-dismiss="offcanvas">
              Ofertas
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/favoritos" className="link-none" data-bs-dismiss="offcanvas">
              Favoritos
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/mi-cuenta" className="link-none" data-bs-dismiss="offcanvas">
              Historial
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/nosotros" className="link-none" data-bs-dismiss="offcanvas">
              Nosotros
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/blog" className="link-none" data-bs-dismiss="offcanvas">
              Blog
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/contacto" className="link-none" data-bs-dismiss="offcanvas">
              Contacto
            </Link>
          </li>
        </ul>
        <div className="mt-3 d-grid" data-bs-dismiss="offcanvas">
          <CartButton />
        </div>
      </div>
    </div>
  );
}
