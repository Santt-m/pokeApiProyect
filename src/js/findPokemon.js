import { getPokemonByIdOrName, searchPokemonsByName } from './api.js';
import { createPokemonCard } from './card.js';
import Modal from './modal.js'; // Importar Modal para alertas

// Función para mostrar el indicador de carga en los resultados
function showLoading() {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Limpiar contenido previo

    const skeleton = document.createElement('div');
    skeleton.className = 'loading-skeleton';
    skeleton.innerHTML = '<div class="skeleton-card"></div>'.repeat(3); // Múltiples tarjetas de carga
    resultContainer.appendChild(skeleton);
}

// Función para ocultar el indicador de carga
function hideLoading() {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Limpiar el esqueleto una vez cargado
}

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

// Función principal para manejar la búsqueda
async function handleSearch(query) {
    const resultContainer = document.getElementById('resultContainer');

    // Si el campo de búsqueda está vacío, limpiar el contenedor y salir
    if (!query) {
        resultContainer.innerHTML = ''; // Limpiar contenedor de resultados
        return;
    }

    // Mostrar efecto de carga antes de realizar la búsqueda
    showLoading();

    // Si el query es un número, buscar solo un Pokémon por ID
    if (!isNaN(query)) {
        try {
            const pokemon = await getPokemonByIdOrName(query);
            hideLoading(); // Ocultar el esqueleto una vez que los datos estén disponibles
            renderPokemonCards([pokemon]); // Mostrar solo una card
        } catch (error) {
            hideLoading();
            const modal = new Modal({
                message: 'No se encontró ningún Pokémon con ese ID',
                buttonText: 'Cerrar',
                type: 'error'
            });
            modal.createAlert(); // Mostrar la alerta
        }
    } else {
        // Si es un texto, buscar múltiples Pokémon por nombre parcial
        try {
            const pokemons = await searchPokemonsByName(query);
            const pokemonDetailsPromises = pokemons.map(pokemon => getPokemonByIdOrName(pokemon.name));
            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
            hideLoading();
            renderPokemonCards(pokemonDetails); // Mostrar todas las cards encontradas
        } catch (error) {
            hideLoading();
            const modal = new Modal({
                message: 'No se encontraron Pokémon con ese nombre',
                buttonText: 'Cerrar',
                type: 'error'
            });
            modal.createAlert(); // Mostrar la alerta
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
