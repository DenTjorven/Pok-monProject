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


const fetchPokemon = async (id, pokemon) => {
  const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
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
    elem1.classList.add('more');
    elem2.classList.add('less');
  } else if (stat1 < stat2) {
    elem1.classList.add('less');
    elem2.classList.add('more');
  } else {
    elem1.classList.add('even');
    elem2.classList.add('even');
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
  
const pokemon1 = getPokemon(1);
const pokemon2 = getPokemon(2);
  
fetchPokemon(1, pokemon1);
fetchPokemon(4, pokemon2);


setTimeout(function() {
  comparePokemon(1, 2);
}, 250); 