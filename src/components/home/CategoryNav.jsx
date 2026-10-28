// Selector de categorías (categorias.html del template): tarjetas con imagen 100x100 y nombre.
// La categoría activa se resalta; cada tarjeta lleva a /categorias/:slug.
import { Link } from 'react-router-dom';
import CategoryVisual from './CategoryVisual.jsx';

export default function CategoryNav({ categories, activeSlug }) {
  return (
    <ul className="nav justify-content-center flex-wrap gap-3" aria-label="Categorías">
      {categories.map((category) => (
        <li className="nav-item mx-2" key={category.id}>
          <Link to={`/categorias/${category.slug}`} className="text-decoration-none" aria-current={category.slug === activeSlug ? 'page' : undefined}>
            <div className={`nav-card p-3${category.slug === activeSlug ? ' nav-card-active' : ''}`} style={{ width: '136px' }}>
              <CategoryVisual category={category} height={100} className="rounded mb-2" />
              <span className="nav-link p-0 text-dark fw-bold">{category.nombre}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
