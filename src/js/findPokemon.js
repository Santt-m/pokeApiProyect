import { getPokemonByIdOrName, searchPokemonsByName } from './api.js';
import { createPokemonCard } from './card.js';

// Función para renderizar una lista de tarjetas de Pokémon
function renderPokemonCards(pokemons) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Limpiar resultados anteriores

    if (pokemons.length === 0) {
        resultContainer.innerHTML = '<p class="error-message">No se encontraron Pokémon con ese nombre</p>';
        return;
    }

    pokemons.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        resultContainer.appendChild(card);
    });
}

// Función para mostrar el mensaje de error
function renderErrorMessage(message) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Función principal para manejar la búsqueda
async function handleSearch(query) {
    if (!query) {
        renderErrorMessage('Por favor ingrese un ID o nombre de Pokémon válido');
        return;
    }

    // Si el query es un número, buscar solo un Pokémon por ID
    if (!isNaN(query)) {
        try {
            const pokemon = await getPokemonByIdOrName(query);
            renderPokemonCards([pokemon]); // Mostrar solo una card
        } catch (error) {
            renderErrorMessage('No se encontró ningún Pokémon con ese ID');
        }
    } else {
        // Si es un texto, buscar múltiples Pokémon por nombre parcial
        try {
            const pokemons = await searchPokemonsByName(query);
            const pokemonDetailsPromises = pokemons.map(pokemon => getPokemonByIdOrName(pokemon.name));
            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
            renderPokemonCards(pokemonDetails); // Mostrar todas las cards encontradas
        } catch (error) {
            renderErrorMessage('No se encontraron Pokémon con ese nombre');
        }
    }
}

// Función de debounce para limitar las llamadas repetitivas
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Inicialización de la búsqueda
export const initFindPokemon = () => {
    const pokemonInput = document.getElementById('pokemonNumber');
    const searchButton = document.getElementById('searchButton');

    // Evento de búsqueda instantánea cuando el usuario escribe
    pokemonInput.addEventListener('input', debounce(() => {
        const query = pokemonInput.value.trim();
        handleSearch(query);
    }, 500));

    // También mantener el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const query = pokemonInput.value.trim();
        handleSearch(query);
    });
};
