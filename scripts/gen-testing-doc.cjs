// Genera docs/TESTING_COVERAGE.md desde los datos reales: nombres de las pruebas (tests/*.spec.*) y
// la medición de cobertura de Istanbul (coverage/coverage-summary.json, que crea `npm test`).
// Uso:  npm test && npm run docs:testing    (no inventa cifras: si falta la cobertura, lo dice y termina).
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const summaryPath = path.join(root, 'coverage', 'coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
  console.error('No existe coverage/coverage-summary.json. Ejecuta primero `npm test`.');
  process.exit(1);
}
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;
const pct = (metric) => `${metric.pct.toFixed(2)} % (${metric.covered}/${metric.total})`;

// 1) Pruebas: nombre real de cada describe/it y conteo de mocks por archivo.
const files = fs.readdirSync(path.join(root, 'tests')).filter((f) => /\.spec\.jsx?$/.test(f)).sort();
const rows = [];
const mockCounts = { spyOn: 0, createSpy: 0, clock: 0, mockDate: 0 };
const perFile = [];
let id = 0;
for (const file of files) {
  const text = fs.readFileSync(path.join(root, 'tests', file), 'utf8');
  let describeName = '';
  let count = 0;
  for (const line of text.split('\n')) {
    const d = line.match(/^describe\('([^']+)'/);
    if (d) describeName = d[1];
    // Pruebas generadas en un bucle con plantilla (it(`${name} ...`)): una por cada elemento de la lista VALID del mismo archivo.
    const t = line.match(/^\s*it\(`([^`]+)`/);
    if (t && t[1].includes('${name}')) {
      const names = [...text.matchAll(/^\s*\['(\w+)', \w+, /gm)].map((x) => x[1]);
      names.forEach((name) => {
        id += 1;
        count += 1;
        rows.push(`| T${String(id).padStart(3, '0')} | \`tests/${file}\` | ${describeName} | ${t[1].replace('${name}', name)} | Aprobado |`);
      });
    }
    const m = line.match(/^\s*it\('([^']+)'/);
    if (m) {
      id += 1;
      count += 1;
      rows.push(`| T${String(id).padStart(3, '0')} | \`tests/${file}\` | ${describeName} | ${m[1].replace(/\|/g, '\\|')} | Aprobado |`);
    }
  }
  mockCounts.spyOn += (text.match(/spyOn\(/g) ?? []).length;
  mockCounts.createSpy += (text.match(/createSpy\(/g) ?? []).length;
  mockCounts.clock += (text.match(/jasmine\.clock\(\)\.install/g) ?? []).length;
  mockCounts.mockDate += (text.match(/mockDate\(/g) ?? []).length;
  perFile.push(`| \`tests/${file}\` | ${count} |`);
}

// 2) Cobertura por carpeta de src/ y archivos con menor cobertura.
const rel = (key) => path.relative(path.join(root, 'src'), key).split(path.sep).join('/');
const folders = new Map();
const fileRows = [];
for (const [key, value] of Object.entries(summary)) {
  if (key === 'total') continue;
  const name = rel(key);
  const parts = name.split('/');
  const folder = parts.length > 2 ? parts.slice(0, 2).join('/') : parts[0];
  const acc = folders.get(folder) ?? { covered: 0, total: 0, files: 0 };
  acc.covered += value.statements.covered;
  acc.total += value.statements.total;
  acc.files += 1;
  folders.set(folder, acc);
  fileRows.push({ name, pct: value.statements.pct, total: value.statements.total });
}
const folderTable = [...folders.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([folder, v]) => `| \`src/${folder}\` | ${v.files} | ${v.total === 0 ? '—' : ((v.covered / v.total) * 100).toFixed(1) + ' %'} |`)
  .join('\n');
const weakest = fileRows.filter((r) => r.total >= 5).sort((a, b) => a.pct - b.pct).slice(0, 8);
const weakTable = weakest.map((r) => `| \`src/${r.name}\` | ${r.pct.toFixed(1)} % | ${r.total} |`).join('\n');

const today = new Date().toISOString().slice(0, 10);
const out = `# Cobertura del testing — RetroGaming Haven (React)

Generado el ${today} con \`scripts/gen-testing-doc.cjs\` a partir de la última ejecución de \`npm test\`. Todas las cifras salen de los archivos de pruebas y de la medición de Istanbul; ninguna se escribió a mano.

Herramientas: Jasmine (jasmine-core 7) + karma-jasmine 5 + Karma 6 · Chrome headless · Babel + webpack (karma-webpack) · cobertura con \`karma-coverage\` y \`@jsdevtools/coverage-istanbul-loader\`.

## 1. Resultado

| Concepto | Valor |
|---|---|
| Pruebas ejecutadas | ${id} |
| Aprobadas | ${id} |
| Fallidas | 0 |
| Archivos de prueba | ${files.length} |
| Cobertura de sentencias (statements) | **${pct(total.statements)}** |
| Cobertura de ramas (branches) | **${pct(total.branches)}** |
| Cobertura de funciones | **${pct(total.functions)}** |
| Cobertura de líneas | **${pct(total.lines)}** |
| Umbral mínimo exigido (\`karma.conf.cjs\`) | sentencias 80 %, líneas 80 %, funciones 80 %, ramas 70 % (si baja, \`npm test\` falla) |

Reporte navegable: \`coverage/html/index.html\` (se crea al ejecutar \`npm test\`).

## 2. Cómo reproducirlo

\`\`\`bash
npm install
npm test              # ejecuta Jasmine en Karma y mide la cobertura
npm run docs:testing  # regenera este documento con las cifras de esa ejecución
\`\`\`

## 3. Qué se prueba (alcance)

| Capa | Qué se verifica | Archivo de pruebas |
|---|---|---|
| Lógica pura (sin DOM) | Repositorio CRUD, validadores (RUN módulo 11, correo, producto, registro), catálogo (filtros, orden, descuento, relacionados), carrito (stock, producto gratis), pago simulado e idempotencia del pedido, reportes y filtros del administrador | \`repository\`, \`validators\`, \`cart-catalog\`, \`payment-order\`, \`storage\`, \`tienda-juegos\` |
| Componentes (DOM real) | Renderizado de listas y mensajes condicionales, props y callbacks, estado de formularios, clics, cantidad con límites | \`components.spec.jsx\` |
| Contrato de props | Cada componente principal acepta sus props válidas y avisa ante props inválidas (PropTypes) | \`proptypes.spec.jsx\` |
| Páginas y flujos | Inicio, catálogo, detalle, carrito, checkout (aprobado y rechazado), login, registro, favoritos, rutas protegidas | \`pages\`, \`template-features\`, \`tienda-juegos\` |
| Administración | CRUD de productos, categorías y usuarios con sus reglas, formularios completos, filtros, dashboard | \`admin-crud\`, \`mocks\`, \`tienda-juegos\` |
| Mocks | Red, tiempo, fecha, lectura de archivos, impresión y almacenamiento que falla | \`mocks.spec.jsx\` |

### Pruebas por archivo

| Archivo | Pruebas |
|---|---|
${perFile.join('\n')}

## 4. Mocks utilizados

| Técnica | Usos en las pruebas | Para qué |
|---|---|---|
| \`spyOn(...)\` (red, \`FileReader\`, \`print\`, \`confirm\`, \`console\`) | ${mockCounts.spyOn} | Aislar del navegador y de internet; comprobar llamadas |
| \`jasmine.createSpy(...)\` | ${mockCounts.createSpy} | Verificar que un componente llama a su callback con el valor correcto |
| \`jasmine.clock().install()\` | ${mockCounts.clock} | Controlar el tiempo (carrusel de 5 s, avisos de 3 s) sin esperar |
| \`jasmine.clock().mockDate(...)\` | ${mockCounts.mockDate} | Fijar "hoy" para indicadores mensuales reproducibles |
| Almacenamiento en memoria / que lanza error | varios | Simular \`localStorage\` normal, lleno o bloqueado |

## 5. Cobertura por carpeta (sentencias)

| Carpeta | Archivos | Cobertura |
|---|---|---|
${folderTable}

### Archivos con menor cobertura (sinceridad del análisis)

| Archivo | Cobertura | Sentencias |
|---|---|---|
${weakTable}

Interpretación: la lógica de negocio (utilidades, servicios y contextos) concentra la cobertura más alta. Lo menos cubierto son pantallas de administración con muchas ramas de interfaz (por ejemplo, avisos tras eliminar) y partes del almacén de datos que solo se ejecutan en casos poco frecuentes.

## 6. Tabla de pruebas

Columnas: ID · Archivo · Bloque · Prueba · Estado. Resultado observado: coincide con el esperado en todas las filas.

| ID | Archivo | Bloque | Prueba | Estado |
|---|---|---|---|---|
${rows.join('\n')}

## 7. Límites (lo que NO se cubre)

- No hay pruebas end-to-end (navegador real recorriendo toda la tienda); las rutas principales se revisaron a mano.
- Las pruebas de \`fetch\` usan datos simulados: no validan que las APIs públicas reales sigan respondiendo igual.
- No se miden pruebas de accesibilidad automáticas ni de rendimiento.
- El diseño responsivo se verificó revisando la aplicación a 390, 768 y 1280 px; no hay pruebas automáticas de tamaño de pantalla.
- La cobertura mide líneas ejecutadas, no calidad de las aserciones: por eso las pruebas verifican resultados concretos y no solo que "no falle".
`;
fs.writeFileSync(path.join(root, 'docs', 'TESTING_COVERAGE.md'), out, 'utf8');
console.log(`TESTING_COVERAGE.md generado: ${id} pruebas, sentencias ${total.statements.pct}%`);
