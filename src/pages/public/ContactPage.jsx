// Contacto (contacto.html del template): formulario validado. El envío es simulado. El mapa está en el pie.
import ContactForm from '../../components/forms/ContactForm.jsx';

export default function ContactPage() {
  return (
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
  );
}
