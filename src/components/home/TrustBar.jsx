// Franja de ventajas bajo el carrusel. Las condiciones coinciden con las reglas de la demostración (despacho 2.990, retiro gratis).
const ITEMS = [
  { icon: 'bi-truck', title: 'Despacho a todo Chile', text: 'Retiro gratis o despacho a domicilio' },
  { icon: 'bi-shield-check', title: 'Compra segura', text: 'Pago simulado de demostración' },
  { icon: 'bi-box-seam', title: 'Stock real', text: 'Verificamos disponibilidad al pagar' },
  { icon: 'bi-headset', title: 'Atención al cliente', text: 'Escríbenos desde Contacto' },
];

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Ventajas de comprar aquí">
      <div className="container">
        <ul className="row row-cols-2 row-cols-lg-4 g-3 list-unstyled mb-0">
          {ITEMS.map((item) => (
            <li key={item.title} className="col d-flex align-items-center gap-3">
              <i className={`bi ${item.icon} fs-2 text-primary`} aria-hidden="true" />
              <div>
                <strong className="d-block">{item.title}</strong>
                <small className="text-secondary">{item.text}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
