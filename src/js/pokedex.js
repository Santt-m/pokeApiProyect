import { getPokemons, getPokemonDetails, getPokemonByType } from './api.js';

let offset = 0;
const limit = 20;
let allPokemons = [];
let filteredPokemons = [];

export function initPokedex() {
    console.log('Iniciando Pokedex...');
    loadPokemons();

    // Buscar por nombre
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterByName);

    // Filtros por tipo
    const filterButtons = document.querySelectorAll('#filter-buttons button');
    filterButtons.forEach(button => button.addEventListener('click', filterByType));

    // Scroll infinito
    window.addEventListener('scroll', handleScroll);
}

async function loadPokemons() {
    try {
        const pokemons = await getPokemons(limit, offset);
        const pokemonsDetails = await Promise.all(pokemons.map(pokemon => getPokemonDetails(pokemon.url)));
        allPokemons = [...allPokemons, ...pokemonsDetails];
        filteredPokemons = allPokemons;
        displayPokemons(filteredPokemons);
        offset += limit;  // Incrementamos el offset para la siguiente carga
    } catch (error) {
        console.error('Error al cargar los Pokémon:', error);
    }
}

function displayPokemons(pokemons) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';  // Limpiamos el contenedor antes de mostrar los Pokémon

    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', `#${pokemon.id}`);
        card.setAttribute('data-type', pokemon.types.map(typeInfo => typeInfo.type.name).join(' '));

        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const imageUrl = pokemon.sprites.front_default;
        const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');

        // Estructura de la carta
        card.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="pokemon-image">
            <h3>${name}</h3>
            <p><strong>Tipos:</strong> ${types}</p>
            <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
            <p><strong>Ataque:</strong> ${pokemon.stats[1].base_stat}</p>
        `;

        container.appendChild(card);
    });
}

function filterByName(event) {
    const searchText = event.target.value.toLowerCase();
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));
    displayPokemons(filteredPokemons);
}

async function filterByType(event) {
    const type = event.target.dataset.type;
    
    if (type === 'all') {
        filteredPokemons = allPokemons;  // Mostrar todos
    } else {
        const pokemonsByType = await getPokemonByType(type);
        const pokemonDetails = await Promise.all(pokemonsByType.map(pokemon => getPokemonDetails(pokemon.url)));
        filteredPokemons = pokemonDetails;
    }
    
    displayPokemons(filteredPokemons);
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadPokemons();  // Cargar más Pokémon al llegar al final del scroll
    }
}
