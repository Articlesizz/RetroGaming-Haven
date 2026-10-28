// Componentes: renderizado de listas, renderizado condicional, props, estado de formularios y eventos.
import { useCart } from '../src/context/CartContext.jsx';
import { SEED_DB } from '../src/data/seed.js';
import AppButton from '../src/components/common/AppButton.jsx';
import QuantityInput from '../src/components/common/QuantityInput.jsx';
import StatusAlert from '../src/components/common/StatusAlert.jsx';
import ProductCard from '../src/components/products/ProductCard.jsx';
import ProductGrid from '../src/components/products/ProductGrid.jsx';
import CategoryGrid from '../src/components/home/CategoryGrid.jsx';
import ContactForm from '../src/components/forms/ContactForm.jsx';
import LoginForm from '../src/components/forms/LoginForm.jsx';
import { buttonWithText, click, render, submitForm, typeText } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

function CartProbe() {
  const { lines } = useCart();
  return <output data-testid="lineas">{lines.map((line) => `${line.productId}:${line.quantity}`).join(',')}</output>;
}

describe('Renderizado', () => {
  it('ProductGrid muestra todos los productos recibidos', () => {
    const products = SEED_DB.products.slice(0, 4);
    const view = renderWithProviders(<ProductGrid products={products} categories={SEED_DB.categories} />);
    expect(view.host.querySelectorAll('.product-card').length).toBe(4);
    products.forEach((product) => expect(view.host.textContent).toContain(product.nombre));
    view.unmount();
  });

  it('ProductGrid muestra un estado vacío cuando no recibe productos', () => {
    const view = renderWithProviders(<ProductGrid products={[]} categories={SEED_DB.categories} />);
    expect(view.host.querySelectorAll('.product-card').length).toBe(0);
    expect(view.host.textContent).toContain('No hay productos para mostrar');
    view.unmount();
  });

  it('CategoryGrid muestra una tarjeta por cada categoría', () => {
    const view = renderWithProviders(<CategoryGrid categories={SEED_DB.categories} products={SEED_DB.products} />);
    expect(view.host.querySelectorAll('a[href^="/categorias/"]').length).toBe(SEED_DB.categories.length);
    view.unmount();
  });

  it('StatusAlert muestra el error solo cuando hay un mensaje de error', () => {
    const vacio = render(<StatusAlert status="error" message="" />);
    expect(vacio.host.querySelector('.alert')).toBeNull();
    vacio.unmount();

    const conError = render(<StatusAlert status="error" message="El pago fue rechazado" />);
    expect(conError.host.querySelector('.alert-danger').textContent).toContain('El pago fue rechazado');
    conError.unmount();
  });

  it('StatusAlert distingue el éxito de los errores con clases distintas', () => {
    const view = render(<StatusAlert status="success" message="Guardado" />);
    expect(view.host.querySelector('.alert-success')).not.toBeNull();
    expect(view.host.querySelector('.alert-danger')).toBeNull();
    view.unmount();
  });
});

describe('Props y eventos', () => {
  it('AppButton recibe la etiqueta y ejecuta el callback onClick al hacer clic', () => {
    const onClick = jasmine.createSpy('onClick');
    const view = render(<AppButton label="Agregar al Carrito" onClick={onClick} />);
    const button = view.host.querySelector('button');
    expect(button.textContent).toBe('Agregar al Carrito');
    click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('AppButton aplica la variante recibida por props', () => {
    const view = render(<AppButton label="Borrar" variant="danger" onClick={() => {}} />);
    expect(view.host.querySelector('button').classList).toContain('btn-danger');
    view.unmount();
  });

  it('AppButton deshabilitado no ejecuta onClick', () => {
    const onClick = jasmine.createSpy('onClick');
    const view = render(<AppButton label="No disponible" disabled onClick={onClick} />);
    click(view.host.querySelector('button'));
    expect(onClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it('QuantityInput llama onChange con la cantidad incrementada al pulsar +', () => {
    const onChange = jasmine.createSpy('onChange');
    const view = render(<QuantityInput value={2} onChange={onChange} />);
    click(buttonWithText(view.host, '+'));
    expect(onChange).toHaveBeenCalledWith(3);
    view.unmount();
  });

  it('QuantityInput no baja de la cantidad mínima', () => {
    const view = render(<QuantityInput value={1} min={1} onChange={() => {}} />);
    expect(buttonWithText(view.host, '−').disabled).toBeTrue();
    view.unmount();
  });

  it('el clic en "Añadir" de una tarjeta de producto agrega el producto al carrito', () => {
    const zelda = SEED_DB.products.find((product) => product.id === '1');
    const view = renderWithProviders(
      <>
        <ProductCard product={zelda} categoryName="Aventura" variant="add" />
        <CartProbe />
      </>,
    );
    expect(view.host.querySelector('[data-testid="lineas"]').textContent).toBe('');
    click(buttonWithText(view.host, 'Añadir'));
    expect(view.host.querySelector('[data-testid="lineas"]').textContent).toBe('1:1');
    view.unmount();
  });

  it('"Añadir" queda deshabilitado cuando el producto no tiene stock', () => {
    const sinStock = { ...SEED_DB.products[0], stock: 0 };
    const view = renderWithProviders(<ProductCard product={sinStock} categoryName="Aventura" variant="add" showStock />);
    expect(buttonWithText(view.host, 'Añadir').disabled).toBeTrue();
    expect(view.host.textContent).toContain('Agotado');
    view.unmount();
  });
});

describe('Estado de formularios', () => {
  it('ContactForm actualiza su estado cuando el usuario escribe', () => {
    const view = renderWithProviders(<ContactForm />);
    const name = view.host.querySelector('#nombre-contacto');
    const message = view.host.querySelector('#mensaje-contacto');
    typeText(name, 'Ana Pérez');
    typeText(message, 'Quisiera saber si tienen stock hoy.');
    expect(name.value).toBe('Ana Pérez');
    expect(message.value).toBe('Quisiera saber si tienen stock hoy.');
    view.unmount();
  });

  it('ContactForm muestra el error de validación solo después de enviar con datos inválidos', () => {
    const view = renderWithProviders(<ContactForm />);
    expect(view.host.querySelector('.invalid-feedback')).toBeNull();
    submitForm(view.host.querySelector('form'));
    expect(view.host.querySelector('.invalid-feedback').textContent).toBe('Tu nombre es obligatorio.');
    typeText(view.host.querySelector('#nombre-contacto'), 'Ana');
    submitForm(view.host.querySelector('form'));
    expect(view.host.querySelector('#nombre-contacto').classList).not.toContain('is-invalid');
    view.unmount();
  });

  it('LoginForm refleja el usuario escrito y muestra error con credenciales incorrectas', () => {
    const view = renderWithProviders(<LoginForm onSubmit={() => null} />);
    const username = view.host.querySelector('#username');
    typeText(username, 'nadie');
    expect(username.value).toBe('nadie');
    typeText(view.host.querySelector('#password'), 'clave');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('Usuarios o Contraseña mal ingresados.');
    view.unmount();
  });
});
