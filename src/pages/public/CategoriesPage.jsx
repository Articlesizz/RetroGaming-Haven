// Categorías (categorias.html del template): selector de tarjetas (100x100) y productos de la categoría elegida.
// Sirve a /categorias (primera categoría) y a /categorias/:slug.
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import CategoryNav from '../../components/home/CategoryNav.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import { filterProducts } from '../../utils/catalog.js';

export default function CategoriesPage() {
  const { slug } = useParams();
  const { db } = useStore();
  const category = slug ? db.categories.find((item) => item.slug === slug) : db.categories[0];

  if (db.categories.length === 0) {
    return <EmptyState title="Aún no hay categorías" actionLabel="Volver al inicio" actionTo="/" />;
  }
  if (!category) {
    return <EmptyState title="Categoría no encontrada" description="Elige una categoría del listado." actionLabel="Ver categorías" actionTo="/categorias" />;
  }

  const products = filterProducts(db.products, { categoryId: category.id });

  return (
    <div className="page-gray pb-5">
      <div className="container pt-5">
        <CategoryNav categories={db.categories} activeSlug={category.slug} />
      </div>
      <section id="productos" className="py-5">
        <div className="container">
          <h2 className="mb-1">{category.nombre}</h2>
          <p className="text-muted mb-4">{category.descripcion}</p>
          <ProductGrid products={products} categories={db.categories} variant="add" cols="row-cols-2 row-cols-md-4 g-4" emptyTitle={`No hay productos en ${category.nombre}`} />
        </div>
      </section>
    </div>
  );
}
