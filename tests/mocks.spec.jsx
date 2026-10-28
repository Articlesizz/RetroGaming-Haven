// Pruebas con MOCKS (dobles de prueba de Jasmine). Cada bloque indica qué se simula y por qué:
//  - spyOn(window, 'fetch'):       evita llamar a las APIs públicas reales (lentas, sin garantía de red).
//  - jasmine.clock():              controla el tiempo (carrusel de 5 s, avisos de 3 s) sin esperar de verdad.
//  - jasmine.clock().mockDate():   fija "hoy" para que los indicadores del mes sean reproducibles.
//  - spyOn(window, 'FileReader'):  fuerza el error de lectura de una imagen.
//  - spyOn(window, 'print'):       evita abrir el diálogo de impresión del navegador.
//  - almacenamiento que lanza:     simula localStorage lleno o bloqueado.
//  - createSpy:                    verifica que un componente llama a su callback con el valor correcto.
import { act } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SEED_DB } from '../src/data/seed.js';
import { WishlistProvider, useWishlist } from '../src/context/WishlistContext.jsx';
import { ToastProvider, useToast } from '../src/context/ToastContext.jsx';
import Carousel from '../src/components/home/Carousel.jsx';
import ChartCanvas from '../src/components/reports/ChartCanvas.jsx';
import ImageField from '../src/components/common/ImageField.jsx';
import QuantityInput from '../src/components/common/QuantityInput.jsx';
import { ProductCreatePage, ProductEditPage, ProductShowPage } from '../src/pages/admin/ProductPages.jsx';
import PaymentSuccessPage from '../src/pages/public/PaymentSuccessPage.jsx';
import RegisterPage from '../src/pages/public/RegisterPage.jsx';
import { fetchCharacterUsers } from '../src/services/characterService.js';
import { categoryStyle } from '../src/utils/categoryStyle.js';
import { readImageFile, MAX_IMAGE_BYTES } from '../src/utils/imageFile.js';
import { formatDate, formatDateTime, formatPrice } from '../src/utils/money.js';
import { dashboardOverview } from '../src/utils/reports.js';
import { formatRun, makeRun } from '../src/utils/run.js';
import { REGION_NAMES, comunasDeRegion } from '../src/utils/geo.js';
import { buttonWithText, changeSelect, click, render, submitForm, typeText } from './helpers/dom.js';
import { renderWithProviders } from './helpers/providers.jsx';

const okJson = (body) => Promise.resolve({ ok: true, json: () => Promise.resolve(body) });

describe('Mock de red: fetch (listado de personajes)', () => {
  it('une Rick and Morty y PokéAPI sin salir a internet', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.callFake((url) =>
      String(url).includes('rickandmortyapi')
        ? okJson({ results: [{ id: 1, name: 'Rick Sanchez', image: 'rick.png' }] })
        : okJson({ name: 'pikachu', sprites: { front_default: 'p.png' } }),
    );
    const result = await fetchCharacterUsers();
    expect(result.errors).toEqual([]);
    expect(result.users.length).toBe(1 + 50);
    expect(fetchSpy).toHaveBeenCalledTimes(51);
    expect(result.users[0].name).toBe('Rick Sanchez');
  });

  it('si una API responde con error, informa la fuente y conserva los datos de la otra', async () => {
    spyOn(window, 'fetch').and.callFake((url) =>
      String(url).includes('rickandmortyapi')
        ? okJson({ results: [{ id: 2, name: 'Morty Smith', image: 'm.png' }] })
        : Promise.resolve({ ok: false, status: 500 }),
    );
    const result = await fetchCharacterUsers();
    expect(result.errors).toEqual(['PokéAPI']);
    expect(result.users.length).toBe(1);
  });

  it('si la red falla del todo, devuelve ambas fuentes como error y ningún usuario', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('sin red')));
    const result = await fetchCharacterUsers();
    expect(result.users).toEqual([]);
    expect(result.errors.length).toBe(2);
  });
});

describe('Mock de tiempo: jasmine.clock()', () => {
  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  it('el carrusel avanza solo cada 5 segundos', () => {
    const view = renderWithProviders(<Carousel products={SEED_DB.products} />);
    const active = () => view.host.querySelector('.carousel-item.active h2').textContent;
    const first = active();
    act(() => jasmine.clock().tick(4900));
    expect(active()).toBe(first);
    act(() => jasmine.clock().tick(200));
    expect(active()).not.toBe(first);
    view.unmount();
  });

  it('el aviso (toast) desaparece solo a los 3 segundos', () => {
    function Notifier() {
      const { notify } = useToast();
      return <button type="button" onClick={() => notify('Producto añadido')}>avisar</button>;
    }
    const view = render(
      <ToastProvider>
        <Notifier />
      </ToastProvider>,
    );
    click(buttonWithText(view.host, 'avisar'));
    expect(view.host.textContent).toContain('Producto añadido');
    act(() => jasmine.clock().tick(3100));
    expect(view.host.textContent).not.toContain('Producto añadido');
    view.unmount();
  });

  it('los indicadores del mes dependen de la fecha simulada', () => {
    const paid = SEED_DB.orders.filter((order) => order.status === 'pagado');
    jasmine.clock().mockDate(new Date(2026, 5, 15));
    const june = paid.filter((order) => order.createdAt.startsWith('2026-06')).reduce((sum, order) => sum + order.total, 0);
    expect(dashboardOverview(SEED_DB).monthSales).toBe(june);
    jasmine.clock().mockDate(new Date(2019, 0, 10));
    expect(dashboardOverview(SEED_DB).monthSales).toBe(0);
  });
});

describe('Mock de archivos: FileReader e imágenes', () => {
  it('readImageFile devuelve null sin archivo y rechaza lo que no es imagen o es muy grande', async () => {
    expect(await readImageFile(null)).toBeNull();
    await expectAsync(readImageFile(new File(['x'], 'a.txt', { type: 'text/plain' }))).toBeRejectedWithError('El archivo debe ser una imagen.');
    const big = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'big.png', { type: 'image/png' });
    await expectAsync(readImageFile(big)).toBeRejectedWithError('La imagen no puede superar los 300 KB.');
  });

  it('readImageFile convierte una imagen válida en data URL', async () => {
    const dataUrl = await readImageFile(new File(['abc'], 'a.png', { type: 'image/png' }));
    expect(dataUrl.startsWith('data:image/png')).toBeTrue();
  });

  it('readImageFile informa si el navegador no puede leer el archivo (FileReader simulado)', async () => {
    spyOn(window, 'FileReader').and.callFake(function FakeReader() {
      this.readAsDataURL = () => this.onerror();
    });
    await expectAsync(readImageFile(new File(['abc'], 'a.png', { type: 'image/png' }))).toBeRejectedWithError('No se pudo leer la imagen.');
  });

  const pickFile = async (input, file) => {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    await act(async () => {
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      // FileReader termina de forma asíncrona: se espera a que entregue el resultado.
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
  };

  it('ImageField entrega la data URL al elegir una imagen y muestra el error si no es imagen', async () => {
    const onChange = jasmine.createSpy('onChange');
    const view = render(<ImageField id="img" label="Imagen" value="" onChange={onChange} />);
    const input = view.host.querySelector('#img');
    await pickFile(input, new File(['abc'], 'a.png', { type: 'image/png' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.calls.mostRecent().args[0].startsWith('data:image/png')).toBeTrue();
    await pickFile(input, new File(['x'], 'a.txt', { type: 'text/plain' }));
    expect(view.host.textContent).toContain('El archivo debe ser una imagen.');
    view.unmount();
  });

  it('ImageField muestra la vista previa y "Quitar imagen" limpia el valor', () => {
    const onChange = jasmine.createSpy('onChange');
    const view = render(<ImageField id="img" label="Imagen" value="data:image/png;base64,AAAA" onChange={onChange} />);
    expect(view.host.querySelector('img[alt="Vista previa"]')).not.toBeNull();
    click(buttonWithText(view.host, 'Quitar imagen'));
    expect(onChange).toHaveBeenCalledWith('');
    view.unmount();
  });
});

describe('Mock del navegador: print y almacenamiento', () => {
  it('"Imprimir boleta" llama a window.print (simulado)', () => {
    const printSpy = spyOn(window, 'print');
    const view = renderWithProviders(
      <Routes>
        <Route path="/comprar-ok/:orderId" element={<PaymentSuccessPage />} />
      </Routes>,
      { route: '/comprar-ok/ord-demo0001' },
    );
    click(buttonWithText(view.host, 'Imprimir boleta en PDF'));
    expect(printSpy).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('favoritos sigue funcionando si localStorage lanza error al guardar', () => {
    const warn = spyOn(console, 'warn');
    const failing = { getItem: () => null, setItem: () => { throw new Error('cuota llena'); }, removeItem: () => {} };
    let wishlist;
    function Probe() {
      wishlist = useWishlist();
      return null;
    }
    const view = render(
      <WishlistProvider storage={failing}>
        <Probe />
      </WishlistProvider>,
    );
    act(() => wishlist.toggle('3'));
    expect(wishlist.has('3')).toBeTrue();
    expect(warn).toHaveBeenCalled();
    view.unmount();
  });

  it('favoritos ignora datos corruptos guardados', () => {
    let wishlist;
    function Probe() {
      wishlist = useWishlist();
      return null;
    }
    const view = render(
      <WishlistProvider initialIds={[1, null, '7']} persist={false}>
        <Probe />
      </WishlistProvider>,
    );
    expect(wishlist.ids).toEqual(['7']);
    view.unmount();
  });
});

describe('Callbacks espiados (createSpy)', () => {
  it('QuantityInput nunca entrega un valor fuera de [min, max]', () => {
    const onChange = jasmine.createSpy('onChange');
    const view = render(<QuantityInput value={2} min={1} max={5} onChange={onChange} />);
    typeText(view.host.querySelector('input'), '99');
    expect(onChange).toHaveBeenCalledWith(5);
    typeText(view.host.querySelector('input'), '-4');
    expect(onChange).toHaveBeenCalledWith(1);
    click(buttonWithText(view.host, '+'));
    expect(onChange).toHaveBeenCalledWith(3);
    view.unmount();
  });

  it('QuantityInput deshabilita "+" en el máximo y "−" en el mínimo', () => {
    const view = render(<QuantityInput value={5} min={1} max={5} onChange={() => {}} />);
    expect(buttonWithText(view.host, '+').disabled).toBeTrue();
    view.unmount();
    const low = render(<QuantityInput value={1} min={1} max={5} onChange={() => {}} />);
    expect(buttonWithText(low.host, '−').disabled).toBeTrue();
    low.unmount();
  });
});

describe('Administración de productos (formulario completo)', () => {
  const routes = (
    <Routes>
      <Route path="/admin/producto/nuevo" element={<ProductCreatePage />} />
      <Route path="/admin/producto/:id" element={<ProductShowPage />} />
      <Route path="/admin/producto/:id/editar" element={<ProductEditPage />} />
    </Routes>
  );

  it('crear un producto válido lo guarda y abre su ficha', () => {
    const view = renderWithProviders(routes, { route: '/admin/producto/nuevo', session: 'u-admin' });
    typeText(view.host.querySelector('#producto-nombre'), 'Juego de Prueba');
    typeText(view.host.querySelector('#producto-descripcion'), 'Descripción de prueba');
    typeText(view.host.querySelector('#producto-precio'), '9990');
    typeText(view.host.querySelector('#producto-stock'), '12');
    click(view.host.querySelector('#producto-plataforma-PC'));
    changeSelect(view.host.querySelector('#producto-clasificacion'), '12');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('Juego de Prueba');
    view.unmount();
  });

  it('crear un producto sin nombre muestra el error y no navega', () => {
    const view = renderWithProviders(routes, { route: '/admin/producto/nuevo', session: 'u-admin' });
    submitForm(view.host.querySelector('form'));
    expect(view.host.querySelector('.is-invalid')).not.toBeNull();
    expect(view.host.textContent).toContain('Revisa los campos marcados.');
    view.unmount();
  });

  it('editar un producto cambia su nombre y conserva su ficha (plataformas)', () => {
    const original = SEED_DB.products.find((product) => product.id === '6');
    const view = renderWithProviders(routes, { route: '/admin/producto/6/editar', session: 'u-admin' });
    typeText(view.host.querySelector('#producto-nombre'), 'Red Dead (editado)');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('Red Dead (editado)');
    expect(original.plataformas.length).toBeGreaterThan(0);
    view.unmount();
  });

  it('el producto inexistente muestra el aviso en la ficha', () => {
    const view = renderWithProviders(routes, { route: '/admin/producto/999', session: 'u-admin' });
    expect(view.host.textContent.toLowerCase()).toContain('no encontrado');
    view.unmount();
  });
});

describe('Registro público (formulario completo)', () => {
  it('un registro válido crea la cuenta y deja la sesión iniciada', () => {
    const view = renderWithProviders(
      <Routes>
        <Route path="/crear-sesion" element={<RegisterPage />} />
        <Route path="/" element={<p>Inicio de la tienda</p>} />
      </Routes>,
      { route: '/crear-sesion' },
    );
    const region = REGION_NAMES[0];
    typeText(view.host.querySelector('#usuario-run'), formatRun(makeRun(15151515)));
    typeText(view.host.querySelector('#usuario-nacimiento'), '1995-05-05');
    typeText(view.host.querySelector('#usuario-nombre'), 'Ana');
    typeText(view.host.querySelector('#usuario-apellidos'), 'Pérez Soto');
    typeText(view.host.querySelector('#usuario-correo'), 'ana.registro@test.cl');
    typeText(view.host.querySelector('#usuario-password'), 'clave1234');
    typeText(view.host.querySelector('#usuario-confirmar'), 'clave1234');
    typeText(view.host.querySelector('#usuario-calle'), 'Calle 123');
    changeSelect(view.host.querySelector('#usuario-region'), region);
    changeSelect(view.host.querySelector('#usuario-comuna'), comunasDeRegion(region)[0]);
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).toContain('Inicio de la tienda');
    view.unmount();
  });

  it('un registro con contraseñas distintas no navega y marca el campo', () => {
    const view = renderWithProviders(
      <Routes>
        <Route path="/crear-sesion" element={<RegisterPage />} />
        <Route path="/" element={<p>Inicio de la tienda</p>} />
      </Routes>,
      { route: '/crear-sesion' },
    );
    typeText(view.host.querySelector('#usuario-password'), 'clave1234');
    typeText(view.host.querySelector('#usuario-confirmar'), 'otra-clave');
    submitForm(view.host.querySelector('form'));
    expect(view.host.textContent).not.toContain('Inicio de la tienda');
    expect(view.host.querySelector('#usuario-confirmar').classList.contains('is-invalid')).toBeTrue();
    view.unmount();
  });
});

describe('Utilidades de formato y presentación', () => {
  it('formatPrice usa separador de miles de Chile y 0 como valor por defecto', () => {
    expect(formatPrice(14693)).toBe('$14.693');
    expect(formatPrice(undefined)).toBe('$0');
  });

  it('formatDate y formatDateTime devuelven vacío sin valor y texto con valor', () => {
    expect(formatDate('')).toBe('');
    expect(formatDateTime(null)).toBe('');
    expect(formatDate('2026-03-15')).toContain('2026');
    expect(formatDateTime('2026-03-15T09:30:00')).toContain('15-03-26');
  });

  it('categoryStyle entrega ícono y colores para cualquier categoría', () => {
    const style = categoryStyle({ nombre: 'Categoría inventada', slug: 'categoria-inventada' });
    expect(style.icon).toMatch(/^bi-/);
    expect(style.from).toBeTruthy();
    expect(style.to).toBeTruthy();
  });

  it('ChartCanvas dibuja un canvas accesible y se desmonta sin errores', () => {
    const data = { labels: ['A', 'B'], datasets: [{ label: 'Valores', data: [1, 2] }] };
    const view = render(<ChartCanvas type="bar" data={data} options={{ animation: false }} label="Gráfico de prueba" />);
    expect(view.host.querySelector('canvas[aria-label="Gráfico de prueba"]')).not.toBeNull();
    expect(() => view.unmount()).not.toThrow();
  });
});
