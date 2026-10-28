// Accesos rápidos por plataforma: cada uno abre el catálogo ya filtrado.
import { Link } from 'react-router-dom';
import { PLATFORMS } from '../../data/fichas.js';
import { supportsPlatform } from '../../utils/catalog.js';

export default function PlatformShortcuts({ products }) {
  return (
    <nav className="platform-shortcuts" aria-label="Comprar por plataforma">
      {PLATFORMS.map((platform) => (
        <Link key={platform.id} to={`/productos?plataforma=${encodeURIComponent(platform.id)}`} className="platform-tile">
          <i className={`bi ${platform.icon}`} aria-hidden="true" />
          <strong>{platform.label}</strong>
          <small>{products.filter((product) => supportsPlatform(product, platform.id)).length} juegos</small>
        </Link>
      ))}
    </nav>
  );
}
