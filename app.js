import "./src/js/header.js";
import { initPokedex } from './src/js/pokedex.js';
import { initWhoGame } from './src/js/whoGame.js';

document.addEventListener('DOMContentLoaded', () => {
    const pokedexSection = document.getElementById('pokedex');
    const whoGameSection = document.getElementById('whoGame');
    
    // Verificamos si existe la sección 'whoGame' para inicializar el juego
    if (whoGameSection) {
        initWhoGame();
    } else {
        console.log('No section whoGame');
    }
    
    // Verificamos si existe la sección 'pokedex' para inicializar la Pokedex
    if (pokedexSection) {
        initPokedex();
    } else {
        console.log('No section pokedex');
    }
});
