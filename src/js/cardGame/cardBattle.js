export function battleCards(player1, player2) {
    const player1Card = player1.cards[0];  // Primera carta de Player 1
    const player2Card = player2.cards[0];  // Primera carta de Player 2

    const attack1 = player1Card.stats.attack;
    const defense2 = player2Card.stats.defense;

    const damageToPlayer2 = attack1 - defense2;
    player2.hp -= Math.max(damageToPlayer2, 0);  // Restamos la vida de Player 2

    updateHealthDisplay(player2);

    // Aquí podrías implementar la mecánica de turnos y rotación de cartas.
}

function updateHealthDisplay(player) {
    const healthElement = document.getElementById(`${player.name}-health`);
    healthElement.textContent = `HP: ${player.hp}`;
}
