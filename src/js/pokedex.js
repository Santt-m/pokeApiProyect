import { getPokemons, getPokemonDetails, getPokemonByType } from './api.js';
import { createPokemonCard } from './card.js';

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
        offset += limit;
    } catch (error) {
        console.error('Error al cargar los Pokémon:', error);
    }
}

function displayPokemons(pokemons) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';  // Limpiamos el contenedor antes de mostrar los Pokémon

    pokemons.forEach(pokemon => {
        const cardHTML = createPokemonCard(pokemon);
        container.appendChild(cardHTML);
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
        filteredPokemons = allPokemons;
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
