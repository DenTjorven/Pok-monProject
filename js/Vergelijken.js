/**
 * Returns an object containing DOM elements for a Pokemon's name, image, and stats
 *
 * @param {number} id - The ID of the Pokemon
 * @returns {Object} An object containing the DOM elements for the Pokemon's name, image, and stats
 */
const getPokemon = (id) => ({
    name: document.getElementById(`Naam${id}`),
    img: document.getElementById(`Img${id}`),
    hp: document.getElementById(`hp${id}`),
    atk: document.getElementById(`atk${id}`),
    def: document.getElementById(`def${id}`),
    spAtk: document.getElementById(`spAtk${id}`),
    spDef: document.getElementById(`spDef${id}`),
    spd: document.getElementById(`spd${id}`)
  });
  
/**
 * Fetches Pokemon data from the PokeAPI and updates the DOM elements for the given Pokemon
 *
 * @param {number} id - The ID of the Pokemon to fetch
 * @param {Object} pokemon - An object containing the DOM elements for the Pokemon's name, image, and stats
 */
  const fetchPokemon = async (id, pokemon) => {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await result.json();
    
    pokemon.name.textContent = pokemonData.name;
    pokemon.img.src = pokemonData.sprites.other["official-artwork"].front_default;
    pokemon.hp.textContent = pokemonData.stats[0].base_stat;
    pokemon.atk.textContent = pokemonData.stats[1].base_stat;
    pokemon.def.textContent = pokemonData.stats[2].base_stat;
    pokemon.spAtk.textContent = pokemonData.stats[3].base_stat;
    pokemon.spDef.textContent = pokemonData.stats[4].base_stat;
    pokemon.spd.textContent = pokemonData.stats[5].base_stat;
  };
  
/**
 * Compares the stats of two Pokemon and updates the classes of the corresponding DOM elements
 *
 * @param {string} stat - The name of the stat to compare (hp, atk, def, spAtk, spDef, or spd)
 * @param {number} id1 - The ID of the first Pokemon
 * @param {number} id2 - The ID of the second Pokemon
 */
  const compareStats = async (stat, id1, id2) => {
    const elem1 = document.getElementById(`${stat}${id1}`);
    const elem2 = document.getElementById(`${stat}${id2}`);
    console.log(stat);
    console.log(elem1.innerText);
    console.log(elem2.innerText);
    if (elem1.innerText > elem2.innerText) {
      elem1.className = "more";
      elem2.className = "less";
    } else if (elem1.innerText < elem2.innerText) {
      elem1.className = "less";
      elem2.className = "more";
    } else {
      elem1.className = "even";
      elem2.className = "even";
    }
  };
  
/**
 * Compares the stats of two Pokemon
 *
 * @param {number} id1 - The ID of the first Pokemon
 * @param {number} id2 - The ID of the second Pokemon
 */
  const comparePokemon = (id1, id2) => {
    compareStats("hp", id1, id2);
    console.log(id1);
    console.log(document.getElementById('hp1').innerText)
    console.log(id2);
    compareStats("atk", id1, id2);
    compareStats("def", id1, id2);
    compareStats("spAtk", id1, id2);
    compareStats("spDef", id1, id2);
    compareStats("spd", id1, id2);
  };
  
  const pokemon1 = getPokemon(1);
  const pokemon2 = getPokemon(2);
  
  fetchPokemon(1, pokemon1);
  fetchPokemon(4, pokemon2);
  comparePokemon(1, 2);
  console.log(document.getElementById('hp1').textContent);