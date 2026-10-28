// Catálogo completo con búsqueda (también desde la barra superior con ?q=) y filtros que actualizan los resultados.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import ProductFilters from '../../components/products/ProductFilters.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import { DEFAULT_FILTERS, SORT_OPTIONS, filterProducts } from '../../utils/catalog.js';

export default function CatalogPage() {
  const { db } = useStore();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialPlatform = searchParams.get('plataforma') ?? '';
  const initialSort = SORT_OPTIONS.some((option) => option.value === searchParams.get('orden')) ? searchParams.get('orden') : DEFAULT_FILTERS.sort;
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, query: initialQuery, platform: initialPlatform, sort: initialSort });

  // Una nueva búsqueda o un enlace del inicio (plataforma, orden) reemplaza los filtros correspondientes.
  useEffect(() => {
    setFilters((current) => ({ ...current, query: initialQuery, platform: initialPlatform, sort: initialSort }));
  }, [initialQuery, initialPlatform, initialSort]);

  const results = filterProducts(db.products, filters);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-3">Catálogo de productos</h2>
        <ProductFilters filters={filters} categories={db.categories} onChange={setFilters} />
        <p className="small text-secondary" aria-live="polite">
          {results.length} resultado(s)
        </p>
        <ProductGrid products={results} categories={db.categories} variant="add" cols="row-cols-2 row-cols-md-4 g-4" />
      </div>
    </section>
  );
}
