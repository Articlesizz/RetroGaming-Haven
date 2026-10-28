// Pie de página: marca, enlaces de la tienda, cuenta y contacto, con el mapa del template (solo si showMap).
import { Link } from 'react-router-dom';
import { MAPA_URL } from '../../data/contenido.js';
import Brand from '../common/Brand.jsx';

export default function SiteFooter({ showMap = false }) {
  return (
    <footer className="site-footer text-light mt-auto" data-bs-theme="dark">
      {showMap && (
        <div className="container-fluid p-0">
          <iframe title="Mapa de ubicación de la tienda" src={MAPA_URL} width="100%" height="300px" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <Brand className="mb-3" />
            <p className="small text-secondary mb-0">Videojuegos para PC y consolas con despacho a todo Chile. Proyecto académico: pagos y correos son simulados.</p>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 text-uppercase">Tienda</h3>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/productos">Catálogo</Link></li>
              <li><Link to="/categorias">Categorías</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/favoritos">Favoritos</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 text-uppercase">Mi cuenta</h3>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/iniciar-sesion">Iniciar sesión</Link></li>
              <li><Link to="/crear-sesion">Crear cuenta</Link></li>
              <li><Link to="/mi-cuenta">Mis compras</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 text-uppercase">Conócenos</h3>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 text-uppercase">Plataformas</h3>
            <ul className="list-unstyled small mb-0">
              {['PC', 'PlayStation', 'Xbox', 'Switch'].map((platform) => (
                <li key={platform}>
                  <Link to={`/productos?plataforma=${platform}`}>{platform}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-3 small">
        &copy; {new Date().getFullYear()} RetroGaming Haven · Las portadas pertenecen a sus editores.
      </div>
    </footer>
  );
}
