// Ficha de cada juego (plataformas, clasificación por edades PEGI, año, desarrollador, valoración y reseña).
// Las valoraciones son datos de demostración de la tienda, no son notas oficiales. Se unen a los productos por nombre.
export const FICHAS = {
  'The Legend of Zelda': { plataformas: ['Switch'], clasificacion: 12, anio: 2017, desarrollador: 'Nintendo', rating: 4.9, detalle: 'Explora un reino enorme en el que casi todo se puede escalar, cocinar o combinar. Libertad total desde la primera hora.' },
  'Super Mario Odyssey': { plataformas: ['Switch'], clasificacion: 7, anio: 2017, desarrollador: 'Nintendo', rating: 4.8, detalle: 'Mario viaja por reinos muy distintos con un sombrero que captura a enemigos y objetos. Pura diversión de plataformas, ideal para jugar en familia.' },
  Minecraft: { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Móvil'], clasificacion: 7, anio: 2011, desarrollador: 'Mojang Studios', rating: 4.7, detalle: 'Construye, explora y sobrevive en mundos de bloques generados al azar, solo o con amigos. Tu imaginación pone el límite.' },
  Fortnite: { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Móvil'], clasificacion: 12, anio: 2017, desarrollador: 'Epic Games', rating: 4.2, detalle: 'Battle royale gratuito de 100 jugadores con construcción de estructuras y eventos en vivo cada temporada.' },
  Overwatch: { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch'], clasificacion: 12, anio: 2016, desarrollador: 'Blizzard Entertainment', rating: 4.4, detalle: 'Shooter por equipos con héroes de habilidades únicas. Elige tu rol y coordina la jugada con tu equipo.' },
  'Red Dead Redemption 2': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 18, anio: 2018, desarrollador: 'Rockstar Games', rating: 4.9, detalle: 'Una épica del Lejano Oeste con una banda de forajidos, un mundo vivo y una historia que no se olvida.' },
  'Among Us': { plataformas: ['PC', 'Switch', 'Móvil'], clasificacion: 7, anio: 2018, desarrollador: 'Innersloth', rating: 4.3, detalle: 'Entre tripulantes hay impostores. Completa tareas, discute y vota para salvar la nave antes de que sea tarde.' },
  'The Witcher 3': { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch'], clasificacion: 18, anio: 2015, desarrollador: 'CD Projekt Red', rating: 4.9, detalle: 'Encarna a Geralt, cazador de monstruos, en un mundo abierto con decisiones que cambian la historia.' },
  'Animal Crossing': { plataformas: ['Switch'], clasificacion: 3, anio: 2020, desarrollador: 'Nintendo', rating: 4.6, detalle: 'Construye tu vida en una isla tranquila: pesca, decora tu casa e invita a tus amigos. Un juego para relajarse.' },
  'Call of Duty: Warzone': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 18, anio: 2020, desarrollador: 'Infinity Ward / Raven', rating: 4.0, detalle: 'Battle royale gratuito de disparos rápidos con grandes mapas, contratos y equipamiento que se personaliza.' },
  'Hollow Knight': { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch'], clasificacion: 7, anio: 2017, desarrollador: 'Team Cherry', rating: 4.8, detalle: 'Aventura de acción en un reino subterráneo de insectos, con combates exigentes y una música inolvidable.' },
  'Dark Souls III': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 16, anio: 2016, desarrollador: 'FromSoftware', rating: 4.6, detalle: 'Rol de acción sombrío y desafiante, donde cada jefe es una lección. Prepárate para morir y aprender.' },
  'FIFA 21': { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch'], clasificacion: 3, anio: 2020, desarrollador: 'EA Sports', rating: 3.9, detalle: 'Fútbol con licencias oficiales, modo carrera y Ultimate Team para armar el equipo de tus sueños.' },
  'Mortal Kombat 11': { plataformas: ['PC', 'PlayStation', 'Xbox', 'Switch'], clasificacion: 18, anio: 2019, desarrollador: 'NetherRealm Studios', rating: 4.5, detalle: 'Lucha brutal con una historia que juega con el tiempo, decenas de luchadores y fatalities espectaculares.' },
  'The Sims 4': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 12, anio: 2014, desarrollador: 'Maxis / EA', rating: 4.1, detalle: 'Crea personas, diseña su casa y cuenta sus historias. Una simulación de vida sin reglas fijas.' },
  "Assassin's Creed Valhalla": { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 18, anio: 2020, desarrollador: 'Ubisoft Montreal', rating: 4.3, detalle: 'Lidera a un clan vikingo en la conquista de Inglaterra, entre asaltos, alianzas y sigilo.' },
  Cuphead: { plataformas: ['PC', 'Xbox', 'Switch', 'PlayStation'], clasificacion: 7, anio: 2017, desarrollador: 'Studio MDHR', rating: 4.6, detalle: 'Disparos y jefes difíciles con un arte animado a mano al estilo de los dibujos de los años 30.' },
  'Star Wars Jedi: Fallen Order': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 16, anio: 2019, desarrollador: 'Respawn Entertainment', rating: 4.5, detalle: 'Un padawan superviviente huye del Imperio. Combate con sable de luz y exploración al estilo metroidvania.' },
  'Ghost of Tsushima': { plataformas: ['PlayStation', 'PC'], clasificacion: 18, anio: 2020, desarrollador: 'Sucker Punch', rating: 4.8, detalle: 'Un samurái defiende la isla de Tsushima de la invasión mongola, con duelos precisos y paisajes de postal.' },
  'Cyberpunk 2077': { plataformas: ['PC', 'PlayStation', 'Xbox'], clasificacion: 18, anio: 2020, desarrollador: 'CD Projekt Red', rating: 4.0, detalle: 'Rol de mundo abierto en Night City: mercenario, implantes y decisiones con consecuencias reales.' },
};

export const PLATFORMS = [
  { id: 'PC', label: 'PC', icon: 'bi-pc-display' },
  { id: 'PlayStation', label: 'PlayStation', icon: 'bi-playstation' },
  { id: 'Xbox', label: 'Xbox', icon: 'bi-xbox' },
  { id: 'Switch', label: 'Switch', icon: 'bi-nintendo-switch' },
  { id: 'Móvil', label: 'Móvil', icon: 'bi-phone' },
];
