// ./src/js/card.js

import { localIcons } from './api.js';

// Otros íconos locales (mantienen la estructura previa)
const ICON_HEALTH = '../src/icons/health.png';
const ICON_ATTACK = '../src/icons/attack.png';
const ICON_DEFENSE = '../src/icons/defense.png';
const ICON_SPEED = '../src/icons/speed.png';
const ICON_HEIGHT = "../src/icons/height.png";
const ICON_WEIGHT = "../src/icons/weight.png";
const ICON_XP = "../src/icons/xp.png";

// funcion para obtener el icono
function getTypeIcon(type) {
    return localIcons[type] || localIcons.unknown;
}

// Función para crear la carta de un Pokémon.

export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = `cardPokemon type-${pokemon.types[0].type.name}`;

    const pokemonSprite = pokemon.sprites.front_default || '../src/icons/placeholder.png';

    const typesList = pokemon.types.map(t => `
        <li class="type-${t.type.name}">
            <img src="${getTypeIcon(t.type.name)}" alt="${t.type.name} Icon">
            <p>${t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</p>
        </li>
    `).join('');

    const healthStat = pokemon.stats[0]?.base_stat || 'N/A';
    const attackStat = pokemon.stats[1]?.base_stat || 'N/A';
    const defenseStat = pokemon.stats[2]?.base_stat || 'N/A';
    const speedStat = pokemon.stats[5]?.base_stat || 'N/A';

    const pokemonHeight = pokemon.height ? `${pokemon.height * 10} cm` : 'N/A';
    const pokemonWeight = pokemon.weight ? `${pokemon.weight / 10} kg` : 'N/A';
    const baseXP = pokemon.base_experience || 'N/A';

    card.innerHTML = `
        <div class="cardPokemon_head">
            <p class="cardPokemon_head_ID">#${pokemon.id}</p>
            <p class="cardPokemon_head_Name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            <div class="cardPokemon_head_health">
                <img src="${ICON_HEALTH}" alt="Health Icon"> <p>${healthStat}</p>
            </div>
            <ul class="cardPokemon_head_types">
                ${typesList}
            </ul>
        </div>

        <div class="cardPokemon_body">
            <div class="cardPokemon_cont">
                <img src="${pokemonSprite}" alt="${pokemon.name}">
                <ul>
                    <li><img src="${ICON_HEIGHT}" alt="Height Icon"><p>${pokemonHeight}</p></li>
                    <li><img src="${ICON_WEIGHT}" alt="Weight Icon"><p>${pokemonWeight}</p></li>
                    <li><img src="${ICON_XP}" alt="XP Icon"><p>${baseXP} XP</p></li>
                </ul>
            </div>
            <ul class="cardPokemon_cont_stats">
                <li><img src="${ICON_ATTACK}" alt="Attack Icon"><p>${attackStat}</p></li>
                <li><img src="${ICON_DEFENSE}" alt="Defense Icon"><p>${defenseStat}</p></li>
                <li><img src="${ICON_SPEED}" alt="Speed Icon"><p>${speedStat}</p></li>
            </ul>
        </div>
    `;

    return card;
}
