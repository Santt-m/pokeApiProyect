// ./app.js
import "./src/js/header.js";
import {initPokedex} from './src/js/pokedex.js';

document.addEventListener('DOMContentLoaded', () => {
    const pokedexSection = document.getElementById('pokedex');

    if (pokedexSection) {
        initPokedex();
    }
});
