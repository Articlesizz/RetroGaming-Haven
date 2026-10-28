# Componentes React: propiedades, estado y responsividad

Documento de apoyo para **IE2.1.2 e IE2.1.4** (componentes con props y estados bien gestionados, y diseño responsivo con Bootstrap). Todo lo de aquí se puede comprobar en el código indicado.

## 1. Reglas de diseño que seguimos

| Regla | Cómo se ve en el código |
|---|---|
| **Los datos bajan por props, los eventos suben por callbacks** | `ProductGrid` recibe `products` y se los pasa a `ProductCard`; `ProductFilters` no guarda estado: avisa con `onChange` y la página dueña (`CatalogPage`) lo guarda. |
| **El estado vive lo más cerca posible de quien lo usa** | El índice del carrusel está en `Carousel`; los filtros del catálogo en `CatalogPage`; el carrito, la sesión, los favoritos, los avisos y la base de datos en contextos (porque varios componentes los comparten). |
| **Estado derivado: no se guarda lo que se puede calcular** | Los resultados filtrados, los totales del carrito y los indicadores del dashboard se calculan en cada render con funciones puras (`filterProducts`, `cartTotals`, `dashboardOverview`). |
| **Lógica fuera de los componentes** | Reglas de negocio en `src/utils` y `src/services` (funciones puras, fáciles de probar). Los componentes solo muestran y conectan. |
| **Un componente, una responsabilidad** | `Rating` solo dibuja estrellas; `PlatformBadges` solo íconos; `WishlistButton` solo el corazón. |
| **Contrato de props verificable** | `Componente.propTypes` en 20 componentes, comprobado en `tests/proptypes.spec.jsx` (React 19 no valida `propTypes` por sí solo, por eso hay pruebas). |

## 2. Estado global (contextos)

| Contexto | Estado | Qué ofrece | Persistencia |
|---|---|---|---|
| `StoreContext` | `db` (productos, categorías, usuarios, órdenes) | CRUD de productos, categorías y usuarios; `registerOrder` (idempotente, descuenta stock); `registerView` | `localStorage` `mi-tienda:db` |
| `CartContext` | `lines` (`{productId, quantity}`) | `addItem`, `setQuantity`, `removeItem`, `clear` | `mi-tienda:cart` |
| `SessionContext` | `userId` | `login`, `register`, `logout`, `user` | `mi-tienda:session` |
| `WishlistContext` | `ids` | `toggle`, `has` | `mi-tienda:wishlist` |
| `ToastContext` | `toasts` | `notify(mensaje, variante)` (desaparece a los 3 s), `dismiss` | no persiste |

Todos tienen un hook (`useStore`, `useCart`, …) que lanza un error claro si se usa fuera de su proveedor.

## 3. Componentes con props y estado

### Comunes (`src/components/common`)

| Componente | Props (tipo, obligatoria) | Estado interno | Observaciones |
|---|---|---|---|
| `AppButton` | `label` (node, sí), `onClick` (func), `variant` (string, `primary`), `type` (`button`/`submit`/`reset`), `disabled` (bool), `className` | — | Presentacional. Prueba: props y callback. |
| `StatusAlert` | `status` (`info`/`success`/`error`/`warning`), `message` (string) | — | No dibuja nada si no hay mensaje. `role="alert"` solo en errores. |
| `EmptyState` | `title` (sí), `description`, `actionLabel`, `actionTo` | — | Muestra un enlace solo si hay `actionLabel` y `actionTo`. |
| `FormField` | `id`, `label` (sí), `error`, `required`, `className`, `children` | — | Asocia etiqueta e input y muestra el error accesible. |
| `QuantityInput` | `value` (number, sí), `min`, `max`, `onChange` (func, sí), `label` | — | Siempre entrega un entero entre `min` y `max` (función `clamp`). |
| `ImageField` | `id`, `label` (sí), `value`, `onChange` (sí), `className` | `error` (string) | Lee el archivo con `FileReader`, máximo 300 KB, vista previa y "Quitar imagen". |
| `ConfirmModal` | `open` (sí), `title`, `message`, `onConfirm`, `onCancel` (sí) | — | Controlado por la página (el estado `pendingRemoval` está en `CartPage`). |
| `DeleteButton` | `onConfirm` (sí), `message`, `label`, `disabled` | — | Pide confirmación con `window.confirm`. |
| `ProductImage` | `product` (shape, sí), `className`, `width` | — | Si el producto no tiene imagen, usa un marcador generado. |
| `Brand` | `className` | — | Logo dibujado con Bootstrap Icons. |

### Tienda (`src/components/products`, `home`, `cart`, `checkout`)

| Componente | Props | Estado interno | Observaciones |
|---|---|---|---|
| `ProductCard` | `product` (sí), `categoryName`, `variant` (`ver`/`click`/`add`), `showStock` | — (usa contextos de carrito y avisos) | **Un componente, tres modelos** del template según `variant`. Muestra % de descuento, GRATIS, AGOTADO, plataformas, estrellas y corazón. |
| `ProductGrid` | `products` (sí), `categories`, `variant`, `cols`, `showStock`, `emptyTitle`, `emptyDescription` | — | `cols` recibe las clases `row-cols-*` de Bootstrap, así cada pantalla decide sus columnas. |
| `ProductFilters` | `filters` (sí), `categories` (sí), `onChange` (sí) | — (controlado) | Componente **controlado**: el padre guarda los filtros. |
| `Rating` | `value`, `showNumber` | — | Estrellas llenas, medias y vacías según `value`. |
| `PlatformBadges` | `platforms`, `labels` | — | Íconos de PC, PlayStation, Xbox, Switch y Móvil. |
| `WishlistButton` | `product` (sí), `label`, `className` | — (usa `WishlistContext`) | `aria-pressed` refleja si está en favoritos. |
| `Carousel` | `products` | `index` (diapositiva visible) | `setInterval` cada 5 s con limpieza al desmontar; las diapositivas se arman con el catálogo. |
| `CategoryCard` / `CategoryGrid` | `category`, `productCount` / `categories`, `products` | — | Toda la tarjeta es un único enlace (`stretched-link`). |
| `Newsletter` | — | `email`, `error` | Simulado: valida y avisa. |
| `CartTable`, `ProductPicker`, `OrderLinesTable` | líneas, productos, handlers | — | El carrito se maneja en `CartContext`. |
| `OrderReceipt` | orden, cliente | `emailStatus` | Imprimir (`window.print`) y envío por correo simulado. |

### Formularios (`src/components/forms`)

| Componente | Props | Estado interno | Validación |
|---|---|---|---|
| `LoginForm` | `onSubmit` | `values`, `errors`, `failed` | `validateLogin` |
| `UserForm` | `user`, `creating`, `requireAddress`, `allowRoleChange`, `showPassword`, `onSubmit`, `submitLabel` | `values`, `errors`, `message`, `attempt` | RUN módulo 11, fecha de nacimiento, correo, contraseña repetida, dirección. Al fallar, enfoca el primer campo inválido. |
| `ProductForm` | `product`, `categories`, `onSubmit`, `submitLabel` | `values`, `errors`, `message` | `validateProduct`; incluye plataformas, PEGI, año, desarrollador y reseña. |
| `CategoryForm`, `PasswordForm`, `ContactForm`, `CheckoutForm` | datos y `onSubmit` | `values`, `errors`, `status` | Validadores de `src/utils/validators.js` |

Patrón de todos los formularios: **componente controlado** (`value` + `onChange`), el `onSubmit` del padre devuelve `{ ok, errors }` y el formulario muestra esos errores.

### Administración (`src/components/admin`, `layout`)

| Componente | Props | Estado | Observaciones |
|---|---|---|---|
| `FilterBar` | `fields`, `total`, `shown`, `onClear`, `label` | — | Una sola barra reutilizada en productos, órdenes y usuarios. |
| `StatCard` | `title`, `value`, `detail`, `color`, `icon`, `className` | — | Indicador del dashboard. |
| `AdminLayout` | — | `query` (buscador) | Menú lateral con contadores calculados desde el store. |
| `RequireAdmin` | `children` | — | Sin sesión → login; sin rol administrador → tienda. |
| `ChartCanvas` | `type`, `data`, `options`, `label` | — | Crea el gráfico de Chart.js en `useEffect` y lo destruye al desmontar (sin fugas). |

## 4. Diseño responsivo con Bootstrap 5.3

Se usa la cuadrícula y las utilidades de Bootstrap, con mínimo CSS propio. Punto de partida: **móvil primero** (las clases sin prefijo valen para pantallas pequeñas y los prefijos `sm`, `md`, `lg`, `xl` las amplían).

| Qué | Clases | Dónde | Resultado |
|---|---|---|---|
| Menú de la tienda | `navbar-expand-lg d-none d-lg-block` (escritorio) y `offcanvas` + `d-lg-none` (celular) | `SiteHeader`, `MobileMenu` | En celular aparece un botón de menú que abre un panel lateral; en escritorio, barra con desplegable de categorías. |
| Cuadrícula de productos | `row-cols-2 row-cols-md-4` (catálogo) y `row-cols-2 row-cols-md-3 row-cols-lg-6` (inicio) | `ProductGrid` | 2 columnas en celular, 3–4 en tableta, hasta 6 en escritorio. |
| Categorías | `col-6 col-md-4 col-lg-3` | `CategoryGrid` | 2, 3 o 4 por fila. |
| Ventajas de compra | `row-cols-2 row-cols-lg-4` | `TrustBar` | 2×2 en celular, 4 en fila en escritorio. |
| Accesos por plataforma | CSS Grid `repeat(auto-fit, minmax(140px, 1fr))` | `PlatformShortcuts` | Se acomodan solas según el ancho. |
| Carrusel | `d-none d-md-flex` en las portadas | `Carousel` | En celular solo texto y botón; en tableta y escritorio, texto más portadas. |
| Tablas | `table-responsive` | tablas del administrador y del carrito | Scroll horizontal dentro de la tabla, nunca de la página. |
| Panel de administración | `col-md-3 col-lg-2` y `offcanvas-md` | `AdminLayout` | Menú lateral fijo desde tableta; en celular, panel deslizable. |
| Formularios | `col-12 col-md-6` | `UserForm`, `ProductForm` | Una columna en celular, dos desde tableta. |

**Cómo se comprobó:** se revisó cada pantalla a 390 px (celular), 768 px (tableta) y escritorio, midiendo en el navegador que `document.documentElement.scrollWidth` fuera igual al ancho de la ventana (sin scroll horizontal). No hay pruebas automáticas de tamaño de pantalla (ver "Límites" en `TESTING_COVERAGE.md`).
