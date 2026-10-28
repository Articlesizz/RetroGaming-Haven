// Apariencia de cada categoría: ícono de Bootstrap Icons y degradado. Sin imágenes, así no hay derechos de autor.
// Las categorías nuevas (creadas desde el admin) reciben un estilo estable calculado desde su nombre.
const KNOWN = {
  aventura: { icon: 'bi-compass', from: '#0f766e', to: '#2dd4bf' },
  plataforma: { icon: 'bi-controller', from: '#b45309', to: '#fbbf24' },
  sandbox: { icon: 'bi-box-seam', from: '#15803d', to: '#86efac' },
  'battle-royale': { icon: 'bi-crosshair', from: '#be123c', to: '#fb7185' },
  shooter: { icon: 'bi-bullseye', from: '#1d4ed8', to: '#60a5fa' },
  misterio: { icon: 'bi-incognito', from: '#4c1d95', to: '#a78bfa' },
  rpg: { icon: 'bi-shield-shaded', from: '#7c2d12', to: '#fb923c' },
  simulacion: { icon: 'bi-house-heart', from: '#0e7490', to: '#67e8f9' },
  deportes: { icon: 'bi-trophy', from: '#166534', to: '#4ade80' },
  lucha: { icon: 'bi-lightning-charge', from: '#9f1239', to: '#f472b6' },
};

const FALLBACK_COLORS = [
  ['#334155', '#94a3b8'],
  ['#6d28d9', '#c4b5fd'],
  ['#0369a1', '#7dd3fc'],
  ['#a21caf', '#f0abfc'],
];

export function categoryStyle(category) {
  const known = KNOWN[category.slug];
  if (known) return known;
  const hash = [...category.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [from, to] = FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  return { icon: 'bi-tag', from, to };
}
