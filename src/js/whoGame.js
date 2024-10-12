import { getRandomPokemon } from './api.js';

let correctPokemon = null;

// Función para inicializar el juego
export async function initWhoGame() {
    const pokemonImage = document.getElementById('pokemon-silhouette');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    
    // Iniciar el juego automáticamente
    await startNewGame(pokemonImage, optionsContainer, feedback);
}

// Función para empezar un nuevo juego
async function startNewGame(pokemonImage, optionsContainer, feedback) {
    try {
        // Obtener un Pokémon aleatorio
        const pokemon = await getRandomPokemon();
        correctPokemon = pokemon;

        // Mostrar la silueta del Pokémon
        pokemonImage.src = pokemon.sprites.front_default; // Usar la imagen frontal
        pokemonImage.classList.remove('revealed');
        pokemonImage.style.filter = 'brightness(0)'; // Oscurecer para hacer la silueta

        // Generar opciones de respuesta
        await generateOptions(pokemon, optionsContainer);

        // Limpiar el feedback
        feedback.textContent = '';
    } catch (error) {
        feedback.textContent = 'Error al cargar el Pokémon. Inténtalo de nuevo más tarde.';
        feedback.style.color = 'red';
    }
}

// Función para generar las opciones del juego
async function generateOptions(correctPokemon, container) {
    container.innerHTML = ''; // Limpiar opciones previas
    const randomOptions = [correctPokemon.name];

    // Obtener dos Pokémon adicionales diferentes al correcto
    const additionalPokemons = await getTwoRandomPokemons(correctPokemon.name);
    randomOptions.push(...additionalPokemons);

    // Mezclar las opciones para que no esté siempre en el mismo orden
    randomOptions.sort(() => Math.random() - 0.5);

    // Crear botones de opción
    randomOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(option));
        container.appendChild(button);
    });
}

// Función para obtener 2 Pokémon aleatorios diferentes al correcto
async function getTwoRandomPokemons(correctPokemonName) {
    const pokemons = [];
    while (pokemons.length < 2) {
        const randomPokemon = await getRandomPokemon();
        if (randomPokemon.name !== correctPokemonName && !pokemons.includes(randomPokemon.name)) {
            pokemons.push(randomPokemon.name);
        }
    }
    return pokemons;
}

// Función para comprobar la respuesta del usuario
function checkAnswer(selectedOption) {
    const pokemonImage = document.getElementById('pokemon-silhouette');
    const feedback = document.getElementById('feedback');
    
    if (selectedOption === correctPokemon.name) {
        // Respuesta correcta
        pokemonImage.classList.add('revealed'); // Revelar Pokémon
        pokemonImage.style.filter = 'brightness(1)'; // Mostrar el Pokémon
        feedback.textContent = '¡Correcto!';
        feedback.style.color = 'green';
    } else {
        // Respuesta incorrecta
        feedback.textContent = `Incorrecto. El Pokémon es ${correctPokemon.name}`;
        feedback.style.color = 'red';
    }
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initWhoGame);
