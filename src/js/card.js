// ./src/js/card.js
import { localIcons } from './api.js';

// Otros íconos locales
const ICONS = {
    health: '../src/icons/health.png',
    attack: '../src/icons/attack.png',
    defense: '../src/icons/defense.png',
    speed: '../src/icons/speed.png',
    height: "../src/icons/height.png",
    weight: "../src/icons/weight.png",
    xp: "../src/icons/xp.png"
};

// Función para crear la carta de un Pokémon.
export function createPokemonCard(pokemon) {
    const { id, name, types, stats, height, weight, base_experience, sprites } = pokemon;

    const card = document.createElement('div');
    card.className = `cardPokemon type-${types[0].type.name}`;

    // URL para los sprites SVG de Dream World y fallback a PNG si no está disponible
    const dreamWorldSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    const fallbackSpriteUrl = sprites?.front_default || localIcons.unknown;

    // Usar localIcons para obtener el ícono del tipo
    const typesList = types.map(t => `
        <li class="type-${t.type.name}">
            <img src="${localIcons[t.type.name] || localIcons.unknown}" alt="${t.type.name} Icon">
            <p>${t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</p>
        </li>
    `).join('');

    const [healthStat = 'N/A', attackStat = 'N/A', defenseStat = 'N/A', , , speedStat = 'N/A'] = stats.map(stat => stat.base_stat);

    const pokemonHeight = height ? `${height * 10} cm` : 'N/A';
    const pokemonWeight = weight ? `${weight / 10} kg` : 'N/A';
    const baseXP = base_experience || 'N/A';

    card.innerHTML = `
        <div class="cardPokemon_head">
            <div class="cardPokemon_head_ID">
                <img src="${fallbackSpriteUrl}" alt="${pokemon.name} sprite" class="cardPokemon_head_ID_logo" onerror="this.onerror=null;this.src='${localIcons.unknown}'">
            </div>
            <p class="cardPokemon_head_Name">${name.charAt(0).toUpperCase() + name.slice(1)}</p>
            <div class="cardPokemon_head_health">
                <img src="${ICONS.health}" alt="Health Icon"> <p>${healthStat}</p>
            </div>
            <ul class="cardPokemon_head_types">
                ${typesList}
            </ul>
        </div>

        <div class="cardPokemon_body">
            <div class="cardPokemon_cont">
                <img class="cardPokemon_cont_logo" src="${dreamWorldSpriteUrl}" alt="${name} sprite" onerror="this.onerror=null;this.src='${fallbackSpriteUrl}'">
                <ul>
                    <li><img src="${ICONS.height}" alt="Height Icon"><p>${pokemonHeight}</p></li>
                    <li><img src="${ICONS.weight}" alt="Weight Icon"><p>${pokemonWeight}</p></li>
                    <li><img src="${ICONS.xp}" alt="XP Icon"><p>${baseXP} XP</p></li>
                </ul>
            </div>
            <ul class="cardPokemon_cont_stats">
                <li><img src="${ICONS.attack}" alt="Attack Icon"><p>${attackStat}</p></li>
                <li><img src="${ICONS.defense}" alt="Defense Icon"><p>${defenseStat}</p></li>
                <li><img src="${ICONS.speed}" alt="Speed Icon"><p>${speedStat}</p></li>
            </ul>
        </div>
    `;

    return card;
}
