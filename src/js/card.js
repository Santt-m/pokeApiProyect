// ./src/js/card.js

// Icon URLs
const ICON_HEALTH = '../src/icons/health.png';
const ICON_ATTACK = '../src/icons/attack.png';
const ICON_DEFENSE = '../src/icons/defense.png';
const ICON_SPEED = '../src/icons/speed.png';

const ICON_HEIGHT = "../src/icons/height.png";
const ICON_WEIGHT = "../src/icons/weight.png";
const ICON_XP = "../src/icons/xp.png";

// Mapa de íconos por tipo de Pokémon
export const typeIcons = {
    normal: '../src/icons/normal.png',
    fighting: '../src/icons/fighting.png',
    flying: '../src/icons/flying.png',
    poison: '../src/icons/poison.png',
    ground: '../src/icons/ground.png',
    rock: '../src/icons/rock.png',
    bug: '../src/icons/bug.png',
    ghost: '../src/icons/ghost.png',
    steel: '../src/icons/steel.png',
    fire: '../src/icons/fire.png',
    water: '../src/icons/water.png',
    grass: '../src/icons/grass.png',
    electric: '../src/icons/electric.png',
    psychic: '../src/icons/psychic.png',
    ice: '../src/icons/ice.png',
    dragon: '../src/icons/dragon.png',
    dark: '../src/icons/dark.png',
    fairy: '../src/icons/fairy.avif',
    stellar: '../src/icons/stellar.png',
    unknown: '../src/icons/unknown.png',
    all: '../src/icons/all.png',
};

// Función para obtener el ícono del tipo de Pokémon
function getTypeIcon(type) {
    return typeIcons[type] || typeIcons.unknown;  // Fallback a 'unknown' si no se encuentra el tipo
}

// Función para crear la carta Pokémon
export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = `cardPokemon type-${pokemon.types[0].type.name}`;  // Agregar clase según el primer tipo

    // Verificar si el Pokémon tiene sprite, usar un placeholder si no lo tiene
    const pokemonSprite = pokemon.sprites.front_default || '../src/icons/placeholder.png';

    // Generar la lista de tipos como HTML
    const typesList = pokemon.types.map(t => `
        <li class="type-${t.type.name}">
            <img src="${getTypeIcon(t.type.name)}" alt="${t.type.name} Icon">
            <p>${t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</p>
        </li>
    `).join('');

    // Verificar que las estadísticas del Pokémon estén disponibles
    const healthStat = pokemon.stats[0]?.base_stat || 'N/A';
    const attackStat = pokemon.stats[1]?.base_stat || 'N/A';
    const defenseStat = pokemon.stats[2]?.base_stat || 'N/A';
    const speedStat = pokemon.stats[5]?.base_stat || 'N/A';

    // Verificar otras propiedades del Pokémon
    const pokemonHeight = pokemon.height ? `${pokemon.height * 10} cm` : 'N/A';
    const pokemonWeight = pokemon.weight ? `${pokemon.weight / 10} kg` : 'N/A';
    const baseXP = pokemon.base_experience || 'N/A';

    // Crear el HTML de la tarjeta
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

        <ul class="cardPokemon_footer"></ul>
    `;

    return card;
}
