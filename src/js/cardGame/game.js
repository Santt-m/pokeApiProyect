// src/js/game.js

import { fetchPokemons, fetchPokemonData } from '../api.js'; 
import { createPokemonCard } from '../card.js'; 
import Modal from '../modal.js'; // Importar la clase Modal

let player1Points = 0;
let player2Points = 0;
const totalRounds = 3; 

// Función para repartir cartas a los jugadores
async function dealCards(pokemons, numberOfCards) {
    const cards = [];
    while (cards.length < numberOfCards) {
        const randomIndex = Math.floor(Math.random() * pokemons.results.length);
        const pokemonData = pokemons.results[randomIndex];
        try {
            const pokemon = await fetchPokemonData(pokemonData.url);
            cards.push(pokemon);
        } catch (error) {
            const modal = new Modal({
                message: 'Error al cargar la información de un Pokémon. Inténtalo de nuevo.',
                buttonText: 'Cerrar',
                type: 'error'
            });
            modal.createAlert();
        }
    }
    return cards;
}

// Función para renderizar cartas de cada jugador
function renderPlayerCards(player, container) {
    if (!container) {
        const modal = new Modal({
            message: `El contenedor para ${player.name} no existe.`,
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
        return; 
    }

    container.innerHTML = ''; // Limpiar el contenedor
    player.cards.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        const listItem = document.createElement('li');
        listItem.appendChild(card);
        container.appendChild(listItem);

        // Evento para seleccionar una carta y moverla al área de batalla
        card.addEventListener('click', () => {
            moveCardToBattle(player, index);
        });
    });
}

// Función para mover la carta seleccionada al área de batalla
function moveCardToBattle(player, cardIndex) {
    const battleCardContainer = player.name === 'Player 1' ? document.getElementById('player1Card') : document.getElementById('player2Card');
    const battleImage = player.name === 'Player 1' ? document.getElementById('player1CardImage') : document.getElementById('player2CardImage');

    if (!battleCardContainer || !battleImage) {
        const modal = new Modal({
            message: `El contenedor de batalla para ${player.name} no existe.`,
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
        return;
    }

    const selectedCard = player.cards[cardIndex];

    // Mover carta actual a la batalla
    battleImage.src = selectedCard.sprites.front_default; 
    player.selectedCard = selectedCard; 
    player.cards.splice(cardIndex, 1); // Remover la carta seleccionada del mazo

    // Actualizar las cartas mostradas
    renderPlayerCards(player, document.getElementById(`${player.name.toLowerCase()}-cards`));
}

// Función para iniciar el juego
export async function startGame() {
    try {
        const pokemons = await fetchPokemons();
        const player1Cards = await dealCards(pokemons, totalRounds); 
        const player2Cards = await dealCards(pokemons, totalRounds); 

        const player1 = { name: 'Player 1', cards: player1Cards, selectedCard: null };
        const player2 = { name: 'Player 2', cards: player2Cards, selectedCard: null };

        renderPlayerCards(player1, document.getElementById('player1-cards'));
        renderPlayerCards(player2, document.getElementById('player2-cards'));

        // Guardar los jugadores para la batalla
        window.players = { player1, player2 };
        
        // Habilitar el botón de jugar
        document.getElementById('gameButton').addEventListener('click', startBattle);

    } catch (error) {
        const modal = new Modal({
            message: 'Error al iniciar el juego. Inténtalo de nuevo.',
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
    }
}

// Función para realizar la batalla
export function startBattle() {
    const { player1, player2 } = window.players;

    if (!player1.selectedCard || !player2.selectedCard) {
        const modal = new Modal({
            message: 'Ambos jugadores deben seleccionar una carta antes de iniciar la batalla.',
            buttonText: 'Cerrar',
            type: 'warning'
        });
        modal.createAlert();
        return;
    }

    // Obtener estadísticas de las cartas seleccionadas
    const player1Attack = player1.selectedCard.stats[1].base_stat;
    const player2Defense = player2.selectedCard.stats[2].base_stat;

    const player2Attack = player2.selectedCard.stats[1].base_stat;
    const player1Defense = player1.selectedCard.stats[2].base_stat;

    // Calcular daño
    const player1Damage = Math.max(0, player1Attack - player2Defense);
    const player2Damage = Math.max(0, player2Attack - player1Defense);

    // Mostrar resultados
    const battleGame = document.getElementById('battleGame');
    let resultMessage = '';

    if (player1Damage > player2Damage) {
        player1Points++;
        resultMessage = `¡Player 1 gana esta ronda!`;
        removeLosingCard(player2);
    } else if (player2Damage > player1Damage) {
        player2Points++;
        resultMessage = `¡Player 2 gana esta ronda!`;
        removeLosingCard(player1);
    } else {
        resultMessage = `Empate en esta ronda.`;
    }

    // Actualizar puntos en el banner
    document.getElementById('player1Points').textContent = player1Points;
    document.getElementById('player2Points').textContent = player2Points;

    // Mostrar resultado de la batalla con tabla estilizada
    battleGame.innerHTML = `
        <h3>${resultMessage}</h3>
        <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Jugador</th>
                    <th>Ataque</th>
                    <th>Defensa</th>
                    <th>Daño Causado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Player 1</td>
                    <td>${player1Attack}</td>
                    <td>${player1Defense}</td>
                    <td>${player1Damage}</td>
                </tr>
                <tr>
                    <td>Player 2</td>
                    <td>${player2Attack}</td>
                    <td>${player2Defense}</td>
                    <td>${player2Damage}</td>
                </tr>
            </tbody>
        </table>
    `;

    // Revisar si el juego ha terminado
    checkForWinner();
}

// Función para remover la carta que perdió
function removeLosingCard(losingPlayer) {
    losingPlayer.selectedCard = null; // Remover la carta seleccionada
    renderPlayerCards(losingPlayer, document.getElementById(`${losingPlayer.name.toLowerCase()}-cards`)); // Actualizar cartas
}

// Función para revisar si se han jugado todas las rondas y determinar un ganador
function checkForWinner() {
    const { player1, player2 } = window.players;

    if (player1.cards.length === 0 && player2.cards.length === 0) {
        let winner = '';

        if (player1Points > player2Points) {
            winner = 'Player 1 gana el juego!';
        } else if (player2Points > player1Points) {
            winner = 'Player 2 gana el juego!';
        } else {
            winner = 'El juego terminó en empate!';
        }

        const modal = new Modal({
            message: winner,
            buttonText: 'Cerrar',
            type: 'info'
        });
        modal.createAlert();
    }
}
