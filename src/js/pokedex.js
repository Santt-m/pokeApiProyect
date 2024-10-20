// ./src/js/pokedex.js

import {
    getAllPokemons,
    getPokemonsByType,
    getPokemonsByGeneration,
    getPokemonsByHabitat,
    getPokemonDetails,
    getFiltersData,
    localIcons,
} from "./api.js";
import { createPokemonCard } from "./card.js";
import Modal from './modal.js'; // Importar la clase Modal para usar los alerts

// Variables para scroll infinito
let loading = false; // Para evitar múltiples llamadas simultáneas
let offset = 0; // Desplazamiento inicial
const limit = 20; // Número de Pokémon a cargar por solicitud
let filteredPokemons = []; // Arreglo para almacenar Pokémon filtrados
const cardContainer = document.getElementById("card-container"); // Contenedor de tarjetas

// Función para crear los botones de tipo, generación y hábitat
function createFilterButtons(filters) {
    const typeButtonsContainer = document.getElementById("type-buttons");
    if (!typeButtonsContainer) {
        console.warn("No existe el contenedor de botones de tipo");
        return;
    }

    // Crear los botones de tipo
    filters.types.forEach((type) => {
        const button = createButton(type.name, localIcons[type.name], () =>
            filterByType(type.name)
        );
        typeButtonsContainer.appendChild(button);
    });

    // Crear botones para generaciones
    filters.generations.forEach((generation) => {
        const generationId = generation.url.split("/").filter(Boolean).pop(); // Extraer el ID
        const button = createButton(generation.name, null, () =>
            filterByGeneration(generationId)
        );
        typeButtonsContainer.appendChild(button);
    });

    // Crear botones para hábitats
    filters.habitats.forEach((habitat) => {
        const button = createButton(habitat.name, null, () =>
            filterByHabitat(habitat.name)
        );
        typeButtonsContainer.appendChild(button);
    });

    // Crear el botón "Ver Todos"
    const showAllButton = createButton(
        "Ver Todos",
        localIcons.all,
        showAllPokemon
    );
    typeButtonsContainer.appendChild(showAllButton);
}

// Función para crear un botón con icono
function createButton(text, iconSrc, clickHandler) {
    const button = document.createElement("button");
    button.classList.add("type-button");

    if (iconSrc) {
        const icon = document.createElement("img");
        icon.src = iconSrc;
        icon.alt = `${text} icon`;
        icon.classList.add("type-icon");
        button.appendChild(icon);
    }

    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", () => {
        clickHandler();
        setActiveButton(button);
    });

    return button;
}

// Función para marcar el botón clicado como activo y desactivar los otros
function setActiveButton(activeButton) {
    const buttons = document.querySelectorAll(".type-button");
    buttons.forEach((button) => button.classList.remove("active"));
    activeButton.classList.add("active");
}

// Función para mostrar todos los Pokémon
async function showAllPokemon() {
    offset = 0; // Reiniciar el desplazamiento
    filteredPokemons = []; // Limpiar los Pokémon filtrados
    try {
        await loadMorePokemons(); // Cargar Pokémon al inicializar
    } catch (error) {
        // Mostrar alerta si ocurre un error
        const modal = new Modal({
            message: 'Error al cargar todos los Pokémon.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

// Función para cargar más Pokémon
async function loadMorePokemons() {
    if (loading) return; // Si ya está cargando, no hacer nada
    loading = true; // Establecer el estado de carga

    let pokemonList = [];
    
    try {
        if (filteredPokemons.length > 0) {
            // Si hay Pokémon filtrados, cargamos de ese arreglo
            pokemonList = filteredPokemons.slice(offset, offset + limit);
        } else {
            // Cargar más Pokémon si no hay filtros
            const result = await getAllPokemons(offset, limit);
            pokemonList = result.results || []; // Asegurarse de que sea un arreglo
        }

        // Asegurarse de que hay Pokémon para cargar
        if (pokemonList.length === 0) {
            const modal = new Modal({
                message: 'No hay más Pokémon para cargar.',
                buttonText: 'Cerrar',
                type: 'info'
            });
            modal.createAlert();
            loading = false; // Restablecer el estado de carga
            return; // Salir si no hay más Pokémon
        }

        offset += limit; // Aumentar el desplazamiento

        // Cargar detalles de Pokémon
        const pokemonDetailsPromises = pokemonList.map((pokemon) =>
            getPokemonDetails(pokemon.url)
        );

        const pokemonDetailsArray = await Promise.all(pokemonDetailsPromises);

        pokemonDetailsArray.forEach((pokemonDetails) => {
            if (pokemonDetails) {
                const pokemonCard = createPokemonCard(pokemonDetails);
                cardContainer.appendChild(pokemonCard);
            }
        });

        loading = false; // Restablecer el estado de carga
    } catch (error) {
        loading = false;
        // Mostrar alerta de error
        const modal = new Modal({
            message: 'Error al cargar más Pokémon.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

// Funciones para filtrar Pokémon por tipo, generación y hábitat
async function filterByType(type) {
    offset = 0; // Reiniciar el desplazamiento
    try {
        filteredPokemons = await getPokemonsByType(type); // Obtener Pokémon filtrados
        renderPokemonCards(filteredPokemons); // Renderizar directamente los Pokémon filtrados
    } catch (error) {
        const modal = new Modal({
            message: `Error al filtrar por tipo: ${type}.`,
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

async function filterByGeneration(generation) {
    offset = 0; // Reiniciar el desplazamiento
    try {
        filteredPokemons = await getPokemonsByGeneration(generation); // Obtener Pokémon filtrados
        renderPokemonCards(filteredPokemons); // Renderizar directamente los Pokémon filtrados
    } catch (error) {
        const modal = new Modal({
            message: `Error al filtrar por generación: ${generation}.`,
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

async function filterByHabitat(habitat) {
    offset = 0; // Reiniciar el desplazamiento
    try {
        filteredPokemons = await getPokemonsByHabitat(habitat); // Obtener Pokémon filtrados
        renderPokemonCards(filteredPokemons); // Renderizar directamente los Pokémon filtrados
    } catch (error) {
        const modal = new Modal({
            message: `Error al filtrar por hábitat: ${habitat}.`,
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

// Función para renderizar las tarjetas de Pokémon
function renderPokemonCards(pokemonList) {
    cardContainer.innerHTML = ""; // Limpiar el contenedor

    const pokemonDetailsPromises = pokemonList.map((pokemon) =>
        getPokemonDetails(pokemon.url)
    );

    Promise.all(pokemonDetailsPromises).then((pokemonDetailsArray) => {
        pokemonDetailsArray.forEach((pokemonDetails) => {
            if (pokemonDetails) {
                const pokemonCard = createPokemonCard(pokemonDetails);
                cardContainer.appendChild(pokemonCard);
            }
        });
    }).catch(error => {
        const modal = new Modal({
            message: 'Error al renderizar las tarjetas de Pokémon.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    });
}

// Inicializar filtros y Pokémon al cargar la página
export async function initPokedex() {
    try {
        const filters = await getFiltersData();
        createFilterButtons(filters);
        await showAllPokemon(); // Cargar Pokémon al inicializar
    } catch (error) {
        const modal = new Modal({
            message: 'Error al inicializar la Pokédex.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

// Evento de desplazamiento para cargar más Pokémon
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMorePokemons(); // Llamar a la función para cargar más Pokémon
    }
});
