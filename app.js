import { initPokedex } from './src/js/pokedex.js';

document.addEventListener('DOMContentLoaded', () => {
    const pokedexSection = document.getElementById('pokedex');

    if (pokedexSection) {
        initPokedex();  // Iniciar la lógica de la Pokedex
    }
});
