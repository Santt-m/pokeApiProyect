// ./src/js/pokedex.js

import { 
    getAllPokemons, 
    getPokemonsByType, 
    getPokemonsByGeneration, 
    getPokemonsByHabitat, 
    getPokemonDetails, 
    getFiltersData, 
    localIcons 
} from './api.js';
import { createPokemonCard } from './card.js';

// Función para crear los botones de tipo, generación y hábitat
function createFilterButtons(filters) {
    const typeButtonsContainer = document.getElementById('type-buttons');

    // Crear los botones de tipo
    filters.types.forEach(type => {
        const button = createButton(type.name, localIcons[type.name], () => filterByType(type.name));
        typeButtonsContainer.appendChild(button);
    });

    // Crear botones para generaciones
    filters.generations.forEach(generation => {
        const generationId = generation.url.split('/').filter(Boolean).pop(); // Extraer el ID
        const button = createButton(generation.name, null, () => filterByGeneration(generationId));
        typeButtonsContainer.appendChild(button);
    });

    // Crear botones para hábitats
    filters.habitats.forEach(habitat => {
        const button = createButton(habitat.name, null, () => filterByHabitat(habitat.name));
        typeButtonsContainer.appendChild(button);
    });

    // Crear el botón "Ver Todos"
    const showAllButton = createButton('Ver Todos', localIcons.all, showAllPokemon);
    typeButtonsContainer.appendChild(showAllButton);
}

// Función para crear un botón con icono
function createButton(text, iconSrc, clickHandler) {
    const button = document.createElement('button');
    button.classList.add('type-button');

    if (iconSrc) {
        const icon = document.createElement('img');
        icon.src = iconSrc;
        icon.alt = `${text} icon`;
        icon.classList.add('type-icon');
        button.appendChild(icon);
    }

    button.appendChild(document.createTextNode(text));
    button.addEventListener('click', () => {
        clickHandler();
        setActiveButton(button);
    });

    return button;
}

// Función para marcar el botón clicado como activo y desactivar los otros
function setActiveButton(activeButton) {
    const buttons = document.querySelectorAll('.type-button, #type-buttons > button');
    buttons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// Función para mostrar todos los Pokémon
async function showAllPokemon() {
    const pokemonList = await getAllPokemons();
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Limpiar el contenedor

    const pokemonDetailsPromises = pokemonList.map(pokemon => getPokemonDetails(pokemon.url));
    const pokemonDetailsArray = await Promise.all(pokemonDetailsPromises);

    pokemonDetailsArray.forEach(pokemonDetails => {
        if (pokemonDetails) {
            const pokemonCard = createPokemonCard(pokemonDetails);
            cardContainer.appendChild(pokemonCard);
        }
    });
}

// Función para filtrar Pokémon por tipo
async function filterByType(type) {
    const pokemonsByType = await getPokemonsByType(type);
    renderPokemonCards(pokemonsByType);
}

// Función para filtrar Pokémon por generación
async function filterByGeneration(generation) {
    const pokemonsByGeneration = await getPokemonsByGeneration(generation);
    renderPokemonCards(pokemonsByGeneration);
}

// Función para filtrar Pokémon por hábitat
async function filterByHabitat(habitat) {
    const pokemonsByHabitat = await getPokemonsByHabitat(habitat);
    renderPokemonCards(pokemonsByHabitat);
}

// Función para renderizar las tarjetas de Pokémon
async function renderPokemonCards(pokemons) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Limpiar el contenedor

    const pokemonDetailsPromises = pokemons.map(pokemon => getPokemonDetails(pokemon.url));
    const pokemonDetailsArray = await Promise.all(pokemonDetailsPromises);

    pokemonDetailsArray.forEach(pokemonDetails => {
        if (pokemonDetails) {
            const pokemonCard = createPokemonCard(pokemonDetails);
            cardContainer.appendChild(pokemonCard);
        }
    });
}

// Cargar los filtros y crear los botones cuando se cargue la página
document.addEventListener('DOMContentLoaded', async () => {
    const filters = await getFiltersData();
    createFilterButtons(filters);

    // Mostrar los primeros Pokémon al cargar
    showAllPokemon();
});

export function initPokedex() {
    document.addEventListener('DOMContentLoaded', async () => {
        const section = document.getElementById('pokedex');
        if (section){
            const filters = await getFiltersData();
        
        createFilterButtons(filters);

        // Mostrar los primeros Pokémon al cargar
        showAllPokemon();
        }else{
            console.log('no section pokedex');
        }
        
    });
}