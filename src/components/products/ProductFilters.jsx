// Filtros controlados del catálogo: texto, categoría, orden, solo ofertas y solo con stock.
// No guarda estado propio: la página dueña de los filtros recibe cada cambio por onChange.
import PropTypes from 'prop-types';
import { categoryShape } from '../../utils/propShapes.js';
import { PLATFORMS } from '../../data/fichas.js';
import { SORT_OPTIONS } from '../../utils/catalog.js';

export default function ProductFilters({ filters, categories, onChange }) {
  const update = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <form className="row g-2 align-items-end mb-4" role="search" aria-label="Filtros de productos" onSubmit={(event) => event.preventDefault()}>
      <div className="col-12 col-md-3">
        <label htmlFor="filtro-texto" className="form-label">
          Buscar
        </label>
        <input id="filtro-texto" type="search" className="form-control" placeholder="Nombre o descripción" value={filters.query} onChange={(event) => update('query', event.target.value)} />
      </div>
      <div className="col-6 col-md-2">
        <label htmlFor="filtro-categoria" className="form-label">
          Categoría
        </label>
        <select id="filtro-categoria" className="form-select" value={filters.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-md-2">
        <label htmlFor="filtro-plataforma" className="form-label">
          Plataforma
        </label>
        <select id="filtro-plataforma" className="form-select" value={filters.platform ?? ''} onChange={(event) => update('platform', event.target.value)}>
          <option value="">Todas</option>
          {PLATFORMS.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-md-2">
        <label htmlFor="filtro-orden" className="form-label">
          Ordenar por
        </label>
        <select id="filtro-orden" className="form-select" value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-3 d-flex gap-3 flex-wrap">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="filtro-ofertas" checked={filters.onlyOffers} onChange={(event) => update('onlyOffers', event.target.checked)} />
          <label className="form-check-label" htmlFor="filtro-ofertas">
            Solo ofertas
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="filtro-stock" checked={filters.onlyInStock} onChange={(event) => update('onlyInStock', event.target.checked)} />
          <label className="form-check-label" htmlFor="filtro-stock">
            Solo con stock
          </label>
        </div>
      </div>
    </form>
  );
}

ProductFilters.propTypes = {
  filters: PropTypes.shape({
    query: PropTypes.string,
    categoryId: PropTypes.string,
    platform: PropTypes.string,
    sort: PropTypes.string,
    onlyOffers: PropTypes.bool,
    onlyInStock: PropTypes.bool,
  }).isRequired,
  categories: PropTypes.arrayOf(categoryShape).isRequired,
  onChange: PropTypes.func.isRequired,
};
