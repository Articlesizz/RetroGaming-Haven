# Cobertura del testing — RetroGaming Haven (React)

Generado el 2026-10-28 con `scripts/gen-testing-doc.cjs` a partir de la última ejecución de `npm test`. Todas las cifras salen de los archivos de pruebas y de la medición de Istanbul; ninguna se escribió a mano.

Herramientas: Jasmine (jasmine-core 7) + karma-jasmine 5 + Karma 6 · Chrome headless · Babel + webpack (karma-webpack) · cobertura con `karma-coverage` y `@jsdevtools/coverage-istanbul-loader`.

## 1. Resultado

| Concepto | Valor |
|---|---|
| Pruebas ejecutadas | 192 |
| Aprobadas | 192 |
| Fallidas | 0 |
| Archivos de prueba | 12 |
| Cobertura de sentencias (statements) | **88.75 % (1287/1450)** |
| Cobertura de ramas (branches) | **78.41 % (839/1070)** |
| Cobertura de funciones | **89.23 % (489/548)** |
| Cobertura de líneas | **89.79 % (1030/1147)** |
| Umbral mínimo exigido (`karma.conf.cjs`) | sentencias 80 %, líneas 80 %, funciones 80 %, ramas 70 % (si baja, `npm test` falla) |

Reporte navegable: `coverage/html/index.html` (se crea al ejecutar `npm test`).

## 2. Cómo reproducirlo

```bash
npm install
npm test              # ejecuta Jasmine en Karma y mide la cobertura
npm run docs:testing  # regenera este documento con las cifras de esa ejecución
```

## 3. Qué se prueba (alcance)

| Capa | Qué se verifica | Archivo de pruebas |
|---|---|---|
| Lógica pura (sin DOM) | Repositorio CRUD, validadores (RUN módulo 11, correo, producto, registro), catálogo (filtros, orden, descuento, relacionados), carrito (stock, producto gratis), pago simulado e idempotencia del pedido, reportes y filtros del administrador | `repository`, `validators`, `cart-catalog`, `payment-order`, `storage`, `tienda-juegos` |
| Componentes (DOM real) | Renderizado de listas y mensajes condicionales, props y callbacks, estado de formularios, clics, cantidad con límites | `components.spec.jsx` |
| Contrato de props | Cada componente principal acepta sus props válidas y avisa ante props inválidas (PropTypes) | `proptypes.spec.jsx` |
| Páginas y flujos | Inicio, catálogo, detalle, carrito, checkout (aprobado y rechazado), login, registro, favoritos, rutas protegidas | `pages`, `template-features`, `tienda-juegos` |
| Administración | CRUD de productos, categorías y usuarios con sus reglas, formularios completos, filtros, dashboard | `admin-crud`, `mocks`, `tienda-juegos` |
| Mocks | Red, tiempo, fecha, lectura de archivos, impresión y almacenamiento que falla | `mocks.spec.jsx` |

### Pruebas por archivo

| Archivo | Pruebas |
|---|---|
| `tests/admin-crud.spec.jsx` | 9 |
| `tests/cart-catalog.spec.js` | 17 |
| `tests/components.spec.jsx` | 15 |
| `tests/mocks.spec.jsx` | 26 |
| `tests/pages.spec.jsx` | 15 |
| `tests/payment-order.spec.jsx` | 6 |
| `tests/proptypes.spec.jsx` | 24 |
| `tests/repository.spec.js` | 6 |
| `tests/storage.spec.js` | 7 |
| `tests/template-features.spec.jsx` | 25 |
| `tests/tienda-juegos.spec.jsx` | 19 |
| `tests/validators.spec.js` | 23 |

## 4. Mocks utilizados

| Técnica | Usos en las pruebas | Para qué |
|---|---|---|
| `spyOn(...)` (red, `FileReader`, `print`, `confirm`, `console`) | 13 | Aislar del navegador y de internet; comprobar llamadas |
| `jasmine.createSpy(...)` | 7 | Verificar que un componente llama a su callback con el valor correcto |
| `jasmine.clock().install()` | 1 | Controlar el tiempo (carrusel de 5 s, avisos de 3 s) sin esperar |
| `jasmine.clock().mockDate(...)` | 3 | Fijar "hoy" para indicadores mensuales reproducibles |
| Almacenamiento en memoria / que lanza error | varios | Simular `localStorage` normal, lleno o bloqueado |

## 5. Cobertura por carpeta (sentencias)

| Carpeta | Archivos | Cobertura |
|---|---|---|
| `src/components/admin` | 6 | 74.3 % |
| `src/components/cart` | 3 | 63.6 % |
| `src/components/checkout` | 2 | 87.5 % |
| `src/components/common` | 9 | 97.6 % |
| `src/components/forms` | 5 | 85.9 % |
| `src/components/home` | 8 | 89.5 % |
| `src/components/layout` | 1 | 100.0 % |
| `src/components/products` | 6 | 85.7 % |
| `src/components/reports` | 2 | 77.8 % |
| `src/context` | 5 | 78.1 % |
| `src/data` | 6 | 97.0 % |
| `src/pages/admin` | 1 | 77.4 % |
| `src/pages/public` | 10 | 89.0 % |
| `src/services` | 5 | 92.2 % |
| `src/utils` | 12 | 95.9 % |

### Archivos con menor cobertura (sinceridad del análisis)

| Archivo | Cobertura | Sentencias |
|---|---|---|
| `src/components/cart/ProductPicker.jsx` | 53.8 % | 13 |
| `src/services/normalize.js` | 62.5 % | 8 |
| `src/pages/public/ProductDetailPage.jsx` | 63.6 % | 22 |
| `src/context/StoreContext.jsx` | 66.1 % | 121 |
| `src/components/products/ProductFilters.jsx` | 71.4 % | 14 |
| `src/pages/admin/ProductPages.jsx` | 77.4 % | 62 |
| `src/components/admin/FilterBar.jsx` | 77.8 % | 9 |
| `src/components/products/ProductCard.jsx` | 77.8 % | 18 |

Interpretación: la lógica de negocio (utilidades, servicios y contextos) concentra la cobertura más alta. Lo menos cubierto son pantallas de administración con muchas ramas de interfaz (por ejemplo, avisos tras eliminar) y partes del almacén de datos que solo se ejecutan en casos poco frecuentes.

## 6. Tabla de pruebas

Columnas: ID · Archivo · Bloque · Prueba · Estado. Resultado observado: coincide con el esperado en todas las filas.

| ID | Archivo | Bloque | Prueba | Estado |
|---|---|---|---|---|
| T001 | `tests/admin-crud.spec.jsx` | CRUD de administración | crear: un producto válido se agrega a la base | Aprobado |
| T002 | `tests/admin-crud.spec.jsx` | CRUD de administración | crear: un producto inválido devuelve errores y no se guarda | Aprobado |
| T003 | `tests/admin-crud.spec.jsx` | CRUD de administración | actualizar: el cambio de precio se refleja en el store | Aprobado |
| T004 | `tests/admin-crud.spec.jsx` | CRUD de administración | actualizar: el precio normal no puede ser menor que el precio final | Aprobado |
| T005 | `tests/admin-crud.spec.jsx` | CRUD de administración | eliminar: no se borra una categoría que tiene productos | Aprobado |
| T006 | `tests/admin-crud.spec.jsx` | CRUD de administración | eliminar: no se borra al último administrador | Aprobado |
| T007 | `tests/admin-crud.spec.jsx` | CRUD de administración | crear usuario: el correo debe ser único | Aprobado |
| T008 | `tests/admin-crud.spec.jsx` | CRUD de administración | la lista de productos quita la fila tras confirmar el borrado | Aprobado |
| T009 | `tests/admin-crud.spec.jsx` | CRUD de administración | cancelar la confirmación no elimina el producto | Aprobado |
| T010 | `tests/cart-catalog.spec.js` | Carrito | añade un producto nuevo y suma cantidades si ya existe | Aprobado |
| T011 | `tests/cart-catalog.spec.js` | Carrito | cambia la cantidad y elimina la línea si la cantidad no es positiva | Aprobado |
| T012 | `tests/cart-catalog.spec.js` | Carrito | elimina una línea concreta | Aprobado |
| T013 | `tests/cart-catalog.spec.js` | Carrito | descarta líneas guardadas inválidas y duplicadas | Aprobado |
| T014 | `tests/cart-catalog.spec.js` | Carrito | impide añadir más unidades que el stock | Aprobado |
| T015 | `tests/cart-catalog.spec.js` | Carrito | solo permite un producto gratis por compra | Aprobado |
| T016 | `tests/cart-catalog.spec.js` | Carrito | calcula subtotales con el precio final y suma productos gratis con subtotal 0 | Aprobado |
| T017 | `tests/cart-catalog.spec.js` | Carrito | omite líneas de productos que ya no existen | Aprobado |
| T018 | `tests/cart-catalog.spec.js` | Catálogo y reportes | detecta ofertas y productos gratis desde los precios del template | Aprobado |
| T019 | `tests/cart-catalog.spec.js` | Catálogo y reportes | filtra por texto en nombre o descripción | Aprobado |
| T020 | `tests/cart-catalog.spec.js` | Catálogo y reportes | filtra solo productos en oferta | Aprobado |
| T021 | `tests/cart-catalog.spec.js` | Catálogo y reportes | filtra por categoría y solo con stock | Aprobado |
| T022 | `tests/cart-catalog.spec.js` | Catálogo y reportes | ordena por precio final de menor a mayor | Aprobado |
| T023 | `tests/cart-catalog.spec.js` | Catálogo y reportes | un producto es crítico cuando su stock llega al stock crítico definido en el propio producto | Aprobado |
| T024 | `tests/cart-catalog.spec.js` | Catálogo y reportes | "Los más vistos" ordena por visitas y desempata por id | Aprobado |
| T025 | `tests/cart-catalog.spec.js` | Catálogo y reportes | calcula el dashboard desde los datos | Aprobado |
| T026 | `tests/cart-catalog.spec.js` | Catálogo y reportes | agrupa ventas por producto y por mes solo con pedidos pagados | Aprobado |
| T027 | `tests/components.spec.jsx` | Renderizado | ProductGrid muestra todos los productos recibidos | Aprobado |
| T028 | `tests/components.spec.jsx` | Renderizado | ProductGrid muestra un estado vacío cuando no recibe productos | Aprobado |
| T029 | `tests/components.spec.jsx` | Renderizado | CategoryGrid muestra una tarjeta por cada categoría | Aprobado |
| T030 | `tests/components.spec.jsx` | Renderizado | StatusAlert muestra el error solo cuando hay un mensaje de error | Aprobado |
| T031 | `tests/components.spec.jsx` | Renderizado | StatusAlert distingue el éxito de los errores con clases distintas | Aprobado |
| T032 | `tests/components.spec.jsx` | Props y eventos | AppButton recibe la etiqueta y ejecuta el callback onClick al hacer clic | Aprobado |
| T033 | `tests/components.spec.jsx` | Props y eventos | AppButton aplica la variante recibida por props | Aprobado |
| T034 | `tests/components.spec.jsx` | Props y eventos | AppButton deshabilitado no ejecuta onClick | Aprobado |
| T035 | `tests/components.spec.jsx` | Props y eventos | QuantityInput llama onChange con la cantidad incrementada al pulsar + | Aprobado |
| T036 | `tests/components.spec.jsx` | Props y eventos | QuantityInput no baja de la cantidad mínima | Aprobado |
| T037 | `tests/components.spec.jsx` | Props y eventos | el clic en "Añadir" de una tarjeta de producto agrega el producto al carrito | Aprobado |
| T038 | `tests/components.spec.jsx` | Props y eventos | "Añadir" queda deshabilitado cuando el producto no tiene stock | Aprobado |
| T039 | `tests/components.spec.jsx` | Estado de formularios | ContactForm actualiza su estado cuando el usuario escribe | Aprobado |
| T040 | `tests/components.spec.jsx` | Estado de formularios | ContactForm muestra el error de validación solo después de enviar con datos inválidos | Aprobado |
| T041 | `tests/components.spec.jsx` | Estado de formularios | LoginForm refleja el usuario escrito y muestra error con credenciales incorrectas | Aprobado |
| T042 | `tests/mocks.spec.jsx` | Mock de red: fetch (listado de personajes) | une Rick and Morty y PokéAPI sin salir a internet | Aprobado |
| T043 | `tests/mocks.spec.jsx` | Mock de red: fetch (listado de personajes) | si una API responde con error, informa la fuente y conserva los datos de la otra | Aprobado |
| T044 | `tests/mocks.spec.jsx` | Mock de red: fetch (listado de personajes) | si la red falla del todo, devuelve ambas fuentes como error y ningún usuario | Aprobado |
| T045 | `tests/mocks.spec.jsx` | Mock de tiempo: jasmine.clock() | el carrusel avanza solo cada 5 segundos | Aprobado |
| T046 | `tests/mocks.spec.jsx` | Mock de tiempo: jasmine.clock() | el aviso (toast) desaparece solo a los 3 segundos | Aprobado |
| T047 | `tests/mocks.spec.jsx` | Mock de tiempo: jasmine.clock() | los indicadores del mes dependen de la fecha simulada | Aprobado |
| T048 | `tests/mocks.spec.jsx` | Mock de archivos: FileReader e imágenes | readImageFile devuelve null sin archivo y rechaza lo que no es imagen o es muy grande | Aprobado |
| T049 | `tests/mocks.spec.jsx` | Mock de archivos: FileReader e imágenes | readImageFile convierte una imagen válida en data URL | Aprobado |
| T050 | `tests/mocks.spec.jsx` | Mock de archivos: FileReader e imágenes | readImageFile informa si el navegador no puede leer el archivo (FileReader simulado) | Aprobado |
| T051 | `tests/mocks.spec.jsx` | Mock de archivos: FileReader e imágenes | ImageField entrega la data URL al elegir una imagen y muestra el error si no es imagen | Aprobado |
| T052 | `tests/mocks.spec.jsx` | Mock de archivos: FileReader e imágenes | ImageField muestra la vista previa y "Quitar imagen" limpia el valor | Aprobado |
| T053 | `tests/mocks.spec.jsx` | Mock del navegador: print y almacenamiento | "Imprimir boleta" llama a window.print (simulado) | Aprobado |
| T054 | `tests/mocks.spec.jsx` | Mock del navegador: print y almacenamiento | favoritos sigue funcionando si localStorage lanza error al guardar | Aprobado |
| T055 | `tests/mocks.spec.jsx` | Mock del navegador: print y almacenamiento | favoritos ignora datos corruptos guardados | Aprobado |
| T056 | `tests/mocks.spec.jsx` | Callbacks espiados (createSpy) | QuantityInput nunca entrega un valor fuera de [min, max] | Aprobado |
| T057 | `tests/mocks.spec.jsx` | Callbacks espiados (createSpy) | QuantityInput deshabilita "+" en el máximo y "−" en el mínimo | Aprobado |
| T058 | `tests/mocks.spec.jsx` | Administración de productos (formulario completo) | crear un producto válido lo guarda y abre su ficha | Aprobado |
| T059 | `tests/mocks.spec.jsx` | Administración de productos (formulario completo) | crear un producto sin nombre muestra el error y no navega | Aprobado |
| T060 | `tests/mocks.spec.jsx` | Administración de productos (formulario completo) | editar un producto cambia su nombre y conserva su ficha (plataformas) | Aprobado |
| T061 | `tests/mocks.spec.jsx` | Administración de productos (formulario completo) | el producto inexistente muestra el aviso en la ficha | Aprobado |
| T062 | `tests/mocks.spec.jsx` | Registro público (formulario completo) | un registro válido crea la cuenta y deja la sesión iniciada | Aprobado |
| T063 | `tests/mocks.spec.jsx` | Registro público (formulario completo) | un registro con contraseñas distintas no navega y marca el campo | Aprobado |
| T064 | `tests/mocks.spec.jsx` | Utilidades de formato y presentación | formatPrice usa separador de miles de Chile y 0 como valor por defecto | Aprobado |
| T065 | `tests/mocks.spec.jsx` | Utilidades de formato y presentación | formatDate y formatDateTime devuelven vacío sin valor y texto con valor | Aprobado |
| T066 | `tests/mocks.spec.jsx` | Utilidades de formato y presentación | categoryStyle entrega ícono y colores para cualquier categoría | Aprobado |
| T067 | `tests/mocks.spec.jsx` | Utilidades de formato y presentación | ChartCanvas dibuja un canvas accesible y se desmonta sin errores | Aprobado |
| T068 | `tests/pages.spec.jsx` | Carrito (página) | muestra una fila por producto y el total | Aprobado |
| T069 | `tests/pages.spec.jsx` | Carrito (página) | subir la cantidad recalcula el total | Aprobado |
| T070 | `tests/pages.spec.jsx` | Carrito (página) | eliminar pide confirmación y, al confirmar, quita la línea | Aprobado |
| T071 | `tests/pages.spec.jsx` | Carrito (página) | vaciar el carrito muestra el estado vacío | Aprobado |
| T072 | `tests/pages.spec.jsx` | Catálogo (página) | muestra todos los productos al inicio | Aprobado |
| T073 | `tests/pages.spec.jsx` | Catálogo (página) | la búsqueda por texto actualiza los resultados | Aprobado |
| T074 | `tests/pages.spec.jsx` | Catálogo (página) | el filtro de ofertas deja solo productos con precio rebajado | Aprobado |
| T075 | `tests/pages.spec.jsx` | Catálogo (página) | el filtro de categoría muestra solo sus productos | Aprobado |
| T076 | `tests/pages.spec.jsx` | Checkout (página) | precarga los datos del cliente cuando la sesión está iniciada | Aprobado |
| T077 | `tests/pages.spec.jsx` | Checkout (página) | sin sesión valida los campos al enviar | Aprobado |
| T078 | `tests/pages.spec.jsx` | Checkout (página) | la comuna depende de la región elegida | Aprobado |
| T079 | `tests/pages.spec.jsx` | Checkout (página) | un pago rechazado no vacía el carrito ni registra el pedido | Aprobado |
| T080 | `tests/pages.spec.jsx` | Checkout (página) | un pago aprobado registra el pedido, descuenta stock y vacía el carrito | Aprobado |
| T081 | `tests/pages.spec.jsx` | Inicio de sesión (página) | con el usuario de demostración de cliente inicia sesión y no muestra error | Aprobado |
| T082 | `tests/pages.spec.jsx` | Inicio de sesión (página) | con clave incorrecta muestra el error | Aprobado |
| T083 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | la simulación es determinista: mismo escenario, mismo resultado | Aprobado |
| T084 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | el escenario rechazado no aprueba el pago y lo declara | Aprobado |
| T085 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | rechaza montos no válidos | Aprobado |
| T086 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | recalcula totales desde las líneas y suma el despacho | Aprobado |
| T087 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | registra el pedido una sola vez aunque se reintente con el mismo intento | Aprobado |
| T088 | `tests/payment-order.spec.jsx` | Pago simulado y pedidos | no registra un pedido si no hay stock suficiente | Aprobado |
| T089 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | AppButton acepta sus props válidas sin avisos | Aprobado |
| T090 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | StatusAlert acepta sus props válidas sin avisos | Aprobado |
| T091 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | EmptyState acepta sus props válidas sin avisos | Aprobado |
| T092 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | FormField acepta sus props válidas sin avisos | Aprobado |
| T093 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ConfirmModal acepta sus props válidas sin avisos | Aprobado |
| T094 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | DeleteButton acepta sus props válidas sin avisos | Aprobado |
| T095 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ProductImage acepta sus props válidas sin avisos | Aprobado |
| T096 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | QuantityInput acepta sus props válidas sin avisos | Aprobado |
| T097 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ImageField acepta sus props válidas sin avisos | Aprobado |
| T098 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | StatCard acepta sus props válidas sin avisos | Aprobado |
| T099 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | FilterBar acepta sus props válidas sin avisos | Aprobado |
| T100 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | CategoryCard acepta sus props válidas sin avisos | Aprobado |
| T101 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | CategoryGrid acepta sus props válidas sin avisos | Aprobado |
| T102 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | Carousel acepta sus props válidas sin avisos | Aprobado |
| T103 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ProductGrid acepta sus props válidas sin avisos | Aprobado |
| T104 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ProductCard acepta sus props válidas sin avisos | Aprobado |
| T105 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ProductFilters acepta sus props válidas sin avisos | Aprobado |
| T106 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | Rating acepta sus props válidas sin avisos | Aprobado |
| T107 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | PlatformBadges acepta sus props válidas sin avisos | Aprobado |
| T108 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | WishlistButton acepta sus props válidas sin avisos | Aprobado |
| T109 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | AppButton avisa si falta la etiqueta obligatoria | Aprobado |
| T110 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | QuantityInput avisa si value no es un número | Aprobado |
| T111 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | ProductCard avisa si la variante no existe | Aprobado |
| T112 | `tests/proptypes.spec.jsx` | Contrato de props (PropTypes) | StatusAlert avisa si el estado no está entre los permitidos | Aprobado |
| T113 | `tests/repository.spec.js` | Repositorio CRUD | lee registros existentes y devuelve null si no existen | Aprobado |
| T114 | `tests/repository.spec.js` | Repositorio CRUD | crea un registro con el id indicado sin mutar la base original | Aprobado |
| T115 | `tests/repository.spec.js` | Repositorio CRUD | rechaza crear un registro con un id repetido | Aprobado |
| T116 | `tests/repository.spec.js` | Repositorio CRUD | actualiza solo los campos del patch | Aprobado |
| T117 | `tests/repository.spec.js` | Repositorio CRUD | lanza NotFoundError al actualizar o eliminar un id inexistente | Aprobado |
| T118 | `tests/repository.spec.js` | Repositorio CRUD | elimina el registro indicado | Aprobado |
| T119 | `tests/storage.spec.js` | Persistencia (storage) | usa los datos de ejemplo cuando no hay nada guardado | Aprobado |
| T120 | `tests/storage.spec.js` | Persistencia (storage) | recupera los datos de ejemplo si el JSON guardado está corrupto | Aprobado |
| T121 | `tests/storage.spec.js` | Persistencia (storage) | descarta datos con formato o versión no válidos | Aprobado |
| T122 | `tests/storage.spec.js` | Persistencia (storage) | carga la base guardada cuando es válida | Aprobado |
| T123 | `tests/storage.spec.js` | Persistencia (storage) | readJson devuelve el valor por defecto si el almacenamiento no existe | Aprobado |
| T124 | `tests/storage.spec.js` | Persistencia (storage) | saveDb devuelve false si el almacenamiento lanza error (p. ej. cuota llena) | Aprobado |
| T125 | `tests/storage.spec.js` | Persistencia (storage) | saveDb guarda la base como JSON y devuelve true | Aprobado |
| T126 | `tests/template-features.spec.jsx` | Categorías (selector y productos) | muestra una tarjeta por categoría y resalta la activa | Aprobado |
| T127 | `tests/template-features.spec.jsx` | Categorías (selector y productos) | lista solo los productos de la categoría elegida | Aprobado |
| T128 | `tests/template-features.spec.jsx` | Categorías (selector y productos) | una categoría inexistente muestra un estado vacío | Aprobado |
| T129 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | "ENTRAR COMO ADMINISTRADOR" inicia sesión con la cuenta de administrador | Aprobado |
| T130 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | "ENTRAR COMO CLIENTE" inicia sesión con la cuenta de cliente | Aprobado |
| T131 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | tras entrar como administrador navega al panel | Aprobado |
| T132 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | tras entrar como cliente navega a la tienda | Aprobado |
| T133 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | con sesión iniciada, el login y el registro redirigen a Mi cuenta | Aprobado |
| T134 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | sin sesión, /admin redirige al login | Aprobado |
| T135 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | un cliente no entra a /admin y vuelve a la tienda | Aprobado |
| T136 | `tests/template-features.spec.jsx` | Inicio de sesión y rutas protegidas | un administrador sí entra a /admin | Aprobado |
| T137 | `tests/template-features.spec.jsx` | Boleta y detalle de producto | la compra exitosa muestra código, datos del cliente en campos de solo lectura y el total | Aprobado |
| T138 | `tests/template-features.spec.jsx` | Boleta y detalle de producto | abrir el detalle de un producto suma una visita | Aprobado |
| T139 | `tests/template-features.spec.jsx` | Boleta y detalle de producto | el detalle de un producto agotado deshabilita "Agregar al Carrito" | Aprobado |
| T140 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | calcula las estadísticas del perfil de un usuario | Aprobado |
| T141 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | segmenta a los clientes según sus compras | Aprobado |
| T142 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | genera los 10 gráficos del template con sus tipos | Aprobado |
| T143 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | el gráfico de ventas mensuales suma el total vendido | Aprobado |
| T144 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | genera los 4 gráficos del reporte de productos | Aprobado |
| T145 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | transforma personajes y pokémon al formato de usuario | Aprobado |
| T146 | `tests/template-features.spec.jsx` | Estadísticas, gráficos y personajes | si una API falla, devuelve las demás y avisa cuál falló | Aprobado |
| T147 | `tests/template-features.spec.jsx` | Stock crítico y formulario de usuario | marca AGOTADO cuando no queda stock y SOLICITAR PRODUCTOS cuando está bajo el crítico | Aprobado |
| T148 | `tests/template-features.spec.jsx` | Stock crítico y formulario de usuario | la tabla de críticos muestra una fila por producto recibido | Aprobado |
| T149 | `tests/template-features.spec.jsx` | Stock crítico y formulario de usuario | el formulario de usuario muestra errores de RUN y fecha solo al enviar con datos inválidos | Aprobado |
| T150 | `tests/template-features.spec.jsx` | Stock crítico y formulario de usuario | el formulario de usuario conserva lo escrito al cambiar de campo | Aprobado |
| T151 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | calcula el porcentaje de descuento y es 0 sin oferta | Aprobado |
| T152 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | filtra por plataforma | Aprobado |
| T153 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | ordena por mejor valoración y por mayor descuento | Aprobado |
| T154 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | las ofertas destacadas no incluyen juegos gratis | Aprobado |
| T155 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | las novedades empiezan por el año más reciente | Aprobado |
| T156 | `tests/tienda-juegos.spec.jsx` | Reglas de la tienda de juegos | los relacionados excluyen el propio juego y priorizan la misma categoría | Aprobado |
| T157 | `tests/tienda-juegos.spec.jsx` | Ficha del juego en el administrador | normalizeProduct no agrega ficha si el formulario no la envía (no borra la existente) | Aprobado |
| T158 | `tests/tienda-juegos.spec.jsx` | Ficha del juego en el administrador | normalizeProduct convierte la ficha enviada por el formulario | Aprobado |
| T159 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | Rating muestra la nota con su texto accesible y no muestra nada sin valoración | Aprobado |
| T160 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | el inicio muestra plataformas, ofertas, novedades y el boletín | Aprobado |
| T161 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | el catálogo respeta la plataforma que llega en la dirección | Aprobado |
| T162 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | el detalle muestra clasificación, plataformas y juegos relacionados | Aprobado |
| T163 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | el corazón guarda un juego en favoritos y la página de favoritos lo lista | Aprobado |
| T164 | `tests/tienda-juegos.spec.jsx` | Pantallas de la tienda de juegos | el boletín rechaza un correo inválido y acepta uno válido | Aprobado |
| T165 | `tests/tienda-juegos.spec.jsx` | Administrador: resumen y filtros de listados | dashboardOverview calcula ticket promedio, últimas órdenes y alertas de stock | Aprobado |
| T166 | `tests/tienda-juegos.spec.jsx` | Administrador: resumen y filtros de listados | filterAdminProducts filtra por estado, plataforma y categoría | Aprobado |
| T167 | `tests/tienda-juegos.spec.jsx` | Administrador: resumen y filtros de listados | filterOrders busca por código y ordena por monto | Aprobado |
| T168 | `tests/tienda-juegos.spec.jsx` | Administrador: resumen y filtros de listados | filterUsers busca por nombre, correo o RUN y filtra por tipo | Aprobado |
| T169 | `tests/tienda-juegos.spec.jsx` | Administrador: resumen y filtros de listados | el listado de productos del administrador filtra por estado y muestra el conteo | Aprobado |
| T170 | `tests/validators.spec.js` | RUN | calcula el dígito verificador con módulo 11 | Aprobado |
| T171 | `tests/validators.spec.js` | RUN | valida el RUN completo y rechaza dígitos verificadores incorrectos | Aprobado |
| T172 | `tests/validators.spec.js` | RUN | limpia y da formato con puntos y guion | Aprobado |
| T173 | `tests/validators.spec.js` | Validaciones | acepta correos bien formados y rechaza los incompletos | Aprobado |
| T174 | `tests/validators.spec.js` | Validaciones | acepta un producto correcto sin errores | Aprobado |
| T175 | `tests/validators.spec.js` | Validaciones | permite productos gratis (precio 0) | Aprobado |
| T176 | `tests/validators.spec.js` | Validaciones | exige que el precio normal sea mayor o igual al precio final | Aprobado |
| T177 | `tests/validators.spec.js` | Validaciones | rechaza precios negativos, stock decimal, stock crítico vacío y categorías inexistentes | Aprobado |
| T178 | `tests/validators.spec.js` | Validaciones | un producto sin stock no puede quedar como Disponible | Aprobado |
| T179 | `tests/validators.spec.js` | Validaciones | el código de un producto nuevo debe ser único y con formato válido | Aprobado |
| T180 | `tests/validators.spec.js` | Validaciones | normaliza el precio normal vacío a null y el texto a números | Aprobado |
| T181 | `tests/validators.spec.js` | Validaciones | exige campos obligatorios en el checkout y no exige departamento | Aprobado |
| T182 | `tests/validators.spec.js` | Validaciones | acepta el checkout completo y marca el carrito vacío como error | Aprobado |
| T183 | `tests/validators.spec.js` | Validaciones | valida cantidades positivas y dentro del stock | Aprobado |
| T184 | `tests/validators.spec.js` | Validaciones | acepta un usuario completo y detecta RUN inválido | Aprobado |
| T185 | `tests/validators.spec.js` | Validaciones | detecta RUN y correo repetidos y exige contraseña al crear usuarios | Aprobado |
| T186 | `tests/validators.spec.js` | Validaciones | no considera repetido el correo ni el RUN del propio usuario al editar | Aprobado |
| T187 | `tests/validators.spec.js` | Validaciones | valida la fecha de nacimiento: formato, no futura y posterior a 1900 | Aprobado |
| T188 | `tests/validators.spec.js` | Validaciones | el registro público exige contraseñas iguales y dirección completa | Aprobado |
| T189 | `tests/validators.spec.js` | Validaciones | valida el cambio de contraseña del perfil | Aprobado |
| T190 | `tests/validators.spec.js` | Validaciones | exige usuario y contraseña para iniciar sesión | Aprobado |
| T191 | `tests/validators.spec.js` | Validaciones | impide categorías duplicadas y exige descripción | Aprobado |
| T192 | `tests/validators.spec.js` | Validaciones | valida el mensaje de contacto | Aprobado |

## 7. Límites (lo que NO se cubre)

- No hay pruebas end-to-end (navegador real recorriendo toda la tienda); las rutas principales se revisaron a mano.
- Las pruebas de `fetch` usan datos simulados: no validan que las APIs públicas reales sigan respondiendo igual.
- No se miden pruebas de accesibilidad automáticas ni de rendimiento.
- El diseño responsivo se verificó revisando la aplicación a 390, 768 y 1280 px; no hay pruebas automáticas de tamaño de pantalla.
- La cobertura mide líneas ejecutadas, no calidad de las aserciones: por eso las pruebas verifican resultados concretos y no solo que "no falle".
