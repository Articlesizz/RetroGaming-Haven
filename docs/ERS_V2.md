# ERS V3 — RetroGaming Haven, tienda de videojuegos (Evaluación 2, React)

Versión 3.0 (final) · 2026-10-28 · Incluye la propuesta personalizada del equipo (sección 10).

Repositorio: <https://github.com/Articlesizz/RetroGaming-Haven>

Los puntos marcados **[Supuesto]** o **[Propuesta — pendiente de validación con el docente]** deben confirmarse con el docente.

Convención: **[Explícito]** = requisito literal del PDF · **[Template]** = detalle del template HTML (Anexo 3) o de las capturas · **[Propuesta]** = decisión del equipo · **[Supuesto]** = suposición por falta de información.

## 1. Alcance

- **[Explícito]** Evaluación 2 (30 %): migrar a React, nuevos flujos de navegación, pruebas unitarias con Jasmine y Karma.
- **[Template]** Base de partida: template HTML "Tienda de Videojuegos" (16 páginas públicas, admin con 20+ páginas, `data/productos.js`, `data/usuarios.js`, `data/zonas.js`).
- **[Supuesto]** No hay backend. Persistencia simulada en JavaScript y `localStorage`.
- **Dentro:** vistas públicas y administrativas del template y de la figura 3 y 10; carrito, checkout, resultados de pago simulados; CRUD de productos, categorías y usuarios; pruebas Jasmine/Karma.
- **Fuera:** backend real, autenticación segura, pasarela de pago real, envío real de correos, validez tributaria de la boleta.

## 2. Herramientas

| Área | Herramienta |
|---|---|
| UI | React 19, React Router 7 |
| Estilos | Bootstrap 5.3.3, Bootstrap Icons |
| Gráficos | Chart.js 4 |
| Build | Vite 8 |
| Pruebas | Jasmine 7 (jasmine-core), karma-jasmine 5, Karma 6, karma-webpack 5 con Babel (JSX) |
| Cobertura | karma-coverage + @jsdevtools/coverage-istanbul-loader (Istanbul), con umbral mínimo |
| Contrato de props | prop-types (verificado con pruebas) |

## 3. Actores

| Actor | Acceso |
|---|---|
| Visitante | Vistas públicas: catálogo, categorías, ofertas, carrito, blog, contacto |
| Cliente (`usuario`) | Lo anterior + checkout con datos precargados |
| Administrador (`admin`) | Lo anterior + panel `/admin` |
| Vendedor | Tipo de usuario del template (VENDEDOR); sin acceso al panel (decisión del equipo) |

## 4. Reglas de negocio

| ID | Regla | Origen |
|---|---|---|
| RN-01 | El precio final (`precio_nuevo`) es el que se cobra. El precio normal (`precio_descuento`) se muestra tachado si es mayor. | [Template] |
| RN-02 | Un precio final de 0 es **FREE**. Solo se puede añadir **un** producto gratis por compra y sin cambiar su cantidad. | [Template] (`carrito.html`) |
| RN-03 | No se pueden añadir más unidades que el stock. | [Template] |
| RN-04 | Un producto es crítico si su stock es menor o igual a su **stock crítico**, que se define en cada producto (por defecto 5). Estados: AGOTADO (sin stock) y SOLICITAR PRODUCTOS (bajo el crítico). | [Template] (campo "Stock crítico") + [Propuesta] (el PDF no define el umbral) |
| RN-05 | Al pagar se revalida el stock. Si falta, no se registra el pedido. | [Propuesta] |
| RN-06 | Pago rechazado: no vacía el carrito y conserva el borrador para reintentar. | [Explícito] |
| RN-07 | Pago aprobado: se registra una vez por intento (idempotente), descuenta stock y vacía el carrito. | [Explícito] + [Propuesta] |
| RN-08 | Totales recalculados desde las líneas más el despacho (2 990 en la demostración). | [Explícito] + [Propuesta] |
| RN-09 | No se elimina una categoría con productos. | [Propuesta] |
| RN-10 | No se elimina al último administrador. No se elimina la sesión activa desde el listado. | [Propuesta] |
| RN-11 | El correo de usuario es único. | [Propuesta] |
| RN-12 | Checkout con sesión: se precargan nombre, apellidos, correo y dirección. | [Explícito] + [Template] |
| RN-13 | `/admin` exige sesión con tipo administrador. | [Propuesta] |

## 5. Flujos

**Compra (figura 2 y 3, "COMPRAR").** Interpretación funcional: carrito → checkout → éxito/error. Esta equivalencia es inferida y debe confirmarla el docente.

1. Agregar desde catálogo, categoría, oferta o detalle.
2. Carrito: cantidades (± limitado al stock), eliminar con confirmación, vaciar, "Comprar ahora".
3. Checkout: resumen, datos, dirección (región y comuna desde `zonas.js`), entrega y pago simulado.
4. Aprobado → `/comprar-ok/:id` (boleta con imprimir y envío simulado).
5. Rechazado → `/comprar-error` con "Volver a realizar el pago".

**Administración (figura 10).** Dashboard → Órdenes (detalle de boleta); Productos (listado, nuevo, mostrar, editar, críticos, reportes); Categorías (listado, nueva, editar); Usuarios (listado, nuevo, mostrar, editar, historial); Reportes; Perfil.

**Anomalía de la figura 10.** La rama CATEGORÍA apunta a EDITAR USUARIO, tal como está impreso. El template incluye la vista "Editar categoría #2000" (`admin/categoria/2000`), así que se implementa *Editar categoría* en `/admin/categoria/:id/editar`. **[Propuesta — pendiente de validación con el docente]** Se interpreta el rótulo del diagrama como un error.

## 6. Requisitos funcionales

| ID | Requisito | Fuente |
|---|---|---|
| RF-01 | Convertir el template HTML en componentes React reutilizables con props y estado mínimo | [Explícito] |
| RF-02 | Fuente de datos JS con CRUD (crear, leer, actualizar, eliminar) | [Explícito] |
| RF-03 | Cambios reflejados en la interfaz y persistidos en `localStorage`; errores de lectura controlados | [Explícito] + [Propuesta] |
| RF-04 | Cabecera del template: buscador, Iniciar Sesión, Crear Cuenta, menú (Home, Categorías, Ofertas, Nosotros, Blog, Contacto), carrito con importe | [Template] |
| RF-05 | Carrusel de tres diapositivas con flechas e indicadores; sección de categorías | [Template] |
| RF-06 | Catálogo con búsqueda y filtros que actualizan resultados; detalle de producto | [Explícito] |
| RF-07 | Carrito con precio, cantidad, subtotal y total; eliminar; vaciar; continuar | [Explícito] + [Template] |
| RF-08 | Checkout con nombre, apellidos, correo, calle, departamento (opcional), región, comuna, indicaciones (opcional), entrega y botón de pago con importe | [Explícito] |
| RF-09 | Compra exitosa con identificador, código de orden, datos, tabla, total, imprimir y enviar por email | [Explícito] + [Template] |
| RF-10 | Pago fallido con mensaje, resumen y reintento | [Explícito] |
| RF-11 | Ofertas: todos los productos con precio rebajado | [Explícito] |
| RF-12 | Registro, inicio de sesión (credenciales del template) | [Template] |
| RF-13 | Nosotros, blog con dos entradas, contacto con validación | [Explícito] + [Template] |
| RF-14 | Dashboard con indicadores calculados y accesos a tienda y cierre de sesión | [Template] |
| RF-15 | Órdenes con detalle de boleta | [Template] |
| RF-16 | CRUD de productos, categorías y usuarios; críticos con umbral; reportes | [Explícito] + [Template] |
| RF-17 | Historial de compras por usuario | [Template] |
| RF-18 | Reportes con los 10 gráficos del template, calculados desde los datos | [Template] |
| RF-19 | Categorías: selector de tarjetas y productos de la categoría elegida | [Template] + [Figura 4] |
| RF-20 | Inicio con Productos (dos modelos de tarjeta), Los más vistos y Contacto; mapa en el pie | [Template] |
| RF-21 | Carrito con lista de productos y aviso "Vistas"; productos gratis (FREE) limitados a uno por compra | [Template] |
| RF-22 | Registro y usuarios con RUN (dígito verificador), fecha de nacimiento, contraseña repetida, imagen y dirección | [Template] |
| RF-23 | Perfil de usuario con estadísticas de compras e historial con detalle de cada orden | [Template] |
| RF-24 | Listado de personajes obtenido de APIs públicas (Rick and Morty y PokéAPI) | [Template] |
| RF-25 | Productos en formato tarjeta y críticos con stock crítico por producto | [Template] |
| RF-26 | Panel con cambio de tema claro/oscuro/automático | [Template] (`color-modes.js`) |

| RF-27 | Ficha del juego: plataformas, clasificación PEGI, año, desarrollador, valoración y reseña; editable desde el administrador | [Propuesta] |
| RF-28 | Filtro por plataforma y orden por valoración, descuento y novedad en el catálogo | [Propuesta] |
| RF-29 | Favoritos persistentes sin sesión, con contador en la cabecera | [Propuesta] |
| RF-30 | Inicio con ofertas de la semana, novedades, mejor valorados, accesos por plataforma y boletín simulado | [Propuesta] |
| RF-31 | Detalle de producto con juegos relacionados (misma categoría y plataformas en común) | [Propuesta] |
| RF-32 | Tras iniciar sesión o registrarse: aviso de bienvenida, redirección al origen y foco en el primer error | [Propuesta] |
| RF-33 | Dashboard con ventas del mes, ticket promedio, ventas por mes, más vendidos, alertas de stock y últimas órdenes | [Propuesta] |
| RF-34 | Filtros en los listados de productos, órdenes y usuarios del administrador | [Propuesta] |

## 7. Requisitos no funcionales

- **Responsivo:** Bootstrap (`row-cols-*`, `col-*`, `navbar-expand-lg`, offcanvas en móvil).
- **Accesibilidad:** etiquetas asociadas, `alt` en imágenes, `aria-live` en contadores, enlace "Saltar al contenido".
- **Estados visuales:** éxito, error, advertencia y vacío distinguibles (`StatusAlert`, `EmptyState`).
- **Pruebas reproducibles:** `npm test` en Chrome headless.
- **Sin datos reales:** pagos y correos simulados; imágenes marcadoras.

## 8. Criterios de aceptación

| ID | Criterio | Evidencia |
|---|---|---|
| CA-01 | `npm run build` termina sin errores | Build ejecutado |
| CA-02 | `npm test` pasa todas las pruebas | Ver `docs/TESTING_COVERAGE.md` |
| CA-07 | La cobertura de código cumple el umbral (sentencias, líneas y funciones ≥ 80 %, ramas ≥ 70 %) | `karma.conf.cjs` (`check`); cifras reales en `docs/TESTING_COVERAGE.md` |
| CA-08 | Cada componente principal tiene su contrato de props verificado | `tests/proptypes.spec.jsx` |
| CA-09 | Sin desbordes horizontales a 390, 768 y escritorio | Revisión en navegador (ver `docs/COMPONENTES.md`, sección 4) |
| CA-03 | Cada archivo HTML del template tiene su ruta React | Ver la tabla de rutas del `README.md` |
| CA-04 | Pago rechazado no vacía el carrito | Prueba de página de checkout |
| CA-05 | Reintentar el mismo intento no duplica el pedido | Prueba de pago y pedidos |
| CA-06 | Un visitante sin tipo administrador no abre `/admin` | `RequireAdmin` (revisado en el navegador) |

## 9. Alcance de las pruebas (resumen)

Pruebas unitarias con Jasmine y Karma sobre lógica pura, componentes, páginas y administración, con mocks (red, tiempo, fecha, lectura de archivos, impresión y almacenamiento). El detalle, la cobertura medida y los límites están en `docs/TESTING_COVERAGE.md`. El diseño de componentes (props, estado y responsividad) está en `docs/COMPONENTES.md`.

## 10. Propuesta personalizada del equipo

El template solo entrega una tienda genérica de ejemplo. Estas son las decisiones propias del equipo para convertirla en una **tienda de videojuegos completa**. Todas son **[Propuesta]**: no vienen del template y deben presentarse como aporte del equipo.

| Área | Qué se propone | Requisitos | Por qué |
|---|---|---|---|
| Identidad | Marca RetroGaming Haven, logo dibujado, tema oscuro de tienda de juegos, carrusel armado con el catálogo | RF-04, RF-05 | El template mostraba imágenes de otro rubro (una biblioteca de libros) y un logo marcador. |
| Ficha del juego | Plataformas, clasificación PEGI, año, desarrollador, valoración y reseña; editable en el administrador | RF-27 | Es la información que un comprador de videojuegos busca antes de comprar. |
| Descubrimiento | Filtro por plataforma, orden por valoración, descuento y novedad, juegos relacionados, favoritos | RF-28, RF-29, RF-31 | Reduce el esfuerzo de encontrar un juego. |
| Inicio | Ofertas de la semana, novedades, mejor valorados, accesos por plataforma y boletín (simulado) | RF-30 | Una tienda real destaca ofertas y lanzamientos. |
| Sesión | Aviso de bienvenida, redirección al origen y foco en el primer error del formulario largo de registro | RF-32 | Se detectó que el registro parecía no responder cuando el error quedaba fuera de pantalla. |
| Administración | Dashboard con ventas, ticket promedio, más vendidos, alertas de stock y últimas órdenes; filtros en productos, órdenes y usuarios; menú con contadores | RF-33, RF-34 | Permite gestionar la tienda sin abrir cada módulo. |
| Calidad | Cobertura de código medida con umbral, mocks y contrato de props verificado | CA-07, CA-08 | Respalda la calidad con evidencia medible. |

### Límites de la propuesta (declarados)

- Las valoraciones de los juegos, las órdenes de ejemplo y las visitas son **datos de demostración**.
- El pago, el correo de la boleta, el contacto, la recuperación de contraseña y el boletín son **simulaciones**: no hay backend.
- No se incluyeron reseñas de usuarios, comparador de juegos ni estados de orden (pagado, enviado, entregado); quedan como mejoras futuras.
