// ./src/js/api.js

// URL base de la PokeAPI
const BASE_URL = 'https://pokeapi.co/api/v2/';

/**
 * Función para obtener todos los Pokémon con paginación.
 * @param {number} limit - Número máximo de Pokémon a obtener.
 * @param {number} offset - Desplazamiento para la paginación.
 * @returns {Promise<Array>} Lista de Pokémon.
 */
export async function getAllPokemons(limit = 25, offset = 0) {
    try {
        const response = await fetch(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        return data.results; // Retorna la lista de todos los Pokémon
    } catch (error) {
        console.error("Error al obtener la lista de Pokémon:", error);
        return [];
    }
}

/**
 * Función para obtener los detalles de un Pokémon específico por su URL.
 * @param {string} pokemonUrl - URL del Pokémon.
 * @returns {Promise<Object|null>} Detalles del Pokémon o null si hay error.
 */
export async function getPokemonDetails(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        const pokemonData = await response.json();
        return pokemonData; // Retorna los detalles del Pokémon
    } catch (error) {
        console.error("Error al obtener los detalles del Pokémon:", error);
        return null;
    }
}

/**
 * Función para obtener los tipos, generaciones y hábitats desde la PokeAPI.
 * @returns {Promise<Object>} Objeto con arrays de tipos, generaciones y hábitats.
 */
export async function getFiltersData() {
    try {
        // Realizar todas las peticiones simultáneamente
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

/**
 * Función para obtener los Pokémon filtrados por generación.
 * @param {number} generationId - ID de la generación.
 * @returns {Promise<Array>} Lista de Pokémon de la generación.
 */
export async function getPokemonsByGeneration(generationId) {
    try {
        const response = await fetch(`${BASE_URL}generation/${generationId}`);
        const data = await response.json();

        // Crear URLs completas para obtener detalles completos de cada Pokémon
        return data.pokemon_species.map(pokemon => ({
            name: pokemon.name,
            url: `${BASE_URL}pokemon/${pokemon.name}` // URL completa de los detalles del Pokémon
        }));
    } catch (error) {
        console.error('Error al obtener los Pokémon por generación:', error);
        return [];
    }
}

/**
 * Función para obtener Pokémon por tipo.
 * @param {string} typeName - Nombre del tipo.
 * @returns {Promise<Array>} Lista de Pokémon de ese tipo.
 */
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

/**
 * Función para obtener los Pokémon filtrados por hábitat.
 * @param {string} habitat - Nombre del hábitat.
 * @returns {Promise<Array>} Lista de Pokémon de ese hábitat.
 */
export async function getPokemonsByHabitat(habitat) {
    try {
        const response = await fetch(`${BASE_URL}pokemon-habitat/${habitat}`);
        const data = await response.json();
        
        // Crear URLs completas para obtener detalles completos de cada Pokémon
        return data.pokemon_species.map(pokemon => ({
            name: pokemon.name,
            url: `${BASE_URL}pokemon/${pokemon.name}` // URL completa de los detalles del Pokémon
        }));
    } catch (error) {
        console.error('Error al obtener los Pokémon por hábitat:', error);
        return [];
    }
}

// Otras funciones de la API según sea necesario...
