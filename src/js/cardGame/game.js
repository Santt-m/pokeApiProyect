import { fetchPokemons, fetchPokemonData, localIcons } from '../api.js';
import { createPokemonCard } from '../card.js';

// Función para repartir cartas
export async function dealCards(pokemons, numberOfCards) {
    const cards = [];
    while (cards.length < numberOfCards) {
        const randomIndex = Math.floor(Math.random() * pokemons.results.length);
        const pokemonData = pokemons.results[randomIndex];
        const pokemon = await fetchPokemonData(pokemonData.url);
        cards.push(pokemon);
    }
    return cards;
}

// Renderizar cartas del jugador
function renderPlayerCards(player, container) {
    container.innerHTML = ''; // Limpiamos cualquier carta anterior

    player.cards.forEach((pokemon) => {
        const card = createPokemonCard(pokemon); // Usamos la función de card.js
        container.appendChild(card); // Agregamos la carta al contenedor
    });

    // Agregar evento de selección a cada carta
    const cardElements = container.querySelectorAll('.cardPokemon');
    cardElements.forEach(card => {
        card.addEventListener('click', (event) => {
            const selectedCard = event.currentTarget;
            selectedCard.classList.toggle('selected'); // Alterna la clase 'selected' al hacer clic
        });
    });
}

// Iniciar juego
export async function startGame() {
    try {
        const pokemons = await fetchPokemons();
        const player1Cards = await dealCards(pokemons, 3); // Cartas para jugador 1
        const player2Cards = await dealCards(pokemons, 3); // Cartas para jugador 2

        // Crear jugadores
        const player1 = { name: 'Player 1', cards: player1Cards };
        const player2 = { name: 'Player 2', cards: player2Cards };

        // Renderizar las cartas en la pantalla
        renderPlayerCards(player1, document.getElementById('player1-cards'));
        renderPlayerCards(player2, document.getElementById('player2-cards'));

    } catch (error) {
        console.error('Error al iniciar el juego:', error);
    }
}

// Función para iniciar la batalla
export function startBattle() {
    const selectedCards1 = document.querySelectorAll('#player1-cards .selected');
    const selectedCards2 = document.querySelectorAll('#player2-cards .selected');

    if (selectedCards1.length === 0 || selectedCards2.length === 0) {
        alert('Por favor, selecciona al menos una carta de cada jugador.');
        return;
    }

    // Tomamos las cartas seleccionadas
    const player1Card = selectedCards1[0]; // Solo tomaremos la primera seleccionada para simplificar
    const player2Card = selectedCards2[0];

    // Obtener estadísticas de ataque y defensa
    const player1Attack = parseInt(player1Card.querySelector('.cardPokemon_cont_stats li img[alt="Attack Icon"]').nextElementSibling.textContent);
    const player1Defense = parseInt(player2Card.querySelector('.cardPokemon_cont_stats li img[alt="Defense Icon"]').nextElementSibling.textContent);
    
    const player2Attack = parseInt(player2Card.querySelector('.cardPokemon_cont_stats li img[alt="Attack Icon"]').nextElementSibling.textContent);
    const player2Defense = parseInt(player1Card.querySelector('.cardPokemon_cont_stats li img[alt="Defense Icon"]').nextElementSibling.textContent);
    
    // Calcular daños
    const player1Damage = player1Attack - player2Defense;
    const player2Damage = player2Attack - player1Defense;

    const player1Health = parseInt(player1Card.querySelector('.cardPokemon_head_health p').textContent);
    const player2Health = parseInt(player2Card.querySelector('.cardPokemon_head_health p').textContent);
    
    // Actualizar la salud
    const newPlayer1Health = Math.max(0, player1Health - player2Damage);
    const newPlayer2Health = Math.max(0, player2Health - player1Damage);

    // Mostrar resultados
    let resultMessage = '';
    if (newPlayer1Health === 0 && newPlayer2Health === 0) {
        resultMessage = 'Ambos Pokémon han sido derrotados.';
    } else if (newPlayer1Health === 0) {
        resultMessage = '¡El Pokémon de Player 2 ha ganado!';
    } else if (newPlayer2Health === 0) {
        resultMessage = '¡El Pokémon de Player 1 ha ganado!';
    } else {
        resultMessage = `Salud restante: Player 1: ${newPlayer1Health}, Player 2: ${newPlayer2Health}`;
    }

    alert(resultMessage); // Mostrar el resultado
}
