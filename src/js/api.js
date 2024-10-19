// ./src/js/api.js

// URL base de la PokeAPI
const BASE_URL = 'https://pokeapi.co/api/v2/';

// Mapa de íconos por tipo de Pokémon y otros.
export const localIcons = {
    normal: '../src/icons/normal.png',
    fighting: '../src/icons/fighting.png',
    flying: '../src/icons/flying.png',
    poison: '../src/icons/poison.png',
    ground: '../src/icons/ground.png',
    rock: '../src/icons/rock.png',
    bug: '../src/icons/bug.png',
    ghost: '../src/icons/ghost.png',
    steel: '../src/icons/steel.png',
    fire: '../src/icons/fire.png',
    water: '../src/icons/water.png',
    grass: '../src/icons/grass.png',
    electric: '../src/icons/electric.png',
    psychic: '../src/icons/psychic.png',
    ice: '../src/icons/ice.png',
    dragon: '../src/icons/dragon.png',
    dark: '../src/icons/dark.png',
    fairy: '../src/icons/fairy.avif',
    unknown: '../src/icons/unknown.png',
    all: '../src/icons/all.png',
    stellar: '../src/icons/stellar.png',
};

// Función para obtener un Pokémon por ID o nombre.
export async function getPokemonByIdOrName(query) {
    const isId = !isNaN(query); // Verifica si la consulta es un número (ID)
    const url = isId ? `${BASE_URL}pokemon/${query}` : `${BASE_URL}pokemon/${query.toLowerCase()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se encontró ningún Pokémon con ese ID o nombre');
        return await response.json();
    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        throw error;
    }
}
// Función para buscar Pokémon por nombre parcial (filtro)
export async function searchPokemonsByName(query) {
    const BASE_URL = 'https://pokeapi.co/api/v2/';
    const response = await fetch(`${BASE_URL}pokemon?limit=1000`);  // Cargar todos los Pokémon
    const data = await response.json();
    return data.results.filter(pokemon => pokemon.name.includes(query.toLowerCase()));
}
// Función para obtener un Pokémon aleatorio.
export async function getRandomPokemon() {
    try {
        const randomId = Math.floor(Math.random() * 898) + 1; // 898 es el número de Pokémon en la generación 8
        const response = await fetch(`${BASE_URL}pokemon/${randomId}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener Pokémon aleatorio:', error);
        return null;
    }
}
// Función para obtener los datos completos de un Pokémon desde su URL
export async function fetchPokemonData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Función para obtener la lista inicial de Pokémons
export async function fetchPokemons() {
    const response = await fetch(`${BASE_URL}pokemon?limit=120`);
    const data = await response.json();
    return data;
}
// Función para obtener dos Pokémon aleatorios que no sean el correcto
export async function getTwoRandomPokemons(correctPokemonName) {
    const randomPokemons = [];
    while (randomPokemons.length < 2) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const pokemon = await getPokemonDetails(`${BASE_URL}pokemon/${randomId}`);
        if (pokemon && pokemon.name !== correctPokemonName && !randomPokemons.includes(pokemon.name)) {
            randomPokemons.push(pokemon.name);
        }
    }
    return randomPokemons;
}

// Función para obtener todos los Pokémon con paginación.
export async function getAllPokemons(offset = 0, limit = 20) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

// Función para obtener los detalles de un Pokémon específico por su URL.
export async function getPokemonDetails(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los detalles del Pokémon:", error);
        return null;
    }
}

// Función para obtener los tipos, generaciones y hábitats desde la PokeAPI.
export async function getFiltersData() {
    try {
        const [types, generations, habitats] = await Promise.all([
            fetch(`${BASE_URL}type`).then(res => res.json()),
            fetch(`${BASE_URL}generation`).then(res => res.json()),
            fetch(`${BASE_URL}pokemon-habitat`).then(res => res.json())
        ]);
        return {
            types: types.results,
            generations: generations.results,
            habitats: habitats.results,
        };
    } catch (error) {
        console.error('Error al obtener filtros:', error);
        return { types: [], generations: [], habitats: [] };
    }
}

// Función para obtener los Pokémon filtrados por generación.
export async function getPokemonsByGeneration(generationId) {
    try {
        const response = await fetch(`${BASE_URL}generation/${generationId}`);
        const data = await response.json();
        return data.pokemon_species.map(pokemon => ({
            name: pokemon.name,
            url: `${BASE_URL}pokemon/${pokemon.name}`
        }));
    } catch (error) {
        console.error('Error al obtener los Pokémon por generación:', error);
        return [];
    }
}

// Función para obtener Pokémon por tipo.
export async function getPokemonsByType(typeName) {
    try {
        const response = await fetch(`${BASE_URL}type/${typeName}`);
        const data = await response.json();
        return data.pokemon.map(poke => ({
            name: poke.pokemon.name,
            url: poke.pokemon.url
        }));
    } catch (error) {
        console.error(`Error al obtener Pokémon de tipo ${typeName}:`, error);
        return [];
    }
}

// Función para obtener los Pokémon filtrados por hábitat.
export async function getPokemonsByHabitat(habitat) {
    try {
        const response = await fetch(`${BASE_URL}pokemon-habitat/${habitat}`);
        const data = await response.json();
        return data.pokemon_species.map(pokemon => ({
            name: pokemon.name,
            url: `${BASE_URL}pokemon/${pokemon.name}`
        }));
    } catch (error) {
        console.error('Error al obtener los Pokémon por hábitat:', error);
        return [];
    }
}
