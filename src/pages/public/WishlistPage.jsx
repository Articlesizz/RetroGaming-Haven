// Favoritos: los juegos guardados con el corazón. Se conservan en este navegador (localStorage), sin necesidad de sesión.
import { useStore } from '../../context/StoreContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';

export default function WishlistPage() {
  const { db } = useStore();
  const { ids } = useWishlist();
  const saved = db.products.filter((product) => ids.includes(product.id));

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-1">
          <i className="bi bi-heart-fill text-danger me-2" aria-hidden="true" />
          Mis favoritos
        </h2>
        <p className="text-secondary mb-4" aria-live="polite">
          {saved.length} juego(s) guardado(s)
        </p>
        {saved.length === 0 ? (
          <EmptyState title="Aún no tienes favoritos" description="Toca el corazón de un juego para guardarlo aquí." actionLabel="Explorar el catálogo" actionTo="/productos" />
        ) : (
          <ProductGrid products={saved} categories={db.categories} variant="add" cols="row-cols-2 row-cols-md-4 g-4" />
        )}
      </div>
    </section>
  );
}
