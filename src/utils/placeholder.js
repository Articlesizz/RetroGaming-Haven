// Marcador gris con dimensiones escritas (no es una fotografía). Se genera como data URI para no depender de red.
export function placeholderImage(width = 400, height = 300, label = 'Sin imagen') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="#dee2e6"/>` +
    `<text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="${Math.round(height / 9)}" fill="#6c757d">${label}</text>` +
    `<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="${Math.round(height / 13)}" fill="#6c757d">${width} x ${height}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
