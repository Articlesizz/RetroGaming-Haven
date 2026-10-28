// Layout administrativo (admin/index.html del template, con la marca de la tienda): cabecera oscura con buscador,
// menú lateral por secciones con contadores (offcanvas en móvil), tarjeta de la persona conectada y botones "Tienda" y "Cerrar Sesión".
// El buscador filtra el listado de productos.
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { criticalProducts } from '../../utils/reports.js';
import Brand from '../common/Brand.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const SECTIONS = [
  {
    title: 'Gestión',
    links: [
      { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
      { to: '/admin/ordenes', label: 'Ordenes', icon: 'bi-receipt', count: 'orders' },
      { to: '/admin/producto', label: 'Productos', icon: 'bi-controller', count: 'critical' },
      { to: '/admin/categoria', label: 'Categorías', icon: 'bi-tags' },
      { to: '/admin/usuario', label: 'Usuarios', icon: 'bi-people', count: 'users' },
    ],
  },
  {
    title: 'Análisis',
    links: [{ to: '/admin/reporte', label: 'Reportes', icon: 'bi-graph-up-arrow' }],
  },
  {
    title: 'Cuenta',
    links: [{ to: '/admin/perfil', label: 'Perfil', icon: 'bi-person-circle' }],
  },
];

const linkClass = ({ isActive }) => `nav-link nav-menu d-flex align-items-center gap-2${isActive ? ' nav-active' : ''}`;

export default function AdminLayout() {
  const { user, logout } = useSession();
  const { db } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const counts = {
    orders: { value: db.orders.length, className: 'text-bg-secondary', label: 'órdenes' },
    critical: { value: criticalProducts(db.products).length, className: 'text-bg-danger', label: 'productos críticos' },
    users: { value: db.users.length, className: 'text-bg-secondary', label: 'usuarios' },
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/admin/producto?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/iniciar-sesion');
  };

  return (
    <div className="admin-page">
      <ScrollToTop />
      <header className="navbar admin-header sticky-top flex-md-nowrap p-0 shadow" data-bs-theme="dark">
        <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white d-flex align-items-center gap-2" to="/admin" aria-label="Panel de administración, inicio">
          <Brand />
        </Link>
        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white btn btn-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Abrir menú">
              <i className="bi bi-list" aria-hidden="true" />
            </button>
          </li>
        </ul>
        <form id="navbarSearch" className="navbar-search w-100 d-none d-md-block" role="search" onSubmit={handleSearch}>
          <label htmlFor="admin-buscar" className="visually-hidden">
            Buscar productos
          </label>
          <input id="admin-buscar" className="form-control w-100 rounded-0 border-0" type="text" placeholder="Buscar productos" aria-label="Buscar productos" value={query} onChange={(event) => setQuery(event.target.value)} />
        </form>
        <ThemeToggle />
      </header>

      <div className="container-fluid">
        <div className="row">
          <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div className="offcanvas-md offcanvas-start bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarMenuLabel">
                  Menú de administración
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Cerrar" />
              </div>
              <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                {user && (
                  <div className="admin-user mx-3 mb-3 d-flex align-items-center gap-2">
                    <span className="admin-avatar" aria-hidden="true">
                      {user.name?.[0]?.toUpperCase() ?? 'A'}
                    </span>
                    <div className="lh-sm">
                      <strong className="d-block small">{`${user.name} ${user.lastName ?? ''}`.trim()}</strong>
                      <small className="text-secondary">Administrador</small>
                    </div>
                  </div>
                )}
                {SECTIONS.map((section) => (
                  <div key={section.title} className="mb-2">
                    <h6 className="sidebar-heading px-3 mt-2 mb-1 text-body-secondary text-uppercase">{section.title}</h6>
                    <ul className="nav flex-column">
                      {section.links.map((link) => {
                        const count = link.count ? counts[link.count] : null;
                        return (
                          <li className="nav-item mx-2" key={link.to} data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
                            <NavLink to={link.to} end={link.end} className={linkClass}>
                              <i className={`bi ${link.icon}`} aria-hidden="true" />
                              {link.label}
                              {count && count.value > 0 && (
                                <span className={`badge rounded-pill ms-auto ${count.className}`}>
                                  {count.value}
                                  <span className="visually-hidden"> {count.label}</span>
                                </span>
                              )}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                <hr className="my-2" />
                <ul className="nav flex-column mb-auto">
                  <li className="nav-item mt-2 mx-3">
                    <Link className="text-center d-flex justify-content-center gap-2 btn btn-dark" to="/">
                      <i className="bi bi-shop" aria-hidden="true" />
                      <strong>Tienda</strong>
                    </Link>
                  </li>
                  <li className="nav-item mt-2 mx-3">
                    <button type="button" className="text-center d-flex justify-content-center gap-2 btn btn-danger w-100" onClick={handleLogout}>
                      <i className="bi bi-door-closed" aria-hidden="true" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pb-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
