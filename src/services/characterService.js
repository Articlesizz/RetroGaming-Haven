// Listado de personajes (admin/usuario/index-personajes.html del template): consulta dos APIs públicas
// (Rick and Morty y PokéAPI) y transforma cada resultado al formato de usuario. Si una API falla, se muestran las demás.
const RICK_AND_MORTY_URL = 'https://rickandmortyapi.com/api/character';
const pokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}/`;
const POKEMON_COUNT = 50;

const toUser = (id, name, imagen) => ({
  id: `u-${id}`,
  name,
  lastName: '',
  email: `${name.replace(/\s+/g, '').toLowerCase()}@example.com`,
  phone: '',
  role: 'cliente',
  imagen,
});

export function transformCharacter(character) {
  return toUser(10100 + character.id, character.name, character.image);
}

export function transformPokemon(pokemon, id) {
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return toUser(10200 + id, name, pokemon.sprites?.front_default ?? null);
}

async function getJson(url, signal, fetchImpl) {
  const response = await fetchImpl(url, { signal });
  if (!response.ok) throw new Error(`Error ${response.status} al consultar ${url}`);
  return response.json();
}

// Devuelve { users, errors }. errors lista las fuentes que fallaron.
export async function fetchCharacterUsers({ signal, fetchImpl = (...args) => fetch(...args) } = {}) {
  const errors = [];
  const [rick, pokemon] = await Promise.all([
    getJson(RICK_AND_MORTY_URL, signal, fetchImpl)
      .then((data) => data.results.map(transformCharacter))
      .catch((error) => {
        if (error.name === 'AbortError') throw error;
        errors.push('Rick and Morty');
        return [];
      }),
    Promise.all(Array.from({ length: POKEMON_COUNT }, (_, index) => getJson(pokemonUrl(index + 1), signal, fetchImpl)))
      .then((list) => list.map((item, index) => transformPokemon(item, index + 1)))
      .catch((error) => {
        if (error.name === 'AbortError') throw error;
        errors.push('PokéAPI');
        return [];
      }),
  ]);
  return { users: [...rick, ...pokemon], errors };
}
