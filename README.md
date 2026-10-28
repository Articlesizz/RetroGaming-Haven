# Tienda de Videojuegos — React (Evaluación 2)

Conversión del **template HTML** "Base HTML" (Anexo 3 de la Evaluación 2) a una aplicación **React + Bootstrap 5.3.3**, conservando su diseño, sus páginas y su comportamiento. Los datos son simulados en JavaScript (CRUD) y se guardan en `localStorage`; las pruebas usan **Jasmine y Karma**.

> No hay backend. Ver [Integración con backend](#integración-con-backend).

Documentación:

- [`docs/ERS_V2.md`](docs/ERS_V2.md): especificación de requisitos (alcance, reglas, flujos, criterios de aceptación y propuesta del equipo).
- [`docs/TESTING_COVERAGE.md`](docs/TESTING_COVERAGE.md): resultado de las pruebas, cobertura de código medida, mocks, alcance y límites.
- [`docs/COMPONENTES.md`](docs/COMPONENTES.md): props, estado y diseño responsivo de cada componente.

## Requisitos

- Node.js 20 o superior y npm.
- Chrome o Edge (solo para las pruebas, en modo headless).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la dirección que muestre la terminal (normalmente <http://localhost:5173>).

```bash
npm run build      # build de producción
npm run preview    # previsualizar el build
npm test           # pruebas Jasmine + Karma, con medición de cobertura (coverage/html/index.html)
```

`npm test` falla si la cobertura baja del umbral (sentencias, líneas y funciones 80 %, ramas 70 %).

Si Karma no encuentra el navegador (Git Bash, Chrome en Windows):

```bash
export CHROME_BIN="/c/Program Files/Google/Chrome/Application/chrome.exe"
npm test
```

## Qué se portó del template

**Tienda**

- Cabecera del template: barra superior (logo, buscador, sesión) y barra inferior con Home, Categorías (desplegable), Ofertas, Nosotros, Blog, Contacto y carrito con importe.
- Menú móvil (offcanvas) con tarjeta del usuario, acordeón de categorías con contador, ofertas e historial.
- Inicio: carrusel de 3 diapositivas, categorías, "Productos" con los dos modelos de tarjeta, "Los más vistos" (por visitas al detalle) y contacto. Mapa de Google en el pie (inicio y contacto).
- Categorías: selector de tarjetas con la categoría activa y los productos de la categoría elegida (`/categorias/:slug`).
- Ofertas, detalle de producto (migas de pan, valoración, precios, características, "Agregar al Carrito").
- Carrito: aviso con "Vistas", **lista de productos** junto a la tabla del carrito, cantidades, eliminar con modal de confirmación, "Limpiar" y "Comprar ahora".
- Checkout, compra exitosa (boleta con datos del cliente en campos de solo lectura, imprimir y enviar por email simulado) y pago fallido con reintento.
- Iniciar sesión (imagen, aviso descartable, enlaces, "Acceso directo" cliente/administrador), crear cuenta (RUN, fecha de nacimiento, contraseña repetida, imagen, dirección), recuperar contraseña (simulada).
- Nosotros (banner y equipo), blog (dos entradas), contacto.
- "Ver Perfil" e "Historial" del menú móvil: `/mi-cuenta`.
- Flujo de sesión: al iniciar sesión o crear la cuenta se muestra un aviso de bienvenida y se navega a la página de origen (administrador → `/admin`, cliente → inicio). Si el registro tiene errores, el foco va al primer campo inválido. Quien ya tiene sesión y abre `/iniciar-sesion` o `/crear-sesion` pasa a `/mi-cuenta`. Cada cambio de página vuelve al inicio.

**Administración**

- Cabecera oscura "Company name", buscador, menú lateral con offcanvas en móvil y cambio de tema claro/oscuro/automático.
- Dashboard: ventas del mes, ticket promedio, ventas por mes y juegos más vendidos (gráficos), alertas de stock con acceso a "Reponer", últimas órdenes y acciones rápidas. Todo calculado desde los datos.
- Menú lateral por secciones con contadores (órdenes, productos críticos, usuarios) y tarjeta de la persona conectada.
- Listados con filtros: productos (texto, categoría, plataforma, estado de stock/oferta/gratis), órdenes (búsqueda y orden por fecha o monto) y usuarios (búsqueda y tipo).
- Órdenes y detalle de orden.
- Productos: listado, críticos (stock crítico **por producto**, estados AGOTADO / SOLICITAR PRODUCTOS), formato tarjeta, reportes (4 gráficos), nuevo (código, precios, stock, stock crítico, disponibilidad, imagen), mostrar y editar.
- Categorías: listado con imagen, nueva y editar (`categoria/:id/editar`).
- Usuarios: listado con insignias de tipo, **listado de personajes** (consulta Rick and Morty y PokéAPI), nuevo, perfil con estadísticas (compras del mes, del mes anterior, totales y montos), editar, historial de compras y detalle de cada orden.
- Reportes: los **10 gráficos** del template (barras, líneas, circular, radar, donut, polar, dispersión, burbujas, barras apiladas, línea apilada), calculados con los datos de la tienda.
- Perfil: información personal y cambio de contraseña.

**Tienda de juegos (mejoras sobre el template)**

- Marca **RetroGaming Haven** con logo dibujado (sin imágenes) y cabecera oscura.
- Carrusel armado con el catálogo: novedades, mayor descuento (sin contar juegos gratis), más vendidos y juegos gratis, con portadas reales.
- Ficha de cada juego: plataformas (PC, PlayStation, Xbox, Switch, Móvil), clasificación PEGI, año, desarrollador, valoración y reseña (`src/data/fichas.js`; las valoraciones son de demostración). Editable desde Administración → Productos.
- Inicio: ventajas, accesos por plataforma, ofertas de la semana, categorías compactas, novedades, mejor valorados, más vistos y boletín (simulado).
- Tarjetas con etiqueta de descuento (%), GRATIS, AGOTADO, corazón de favoritos, plataformas y estrellas.
- Catálogo con filtro por plataforma y orden por valoración, descuento y novedad; acepta `?plataforma=` y `?orden=` en la dirección.
- **Favoritos** (`/favoritos`, guardados en `localStorage`, sin sesión) y contador en la cabecera.
- Detalle con clasificación, plataformas, reseña y "También te puede gustar".
- Pie de página con enlaces de tienda, cuenta, plataformas y mapa.

## Rutas (archivo del template → ruta React)

| Template | Ruta React |
|---|---|
| index.html | `/` |
| categorias.html | `/categorias`, `/categorias/:slug` |
| ofertas.html | `/ofertas` |
| producto1.html | `/productos/:id` (catálogo completo con filtros en `/productos`) |
| carrito.html | `/carrito` |
| comprar.html | `/comprar` |
| comprar-ok.html | `/comprar-ok/:orderId` |
| comprar-error.html | `/comprar-error` |
| iniciar-sesion.html | `/iniciar-sesion` (y `/recuperar-contrasena`) |
| crear-sesion.html | `/crear-sesion` |
| nosotros.html | `/nosotros` |
| blog.html, blog-items.html | `/blog`, `/blog/:slug` |
| contacto.html | `/contacto` |
| admin/index.html | `/admin` |
| admin/ordenes/... | `/admin/ordenes`, `/admin/ordenes/:orderId` |
| admin/producto/index.html, index-critico.html, index-formato.html, reporte.html | `/admin/producto`, `/criticos`, `/formato`, `/reporte` |
| admin/producto/nuevo.html, 1000/index.html, 1000/edit.html | `/admin/producto/nuevo`, `/:id`, `/:id/editar` |
| admin/categoria/... | `/admin/categoria`, `/nuevo`, `/:id/editar` |
| admin/usuario/index.html, index-personajes.html | `/admin/usuario`, `/admin/usuario/personajes` |
| admin/usuario/nuevo.html, 3312/index.html, 3312/edit.html | `/admin/usuario/nuevo`, `/:id`, `/:id/editar` |
| admin/usuario/3312/historial.html, historial/10009 | `/admin/usuario/:id/historial`, `/:id/historial/:orderId` |
| admin/reporte/index.html | `/admin/reporte` |
| admin/perfil/index.html | `/admin/perfil` |
| (nuevo, no está en el template) | `/favoritos` |

## Cuentas de demostración

Credenciales del template (no son seguras):

| Rol | Usuario | Clave |
|---|---|---|
| Administrador | admin | 12345 |
| Cliente | usuario | 12345 |

En la pantalla de inicio de sesión, "Acceso directo" entra con una de las dos cuentas. Los demás usuarios del listado no tienen clave.

## Datos, persistencia y reinicio

- Datos iniciales: `src/data/seed.js`, con `productos.js` y `usuarios.js` (generados desde los archivos del template) y órdenes de ejemplo de demostración para que los historiales y los reportes tengan contenido.
- Los cambios se guardan en `localStorage` (claves `mi-tienda:*`). Si cambias datos de `src/data/`, sube `SEED_VERSION` en `seed.js` para que el navegador descarte los datos viejos.
- Imágenes subidas desde el admin (productos, categorías, usuarios) se guardan como data URL, máximo 300 KB.
- Para volver a los datos iniciales, en la consola del navegador:

```js
Object.keys(localStorage).filter((k) => k.startsWith('mi-tienda:')).forEach((k) => localStorage.removeItem(k));
```

## Simulaciones (no son reales)

| Función | Qué hace |
|---|---|
| Pago | Simulación determinista (aprobado/rechazado, elegido en el checkout). No cobra ni pide datos de tarjeta. |
| Enviar boleta por email, contacto y recuperar contraseña | Muestran un aviso: no hay servicio de correo configurado. |
| Imprimir boleta en PDF | `window.print()`; en el diálogo, "Guardar como PDF". Sin validez tributaria. |
| Sesión | Guarda solo el id del usuario. No es autenticación segura. |
| Órdenes de ejemplo y visitas | Datos de demostración. |
| Boletín | Valida el correo y avisa; no guarda ni envía nada. |
| Valoraciones de los juegos | Datos de demostración, no notas oficiales. |
| Listado de personajes | Sí consulta APIs públicas reales (necesita internet); si fallan, avisa. |

## Integración con backend

No hay backend ni endpoints, y no se inventaron. El punto de integración es `src/context/StoreContext.jsx` (cada operación CRUD) y `src/data/storage.js` (`loadDb`, `saveDb`). La validación (`src/utils/validators.js`) debería repetirse en el backend, que también debe revalidar stock y precios al registrar una orden.

## Diferencias respecto al template

| Template | En React |
|---|---|
| jQuery, Popper y Bootstrap por CDN | Bootstrap 5.3.3 y Bootstrap Icons por npm; sin jQuery |
| Toastify | Notificaciones propias (`ToastContext`) |
| Chart.js por CDN con datos de ejemplo | Chart.js por npm con datos calculados |
| `alert()` y modal de Bootstrap con JS | `ConfirmModal` controlado por React (carrito); `window.confirm` en el admin |
| Login con usuario/clave fijos en JS | Login contra los usuarios de los datos |
| Tipo "Bodegero" con valor `cliente` (error del template) | Tipo `vendedor` |
| Enlaces `href="/#"` y a páginas inexistentes | Rutas reales; "Recuperar contraseña" agregada (simulada) |
| Imágenes de `via.placeholder.com` | Portadas y logotipos de Steam y Wikipedia (uso académico privado); marcadores locales generados donde faltan |
| Estado crítico con etiquetas de ejemplo (`DISPONIBLES (2)`) | AGOTADO si no hay stock; SOLICITAR PRODUCTOS (faltantes) si está bajo su stock crítico |
| `_index.html`, `blank.html`, `_compra.html`, `comprar copy.html` | No se migran: son borradores del template |

## Repositorio

Código en GitHub: <https://github.com/Articlesizz/RetroGaming-Haven>

```bash
git clone https://github.com/Articlesizz/RetroGaming-Haven.git
cd RetroGaming-Haven
npm install
npm run dev
```
