// Carrusel de portada (Nuevos Lanzamientos, Ofertas Especiales, Juegos Más Vendidos del template).
// Las diapositivas se arman con el catálogo: portadas, mayor descuento y juegos gratis, así siempre muestran lo que hay a la venta.
// Estado propio: la diapositiva visible. Avanza solo cada 5 segundos; flechas e indicadores la cambian.
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bestDeals, discountPercent, freeGames, mostViewed, newest, productImageUrl } from '../../utils/catalog.js';

const INTERVAL_MS = 5000;

export function buildSlides(products) {
  const deals = bestDeals(products, 3);
  const free = freeGames(products).slice(0, 3);
  const sold = mostViewed(products, 3);
  return [
    { id: 'novedades', tema: 'hero-novedades', titulo: 'Nuevos Lanzamientos', texto: 'Descubre los últimos juegos disponibles en nuestra tienda.', enlace: '/productos?orden=recientes', cta: 'Ver novedades', portadas: newest(products, 3) },
    {
      id: 'ofertas',
      tema: 'hero-ofertas',
      titulo: 'Ofertas Especiales',
      texto: deals[0] ? `Hasta ${discountPercent(deals[0])}% de descuento en títulos seleccionados.` : 'Aprovecha nuestros descuentos exclusivos.',
      enlace: '/ofertas',
      cta: 'Ver ofertas',
      portadas: deals,
    },
    { id: 'populares', tema: 'hero-populares', titulo: 'Juegos Más Vendidos', texto: 'Explora los títulos más populares entre nuestros clientes.', enlace: '/productos', cta: 'Ver catálogo', portadas: sold },
    ...(free.length > 0
      ? [{ id: 'gratis', tema: 'hero-gratis', titulo: 'Juega Gratis', texto: 'Títulos free-to-play listos para descargar sin pagar nada.', enlace: '/productos', cta: 'Ver juegos gratis', portadas: free }]
      : []),
  ];
}

export default function Carousel({ products = [] }) {
  const slides = useMemo(() => buildSlides(products), [products]);
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const move = (step) => setIndex((previous) => (previous + step + count) % count);

  useEffect(() => {
    const timer = setInterval(() => setIndex((previous) => (previous + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section id="carouselWeb" className="carousel slide hero" aria-roledescription="carrusel" aria-label="Destacados">
      <div className="carousel-indicators">
        {slides.map((slide, position) => (
          <button
            key={slide.id}
            type="button"
            className={position === index ? 'active' : ''}
            aria-current={position === index}
            aria-label={`Ir a ${slide.titulo}`}
            onClick={() => setIndex(position)}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, position) => (
          <div key={slide.id} className={`carousel-item hero-slide ${slide.tema}${position === index ? ' active' : ''}`}>
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-12 col-md-6 hero-text">
                  <h2 className="display-5 fw-bold">{slide.titulo}</h2>
                  <p className="lead mb-4">{slide.texto}</p>
                  <Link to={slide.enlace} className="btn btn-light btn-lg fw-bold">
                    {slide.cta} <i className="bi bi-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
                <div className="col-md-6 d-none d-md-flex justify-content-center hero-covers" aria-hidden="true">
                  {slide.portadas.map((product) => (
                    <img key={product.id} src={productImageUrl(product)} alt="" className="hero-cover" loading="lazy" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={() => move(-1)}>
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={() => move(1)}>
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </section>
  );
}

Carousel.propTypes = {
  products: PropTypes.array,
};
