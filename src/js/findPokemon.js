import { getPokemonDetails } from './api.js';
import { createPokemonCard } from './card.js';

// Función para renderizar la card del Pokémon
function renderPokemonCard(pokemon) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Limpiar resultados anteriores
    const card = createPokemonCard(pokemon);
    resultContainer.appendChild(card);
}

// Función para mostrar el mensaje de error
function renderErrorMessage(message) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Función principal para manejar la búsqueda
async function handleSearch() {
    const pokemonNumberInput = document.getElementById('pokemonNumber');
    const pokemonId = pokemonNumberInput.value;

    if (!pokemonId) {
        renderErrorMessage('Por favor ingrese un número válido');
        return;
    }

    try {
        const pokemon = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        renderPokemonCard(pokemon);
    } catch (error) {
        renderErrorMessage('No se encontró ningún Pokémon con ese ID');
    }
}

export const initFindPokemon = () => {
    document.getElementById('searchButton').addEventListener('click', handleSearch);
}