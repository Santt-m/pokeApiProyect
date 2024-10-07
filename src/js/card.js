// Icon URLs
const ICON_HEALTH = '../src/icons/health.png';
const ICON_ATTACK = '../src/icons/attack.png';
const ICON_DEFENSE = '../src/icons/defense.png';
const ICON_SPEED = '../src/icons/speed.png';

const ICON_HEIGHT = "../src/icons/height.png";
const ICON_WEIGHT = "../src/icons/weight.png";
const ICON_XP = "../src/icons/xp.png";


// Mapa de íconos por tipo de Pokémon
const typeIcons = {
    fire: '../src/icons/fire.avif',
    water: '../src/icons/water.avif',
    grass: '../src/icons/grass.avif',
    electric: '../src/icons/electric.avif',
    poison: '../src/icons/poison.avif',
    normal: '../src/icons/normal.avif',
    ice: '../src/icons/ice.avif',
    fighting: '../src/icons/fighting.avif',
    ground: '../src/icons/ground.avif',
    flying: '../src/icons/fighting.avif',
    psychic: '../src/icons/psychic.avif',
    bug: '../src/icons/bug.avif',
    rock: '../src/icons/rock.avif',
    ghost: '../src/icons/ghost.avif',
    dark: '../src/icons/dark.avif',
    dragon: '../src/icons/dragon.avif',
    steel: '../src/icons/steel.avif',
    fairy: '../src/icons/fairy.avif',
    // Agrega más tipos si es necesario
};

// Función para obtener el ícono del tipo de Pokémon
function getTypeIcon(type) {
    return typeIcons[type] || ICON_TYPE;  // Fallback a ICON_TYPE si no se encuentra el tipo
}

// Función para crear la carta Pokémon
export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = `cardPokemon type-${pokemon.types[0].type.name}`;  // Agregar clase según el primer tipo

    // Generar la lista de tipos como HTML
    const typesList = pokemon.types.map(t => `
        <li class="type-${t.type.name}">
            <img src="${getTypeIcon(t.type.name)}" alt="${t.type.name} Icon">
            <p>${t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</p>
        </li>
    `).join('');

    // Crear el HTML de la tarjeta
    card.innerHTML = `
        <div class="cardPokemon_head">
            <p class="cardPokemon_head_ID">#${pokemon.id}</p>
            <p class="cardPokemon_head_Name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            <div class="cardPokemon_head_health">
                <img src="${ICON_HEALTH}" alt="Health Icon"> <p>${pokemon.stats[0].base_stat}</p>
            </div>
            <ul class="cardPokemon_head_types">
                ${typesList}
            </ul>
        </div>

        <div class="cardPokemon_body">
            <div class="cardPokemon_cont">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <ul>
                    <li><img src="${ICON_HEIGHT}"><p>${pokemon.height}0</p></li>
                    <li><img src="${ICON_WEIGHT}"><p>${pokemon.weight}</p></li>
                    <li><img src="${ICON_XP}"><p> ${pokemon.base_experience}</p></li>
                </ul>
            </div>
            <ul class="cardPokemon_cont_stats">
                <li><img src="${ICON_ATTACK}"><p>${pokemon.stats[1].base_stat}</p></li>
                <li><img src="${ICON_DEFENSE}"><p>${pokemon.stats[2].base_stat}</p></li>
                <li><img src="${ICON_SPEED}"> <p>${pokemon.stats[5].base_stat}</p></li>
            </ul>
        </div>

        <ul class="cardPokemon_footer"></ul>
    `;

    return card;
}
