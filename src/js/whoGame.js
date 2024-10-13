// src/js/whoGame.js

import { getRandomPokemon, getTwoRandomPokemons } from './api.js';
import Modal from './modal.js'; 

let correctPokemon = null;
let score = 0; // Puntaje del jugador
let streak = 0; // Racha de victorias
let timer = null; // Temporizador

// Variables de configuración
const GAME_DURATION = 10; // Duración del juego en segundos por Pokémon
const TIMEOUT_SCORE_PENALTY = 1; // Penalización por no responder a tiempo

// Función para inicializar el juego
export async function initWhoGame() {
    const pokemonImage = document.getElementById('pokemon-silhouette');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const timerDisplay = document.getElementById('timer-display');

    if (!pokemonImage || !optionsContainer || !feedback || !timerDisplay) {
        console.warn('El contenedor del juego "¿Quién es este Pokémon?" no está presente en esta página.');
        return;
    }

    await startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay);
}

// Función para empezar un nuevo juego
async function startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay) {
    try {
        const pokemon = await getRandomPokemon();
        correctPokemon = pokemon;

        pokemonImage.src = pokemon.sprites.front_default;
        pokemonImage.classList.remove('revealed');
        pokemonImage.style.filter = 'brightness(0)';

        await generateOptions(pokemon, optionsContainer);

        feedback.textContent = '';
        startTimer(timerDisplay, pokemonImage, optionsContainer, feedback); // Iniciar el temporizador
    } catch (error) {
        feedback.textContent = 'Error al cargar el Pokémon. Inténtalo de nuevo más tarde.';
        feedback.style.color = 'red';
    }
}

// Función para generar las opciones del juego
async function generateOptions(correctPokemon, container) {
    container.innerHTML = ''; 
    const randomOptions = [correctPokemon.name];

    const additionalPokemons = await getTwoRandomPokemons(correctPokemon.name);
    randomOptions.push(...additionalPokemons);

    randomOptions.sort(() => Math.random() - 0.5);

    randomOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(option, container)); // Comprobar la respuesta
        container.appendChild(button);
    });
}

// Función para iniciar el temporizador
function startTimer(timerDisplay, pokemonImage, optionsContainer, feedback) {
    let timeLeft = GAME_DURATION;
    timerDisplay.textContent = `${timeLeft} seg`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft} seg`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            feedback.textContent = `¡Tiempo agotado! El Pokémon era ${correctPokemon.name}`;
            feedback.classList.add('incorrect'); // Agregar clase incorrecta
            streak = 0; // Reiniciar la racha
            score -= TIMEOUT_SCORE_PENALTY; // Penalización por no responder a tiempo
            revealPokemon(pokemonImage);
            setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000); // Cargar nuevo Pokémon
        }
    }, 1000);
}

// Función para comprobar la respuesta del usuario
function checkAnswer(selectedOption, optionsContainer) {
    clearInterval(timer); // Detener el temporizador
    const pokemonImage = document.getElementById('pokemon-silhouette');
    const feedback = document.getElementById('feedback');
    const timerDisplay = document.getElementById('timer-display'); // Asegúrate de definir timerDisplay aquí

    if (selectedOption === correctPokemon.name) {
        pokemonImage.classList.add('revealed');
        pokemonImage.style.filter = 'brightness(1)'; // Mostrar la imagen completa
        feedback.textContent = '¡Correcto!';
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        score++; // Aumentar el puntaje
        streak++; // Aumentar la racha
        setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000); // Cargar nuevo Pokémon
    } else {
        feedback.textContent = `¡Incorrecto! El Pokémon era ${correctPokemon.name}`;
        feedback.classList.add('incorrect'); // Agregar clase incorrecta
        streak = 0; // Reiniciar la racha
        revealPokemon(pokemonImage);
        setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000); // Cargar nuevo Pokémon
    }
}

// Función para revelar el Pokémon
function revealPokemon(pokemonImage) {
    pokemonImage.classList.add('revealed');
    pokemonImage.style.filter = 'brightness(1)'; // Mostrar la imagen completa
}

// Evento que inicializa el juego cuando el documento está listo
document.addEventListener('DOMContentLoaded', () => {
    initWhoGame();
});
