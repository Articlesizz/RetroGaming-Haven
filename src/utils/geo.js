// Regiones y comunas generadas desde data/zonas.js del template.
import { COMUNAS, REGIONES as REGIONS } from '../data/zonas.js';

export const REGION_NAMES = REGIONS.map((region) => region.nombre);

// Comunas de una región (por nombre de región). Lista vacía si la región no existe.
export function comunasDeRegion(regionNombre) {
  const region = REGIONS.find((item) => item.nombre === regionNombre);
  if (!region) return [];
  return COMUNAS.filter((comuna) => comuna.id_region === region.id).map((comuna) => comuna.nombre);
}
