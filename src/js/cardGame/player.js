// .src/js/cardGame/

import { createPokemonCard } from '../card.js';  // Reutilizamos card.js


export function createPlayer(name, cards) {
    return {
        name,
        cards,
        hp: 100,  // Vida total del jugador
    };
}

export function dealCards(pokemons, numberOfCards) {
    const cards = [];
    while (cards.length < numberOfCards) {
        const randomIndex = Math.floor(Math.random() * pokemons.results.length);
        const pokemon = pokemons.results[randomIndex];
        cards.push(createCard(pokemon.name, pokemon.url));  // Creamos la carta
    }
    return cards;
}
