import "./src/js/header.js";

document.addEventListener('DOMContentLoaded', async () => {
    const pokedexSection = document.getElementById('pokedex');

    const findPokemon    = document.getElementById('pokemonFinder');
    const whoGameSection = document.getElementById('whoGame');
    const cardGameSection = document.getElementById('cardGame');

    // Cargamos el script de la Pokédex solo si existe la sección
    if (pokedexSection) {
        try {
            const { initPokedex } = await import('./src/js/pokedex.js');
            initPokedex();
        } catch (error) {
            console.error('Error al cargar el módulo de la Pokédex:', error);
        }
    }
    
    // cargamos el script de findPokemon solo si existe la sección
    if (findPokemon) {
        try {
            const  { initFindPokemon } = await import('./src/js/findPokemon.js');
            initFindPokemon();
        } catch (error) {
            console.error('Error al cargar el módulo de findPokemon:', error);
        }
    }


    // Cargamos el script del juego Who's That Pokemon solo si existe la sección
    if (whoGameSection) {
        try {
            const { initWhoGame } = await import('./src/js/whoGame.js');
            initWhoGame();
        } catch (error) {
            console.error('Error al cargar el módulo del juego WhoGame:', error);
        }
    }

    // Cargamos el script del juego de cartas solo si existe la sección
    if (cardGameSection) {
        try {
            const { startGame, startBattle } = await import('./src/js/cardGame/game.js');
            startGame();  // Inicia el juego
        } catch (error) {
            console.error('Error al cargar el módulo del juego de cartas:', error);
        }
    }
});
