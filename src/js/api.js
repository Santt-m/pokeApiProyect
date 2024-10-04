const apiUrl = 'https://pokeapi.co/api/v2';

export async function getPokemons(limit = 20, offset = 0) {
    try {
        const response = await fetch(`${apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        return data.results;  // Devuelve solo los resultados
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
}

export async function getPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const pokemon = await response.json();
        return pokemon;  // Devuelve los detalles completos de un Pokémon
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

export async function getTypes() {
    try {
        const response = await fetch(`${apiUrl}/type`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokémon types:', error);
    }
}

export async function getPokemonByType(type) {
    try {
        const response = await fetch(`${apiUrl}/type/${type}`);
        const data = await response.json();
        return data.pokemon.map(poke => poke.pokemon);
    } catch (error) {
        console.error('Error fetching Pokémon by type:', error);
    }
}

export async function getPokemonEvolutionChain(id) {
    try {
        const response = await fetch(`${apiUrl}/evolution-chain/${id}`);
        const data = await response.json();
        return data.chain;
    } catch (error) {
        console.error('Error fetching Pokémon evolution chain:', error);
    }
}
