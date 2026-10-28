// Marca de la tienda: ícono de control y nombre. Se dibuja con Bootstrap Icons, sin imágenes externas.
export const BRAND_NAME = 'RetroGaming Haven';

export default function Brand({ className = '' }) {
  return (
    <span className={`brand-logo d-inline-flex align-items-center gap-2 ${className}`}>
      <span className="brand-mark" aria-hidden="true">
        <i className="bi bi-controller" />
      </span>
      <span className="brand-name">
        Retro<span>Gaming</span> Haven
      </span>
    </span>
  );
}
