// Inicio (index.html del template, ampliado como tienda de juegos): carrusel de portada, ventajas, plataformas, ofertas,
// categorías, novedades (modelo 1 de tarjeta), mejor valorados (modelo 2), "Los más vistos", boletín y contacto.
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import Carousel from '../../components/home/Carousel.jsx';
import CategoryGrid from '../../components/home/CategoryGrid.jsx';
import Newsletter from '../../components/home/Newsletter.jsx';
import PlatformShortcuts from '../../components/home/PlatformShortcuts.jsx';
import TrustBar from '../../components/home/TrustBar.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import ContactForm from '../../components/forms/ContactForm.jsx';
import { bestDeals, mostViewed, newest, topRated } from '../../utils/catalog.js';

const SIX_COLUMNS = 'row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-3';
const FOUR_COLUMNS = 'row-cols-2 row-cols-md-4 g-4';

function SectionTitle({ id, title, subtitle, to, linkLabel }) {
  return (
    <div className="section-title d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
      <div>
        <h2 id={id} className="mb-0">
          {title}
        </h2>
        {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="btn btn-outline-dark btn-sm">
          {linkLabel} <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const { db } = useStore();
  const { products, categories } = db;
  const viewed = mostViewed(products, 8);

  return (
    <>
      <h1 className="visually-hidden">RetroGaming Haven, tienda de videojuegos</h1>
      <Carousel products={products} />
      <TrustBar />

      <section className="py-5" aria-label="Comprar por plataforma">
        <div className="container">
          <SectionTitle title="Juega en tu plataforma" subtitle="Encuentra juegos para tu consola o tu PC" />
          <PlatformShortcuts products={products} />
        </div>
      </section>

      <section id="ofertas-home" className="py-5 bg-light" aria-labelledby="titulo-ofertas">
        <div className="container">
          <SectionTitle id="titulo-ofertas" title="Ofertas de la semana" subtitle="Los mayores descuentos del catálogo" to="/ofertas" linkLabel="Ver todas" />
          <ProductGrid products={bestDeals(products, 4)} categories={categories} variant="add" cols={FOUR_COLUMNS} />
        </div>
      </section>

      <section id="categorias" className="py-5" aria-labelledby="titulo-categorias">
        <div className="container">
          <SectionTitle id="titulo-categorias" title="Categorías" subtitle="Elige tu género favorito" to="/categorias" linkLabel="Ver todas" />
          <CategoryGrid categories={categories} products={products} />
        </div>
      </section>

      <section id="productos" className="py-5 bg-light" aria-labelledby="titulo-productos">
        <div className="container">
          {/* Modelo 1: tarjeta con botón "Ver". Modelo 2: toda la tarjeta es un enlace. */}
          <SectionTitle id="titulo-productos" title="Novedades" subtitle="Los lanzamientos más recientes" to="/productos?orden=recientes" linkLabel="Ver más" />
          <ProductGrid products={newest(products, 6)} categories={categories} variant="ver" cols={SIX_COLUMNS} />
          <div className="mt-5">
            <SectionTitle title="Mejor valorados" subtitle="Lo que más gusta a los jugadores" to="/productos?orden=valoracion" linkLabel="Ver más" />
            <ProductGrid products={topRated(products, 6)} categories={categories} variant="click" cols={SIX_COLUMNS} />
          </div>
        </div>
      </section>

      <section className="py-5" aria-labelledby="titulo-vistos">
        <div className="container">
          <SectionTitle id="titulo-vistos" title="Los más vistos" subtitle="Lo que más están mirando ahora" to="/productos" linkLabel="Ver catálogo completo" />
          <ProductGrid products={viewed.slice(0, 4)} categories={categories} variant="click" cols={`${FOUR_COLUMNS} mb-4`} />
          <ProductGrid products={viewed.slice(4, 8)} categories={categories} variant="ver" cols={FOUR_COLUMNS} />
        </div>
      </section>

      <Newsletter />

      <section id="contacto" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Contacto</h2>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
