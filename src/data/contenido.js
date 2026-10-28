// Textos de las páginas "Nosotros" y "Blog" tomados del template (Anexo 3). Son contenido de ejemplo del sitio.
export const NOSOTROS_SECCIONES = [
  {
    titulo: 'Un Viaje al Pasado 🚀',
    texto:
      'RetroGaming Haven nació en el año 2010, en un pequeño local del centro de la ciudad, fundado por dos amigos apasionados por los videojuegos de su infancia. Con un sueño compartido de revivir la emoción de las consolas y juegos clásicos, comenzaron a coleccionar, restaurar y vender videojuegos y consolas retro.',
  },
  {
    titulo: 'Crecimiento y Comunidad 🌟',
    texto:
      'Con el tiempo, RetroGaming Haven se ganó la reputación de ser un santuario para los amantes de los videojuegos clásicos. Organizamos eventos temáticos y torneos que reúnen a jugadores de todas las edades para compartir su amor por los juegos de antaño. Nuestra comunidad creció rápidamente, y en 2015, inauguramos nuestra tienda en línea, permitiendo que los aficionados de todo el mundo accedieran a nuestro catálogo.',
  },
  {
    titulo: '🎯 Misión',
    texto:
      'Nuestra misión es preservar y celebrar la rica historia de los videojuegos, ofreciendo una experiencia única y nostálgica a nuestros clientes. Nos esforzamos por ser un puente entre generaciones, proporcionando productos de calidad y servicios excepcionales a los coleccionistas y entusiastas del gaming clásico.',
  },
  {
    titulo: '🔮 Visión',
    texto:
      'En RetroGaming Haven, soñamos con ser líderes mundiales en el mercado de videojuegos retro, comprometidos con la innovación y la expansión de nuestra comunidad global. Buscamos ser el destino predilecto para quienes desean revivir y compartir los momentos dorados del pasado del gaming.',
  },
  {
    titulo: '🚀 Innovación Continua',
    texto:
      'A lo largo de los años, hemos ampliado nuestra oferta para incluir servicios de reparación y restauración de consolas, así como una línea exclusiva de merchandising inspirado en los clásicos del videojuego. En el futuro, planeamos lanzar una serie de documentales que exploren la evolución de los videojuegos y su impacto en la cultura popular.',
  },
];

export const BLOG_POSTS = [
  {
    slug: 'historia-retrogaming-haven',
    imagen: '/imagenes/banners/banner.png',
    titulo: 'Historia de RetroGaming Haven',
    resumen: 'Cómo nació la tienda de videojuegos retro y su camino hasta hoy.',
    secciones: NOSOTROS_SECCIONES.slice(0, 2),
  },
  {
    slug: 'mision-y-vision',
    imagen: '/imagenes/banners/banner2.png',
    titulo: 'Misión, visión e innovación',
    resumen: 'Hacia dónde va la tienda y qué servicios nuevos vienen.',
    secciones: NOSOTROS_SECCIONES.slice(2),
  },
];

// Equipo del template (página Nosotros). Fotos en public/imagenes/equipo/.
export const EQUIPO = [
  { nombre: 'Joseph', rol: 'Programador', descripcion: 'Estudiante de segundo año de analista en Duoc UC.', imagen: '/imagenes/equipo/face-programador2.png' },
  { nombre: 'Luna', rol: 'Scrum Master', descripcion: 'Estudiante de Ingeniería en Informática, TechLead y Junior Frontend.', imagen: '/imagenes/equipo/Luna.png' },
  { nombre: 'Pedro', rol: 'Programador', descripcion: 'Estudiante de informática Duoc UC. Me gusta programar.', imagen: '/imagenes/equipo/pedro.png' },
];

// Mapa del pie de página (iframe de Google Maps del template: Duoc UC Casa Central).
export const MAPA_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d795.8652023171296!2d-70.6151711566251!3d-33.4328796238235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c586497835ad%3A0xa929ba68e1ac6051!2sDuoc%20UC%20Casa%20Central!5e1!3m2!1ses!2scl!4v1722850059541!5m2!1ses!2scl";
