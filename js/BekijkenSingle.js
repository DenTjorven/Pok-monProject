const params = new URLSearchParams(window.location.search);
const pokemonId = params.get('id');
const ogPokemon = document.getElementById('original-pokemon');
const baseLink = document.getElementById('base');

async function getEvolutionChainNumber(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const data = await response.json();
    const evolutionChainUrl = data.evolution_chain.url;
    const evolutionChainNumber = parseInt(evolutionChainUrl.split('/').slice(-2, -1)[0]);
    return evolutionChainNumber;
}
async function loadData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const pokemon = data;
    const nr = document.getElementById('nummer');
    const hp = document.getElementById('hp');
    const atk = document.getElementById('atk');
    const def = document.getElementById('def');
    const spAtk = document.getElementById('spAtk');
    const spDef = document.getElementById('spDef');
    const spd = document.getElementById('spd');
    const naam = document.getElementById('naam');
    const img = document.getElementById('image');
    console.log(pokemon.evolution_chain)
    nr.textContent = pokemon.id;
    naam.textContent = pokemon.name;
    img.src = pokemon.sprites.other["official-artwork"].front_default;
    hp.textContent = pokemon.stats.find(s => s.stat.name === 'hp').base_stat;
    atk.textContent = pokemon.stats.find(s => s.stat.name === 'attack').base_stat;
    def.textContent = pokemon.stats.find(s => s.stat.name === 'defense').base_stat;
    spAtk.textContent = pokemon.stats.find(s => s.stat.name === 'special-attack').base_stat;
    spDef.textContent = pokemon.stats.find(s => s.stat.name === 'special-defense').base_stat;
    spd.textContent = pokemon.stats.find(s => s.stat.name === 'speed').base_stat;
}
async function loadChain(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const data = await response.json();
    const evolvesToCount = countEvolutions(data.chain);
    const evolvesToIds = getEvolutionsIds(data.chain);
    const ogPokemon = document.getElementById('original-pokemon');
    const firstArrow = document.getElementById('first-evolution-arrow');
    const secondArrow = document.getElementById('second-evolution-arrow');
    const firstEvo = document.getElementById('first-evolution-img');
    const secondEvo = document.getElementById('second-evolution-img');
    const baseLink = document.getElementById('base');
    const firstLink = document.getElementById('first');
    const secondLink = document.getElementById('second');
    
    const ogResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolvesToIds[0]}`);
    const ogData = await ogResponse.json();
    ogPokemon.src = ogData.sprites.other["official-artwork"].front_default;
    baseLink.href = `/eigenPokemonBekijkenIndividual.html?id=${ogData.id}`;
    if (evolvesToIds[1] !== null) {
        const firstResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolvesToIds[1]}`);
        const firstData = await firstResponse.json();
        firstEvo.src = firstData.sprites.other["official-artwork"].front_default;
        firstLink.href = `/eigenPokemonBekijkenIndividual.html?id=${firstData.id}`;
    }
    if (evolvesToIds[2] !== null) {
        const secondResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolvesToIds[2]}`);
        const secondData = await secondResponse.json();
        secondEvo.src = secondData.sprites.other["official-artwork"].front_default;
        secondLink.href = `/eigenPokemonBekijkenIndividual.html?id=${secondData.id}`;
    }
    switch (evolvesToCount) {
        case 0:
            firstArrow.style.display = "none";
            secondArrow.style.display = "none";
            ogPokemon.style.display = "inline-block";
            firstEvo.style.display = "none";
            secondEvo.style.display = "none";
            break;
        case 1:
            firstArrow.style.display = "inline-block";
            secondArrow.style.display = "none";
            ogPokemon.style.display = "inline-block";
            firstEvo.style.display = "inline-block";
            secondEvo.style.display = "none";
            break;
        case 2:
            firstArrow.style.display = "inline-block";
            secondArrow.style.display = "inline-block";
            ogPokemon.style.display = "inline-block";
            firstEvo.style.display = "inline-block";
            secondEvo.style.display = "inline-block";
            break;
        default:
            break;
    }
}
function countEvolutions(chain) {
    let count = 0;
    if (chain.evolves_to.length === 0) {
        return count;
    }
    count += chain.evolves_to.length;
    chain.evolves_to.forEach((evolution) => {
        count += countEvolutions(evolution);
    });
    return count;
}
function getEvolutionsIds(chain) {
    const ids = [null, null, null];
    ids[0] = parseInt(chain.species.url.split('/').slice(-2, -1)[0]);
    if (chain.evolves_to.length > 0) {
        const firstEvo = chain.evolves_to[0];
        ids[1] = parseInt(firstEvo.species.url.split('/').slice(-2, -1)[0]);
        if (firstEvo.evolves_to.length > 0) {
            ids[2] = parseInt(firstEvo.evolves_to[0].species.url.split('/').slice(-2, -1)[0]);
        }
    }
    return ids;
}

async function LoadPokemonData(id) {
    var chainNr =  await getEvolutionChainNumber(id);
    console.log(chainNr)
    loadData(id);
    loadChain(chainNr);
}
LoadPokemonData(pokemonId)