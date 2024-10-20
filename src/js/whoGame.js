// src/js/whoGame.js

import { getRandomPokemon, getTwoRandomPokemons } from './api.js';
import Modal from './modal.js'; // Importar la clase Modal para usar las alertas

let correctPokemon = null;
let score = 0; // Puntaje del jugador
let streak = 0; // Racha de victorias
let timer = null; // Temporizador

const GAME_DURATION = 10; // Duración del juego en segundos por Pokémon
const TIMEOUT_SCORE_PENALTY = 1; // Penalización por no responder a tiempo

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

async function startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay) {
    try {
        const pokemon = await getRandomPokemon();
        correctPokemon = pokemon;

        pokemonImage.src = pokemon.sprites.front_default;
        pokemonImage.classList.remove('revealed');
        pokemonImage.style.filter = 'brightness(0)';

        await generateOptions(pokemon, optionsContainer);

        feedback.textContent = '';
        startTimer(timerDisplay, pokemonImage, optionsContainer, feedback);
    } catch (error) {
        // Capturar errores y mostrar alerta con el sistema de modales
        const modal = new Modal({
            message: 'Error al cargar el Pokémon. Inténtalo de nuevo más tarde.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

async function generateOptions(correctPokemon, container) {
    container.innerHTML = ''; 
    const randomOptions = [correctPokemon.name];

    try {
        const additionalPokemons = await getTwoRandomPokemons(correctPokemon.name);
        randomOptions.push(...additionalPokemons);

        randomOptions.sort(() => Math.random() - 0.5);

        randomOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => checkAnswer(option, container));
            container.appendChild(button);
        });
    } catch (error) {
        // Capturar error al generar opciones y mostrar una alerta
        const modal = new Modal({
            message: 'Error al generar las opciones. Inténtalo de nuevo.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

function startTimer(timerDisplay, pokemonImage, optionsContainer, feedback) {
    let timeLeft = GAME_DURATION;
    timerDisplay.textContent = `${timeLeft} seg`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft} seg`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            feedback.textContent = `¡Tiempo agotado! El Pokémon era ${correctPokemon.name}`;
            feedback.classList.add('incorrect');
            streak = 0;
            score -= TIMEOUT_SCORE_PENALTY;
            revealPokemon(pokemonImage);
            setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000);
        }
    }, 1000);
}

function checkAnswer(selectedOption, optionsContainer) {
    clearInterval(timer);
    const pokemonImage = document.getElementById('pokemon-silhouette');
    const feedback = document.getElementById('feedback');
    const timerDisplay = document.getElementById('timer-display');

    if (selectedOption === correctPokemon.name) {
        pokemonImage.classList.add('revealed');
        pokemonImage.style.filter = 'brightness(1)';
        feedback.textContent = '¡Correcto!';
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        score++;
        streak++;
        setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000);
    } else {
        feedback.textContent = `¡Incorrecto! El Pokémon era ${correctPokemon.name}`;
        feedback.classList.add('incorrect');
        streak = 0;
        revealPokemon(pokemonImage);
        setTimeout(() => startNewGame(pokemonImage, optionsContainer, feedback, timerDisplay), 2000);
    }
}

function revealPokemon(pokemonImage) {
    pokemonImage.classList.add('revealed');
    pokemonImage.style.filter = 'brightness(1)';
}

document.addEventListener('DOMContentLoaded', () => {
    initWhoGame();
});
