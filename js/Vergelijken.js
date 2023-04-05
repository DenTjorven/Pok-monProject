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
const dropdown1 = document.getElementById('dropdown-1');
const dropdown2 = document.getElementById('dropdown-2');
const pokemon1 = getPokemon(1);
const pokemon2 = getPokemon(2);
const staticPKMNURLArray = ["https://pokeapi.co/api/v2/pokemon/1","https://pokeapi.co/api/v2/pokemon/4","https://pokeapi.co/api/v2/pokemon/7"]
const staticPKMNNAMEArray = ["bulbasaur","charmander","squirtle"]

async function populateDropdown() {
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
  for (let i = 0; i < staticPKMNURLArray.length; i++) {
    const option = document.createElement('option');
    option.value = staticPKMNURLArray[i];
    option.textContent = staticPKMNNAMEArray[i];
    dropdown1.appendChild(option);
  }
}
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

const comparePokemon = (id1, id2) => {
  compareStats("hp", id1, id2);
  compareStats("atk", id1, id2);
  compareStats("def", id1, id2);
  compareStats("spAtk", id1, id2);
  compareStats("spDef", id1, id2);
  compareStats("spd", id1, id2);
};
  
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
populateDropdown();