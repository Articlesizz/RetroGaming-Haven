// Ofertas (ofertas.html del template): todos los productos con precio rebajado.
import { useStore } from '../../context/StoreContext.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import { filterProducts } from '../../utils/catalog.js';

export default function OffersPage() {
  const { db } = useStore();
  const offers = filterProducts(db.products, { onlyOffers: true });
  return (
    <section id="productos" className="py-5">
      <div className="container">
        <h2 className="mb-4">Las mejores OFERTAS de la semana</h2>
        <ProductGrid products={offers} categories={db.categories} variant="add" cols="row-cols-2 row-cols-md-4 g-4" emptyTitle="No hay ofertas activas" />
      </div>
    </section>
  );
}
