// Layout público del template: cabecera, menú móvil, contenido de cada vista y pie (con mapa en inicio y contacto).
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import MobileMenu from './MobileMenu.jsx';
import SiteFooter from './SiteFooter.jsx';
import ScrollToTop from './ScrollToTop.jsx';

export default function SiteLayout() {
  const { pathname } = useLocation();
  return (
    <div className="d-flex flex-column min-vh-100">
      <a className="visually-hidden-focusable" href="#contenido">
        Saltar al contenido
      </a>
      <ScrollToTop />
      <SiteHeader />
      <MobileMenu />
      <main id="contenido" className="flex-grow-1">
        <Outlet />
      </main>
      <SiteFooter showMap={pathname === '/' || pathname === '/contacto'} />
    </div>
  );
}
