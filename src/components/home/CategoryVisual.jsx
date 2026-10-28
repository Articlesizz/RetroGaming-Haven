// Imagen de una categoría: la subida desde el admin o, si no hay, un bloque con degradado e ícono (sin imágenes con derechos).
import { categoryStyle } from '../../utils/categoryStyle.js';

export default function CategoryVisual({ category, height = 100, className = '' }) {
  if (category.imagen) {
    return <img src={category.imagen} alt={`Imagen de la categoría ${category.nombre}`} className={className} style={{ height, width: '100%', objectFit: 'cover' }} />;
  }
  const { icon, from, to } = categoryStyle(category);
  return (
    <div
      role="img"
      aria-label={`Ícono de la categoría ${category.nombre}`}
      className={`d-flex align-items-center justify-content-center text-white ${className}`}
      style={{ height, width: '100%', background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: Math.round(height / 2.4) }}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
    </div>
  );
}
