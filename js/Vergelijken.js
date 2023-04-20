/**
 *function returns an object containing DOM elements for various parts of a Pokemon's information, based on the provided ID.
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
 *declare variables for two dropdown menus and two Pokemon objects (one for each dropdown)
 *arrays contain static URLs and names for some Pokemon, to be used in the first dropdown menu.
 */
const dropdown1 = document.getElementById('dropdown-1');
const dropdown2 = document.getElementById('dropdown-2');
const pokemon1 = getPokemon(1);
const pokemon2 = getPokemon(2);
/**
 *This function populates the second dropdown menu with all the available Pokemon from the API, and the first dropdown menu with the static Pokemon data.
 */
async function loadData() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
  const data = await response.json();
  const pokemons = data.results;
  pokemons.forEach(pokemon => {
    const option = document.createElement('option');
    option.value = pokemon.url;
    console.log(pokemon.url)
    option.textContent = pokemon.name;
    dropdown2.appendChild(option);
  });
  const staticPKMNURLArray = ["https://pokeapi.co/api/v2/pokemon/1","https://pokeapi.co/api/v2/pokemon/4","https://pokeapi.co/api/v2/pokemon/7"]
  const staticPKMNNAMEArray = ["bulbasaur","charmander","squirtle"];
  for (let i = 0; i < staticPKMNURLArray.length; i++) {
    const option = document.createElement('option');
    option.value = staticPKMNURLArray[i];
    option.textContent = staticPKMNNAMEArray[i];
    dropdown1.appendChild(option);
  }
}
/**
 *This function fetches data for a Pokemon based on a provided URL, and updates the relevant DOM elements for that Pokemon.
 */
const fetchPokemon = async (call, pokemon) => {
  const result = await fetch(call);
  const pokemonData = await result.json();

  pokemon.name.textContent = pokemonData.name;
  pokemon.img.src = pokemonData.sprites.other["official-artwork"].front_default;
  pokemon.hp.textContent = pokemonData.stats.find(s => s.stat.name === 'hp').base_stat;
  pokemon.atk.textContent = pokemonData.stats.find(s => s.stat.name === 'attack').base_stat;
  pokemon.def.textContent = pokemonData.stats.find(s => s.stat.name === 'defense').base_stat;
  pokemon.spAtk.textContent = pokemonData.stats.find(s => s.stat.name === 'special-attack').base_stat;
  pokemon.spDef.textContent = pokemonData.stats.find(s => s.stat.name === 'special-defense').base_stat;
  pokemon.spd.textContent = pokemonData.stats.find(s => s.stat.name === 'speed').base_stat;
  
};
/**
 *This function compares data from both pokemon based on a stat and 2 id's, and updates the relevant classlist for the accociated HTML element.
 */
const compareStats = (stat, id1, id2) => {
  const elem1 = document.getElementById(`${stat}${id1}`);
  const elem2 = document.getElementById(`${stat}${id2}`);

  const stat1 = parseInt(elem1.textContent);
  const stat2 = parseInt(elem2.textContent);

  if (stat1 > stat2) {
    elem1.classList = 'more';
    elem2.classList = 'less';
  } else if (stat1 < stat2) {
    elem1.classList = 'less';
    elem2.classList = 'more';
  } else {
    elem1.classList = 'even';
    elem2.classList = 'even';
  }
};
/**
 *This function calls each invidual stat to be compared
 */
const comparePokemon = (id1, id2) => {
  compareStats("hp", id1, id2);
  compareStats("atk", id1, id2);
  compareStats("def", id1, id2);
  compareStats("spAtk", id1, id2);
  compareStats("spDef", id1, id2);
  compareStats("spd", id1, id2);
};
/**
 *These are both eventListeners to updated everything based on the selected pokemon
 */  
dropdown1.addEventListener('change', function() {
  const selectedValue = dropdown1.value;
  console.log('Selected value:', selectedValue);
  fetchPokemon(selectedValue, pokemon1);
  setTimeout(function() {
    comparePokemon(1, 2);
  }, 250); 
}); 
dropdown2.addEventListener('change', function() {
  const selectedValue = dropdown2.value;
  console.log('Selected value:', selectedValue);
  fetchPokemon(selectedValue, pokemon2);
  setTimeout(function() {
    comparePokemon(1, 2);
  }, 250); 
}); 
function popOut(imageSrc) {
  window.open(imageSrc, "Image Popout", "width=400, height=400");
}
loadData();