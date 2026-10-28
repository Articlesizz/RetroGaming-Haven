// Cabecera del template: barra superior (logo, buscador, sesión) y barra inferior con menú, categorías y carrito.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import Brand from '../common/Brand.jsx';
import CartButton from './CartButton.jsx';

export default function SiteHeader() {
  const { db } = useStore();
  const { user, logout } = useSession();
  const { ids: wishIds } = useWishlist();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar site-nav" data-bs-theme="dark" aria-label="Navegación superior">
        <div className="container-fluid gap-2">
          <Link className="navbar-brand me-0" to="/" aria-label="RetroGaming Haven, inicio">
            <Brand />
          </Link>
          <form className="d-flex order-last order-md-0 flex-grow-1 justify-content-md-center" role="search" onSubmit={handleSearch}>
            <label className="visually-hidden" htmlFor="buscador">
              Buscar
            </label>
            <input id="buscador" className="form-control me-2" style={{ maxWidth: '420px' }} type="search" placeholder="Buscar" aria-label="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
          <div className="d-flex align-items-center">
            <Link to="/favoritos" className="btn btn-outline-light position-relative ms-2" aria-label={`Favoritos: ${wishIds.length}`}>
              <i className="bi bi-heart-fill text-danger" aria-hidden="true" />
              {wishIds.length > 0 && <span className="badge rounded-pill bg-danger ms-1">{wishIds.length}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/mi-cuenta" className="btn btn-outline-light ms-2 d-none d-md-inline-block">
                  {user.name}
                </Link>
                {user.role === 'admin' && (
                  <Link className="btn btn-warning ms-2 d-none d-md-inline-block" to="/admin">
                    Administración
                  </Link>
                )}
                <button type="button" className="btn btn-danger ms-2 d-none d-md-inline-block" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/iniciar-sesion" className="btn btn-outline-light ms-2">
                  Iniciar Sesión
                </Link>
                <Link to="/crear-sesion" className="btn btn-primary ms-2">
                  Crear Cuenta
                </Link>
              </>
            )}
            <button className="btn btn-primary d-lg-none ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMobileMenu" aria-controls="offcanvasMobileMenu" aria-label="Abrir menú">
              <span className="navbar-toggler-icon text-white" />
            </button>
          </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg site-subnav d-none d-lg-block" data-bs-theme="dark" aria-label="Navegación principal">
        <div className="container-fluid">
          <ul className="navbar-nav justify-content-center w-100 flex-row align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <strong>Home</strong>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
              </button>
              <ul className="dropdown-menu">
                {db.categories.map((category) => (
                  <li key={category.id}>
                    <Link className="dropdown-item" to={`/categorias/${category.slug}`}>
                      {category.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">
                Ofertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">
                Contacto
              </NavLink>
            </li>
            <li className="nav-item ms-5">
              <CartButton />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
