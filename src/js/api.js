const apiUrl = 'https://pokeapi.co/api/v2';

export async function getPokemons(limit = 20, offset = 0) {
    try {
        const response = await fetch(`${apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
}

export async function getPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
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

export async function getPokemonWeaknesses(types) {
    const weaknesses = new Set();
    try {
        for (const type of types) {
            const response = await fetch(type.url);
            const typeData = await response.json();
            typeData.damage_relations.double_damage_from.forEach(weakType => weaknesses.add(weakType.name));
        }
        return Array.from(weaknesses);
    } catch (error) {
        console.error('Error fetching Pokémon weaknesses:', error);
    }
}

export async function getPokemonResistances(types) {
    const resistances = new Set();
    try {
        for (const type of types) {
            const response = await fetch(type.url);
            const typeData = await response.json();
            typeData.damage_relations.half_damage_from.forEach(resistType => resistances.add(resistType.name));
        }
        return Array.from(resistances);
    } catch (error) {
        console.error('Error fetching Pokémon resistances:', error);
    }
}

export async function getPokemonLocation(pokemonId) {
    try {
        const response = await fetch(`${apiUrl}/pokemon/${pokemonId}/encounters`);
        const data = await response.json();
        return data.map(encounter => encounter.location_area.name);
    } catch (error) {
        console.error('Error fetching Pokémon location areas:', error);
    }
}
