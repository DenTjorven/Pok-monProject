const pokemon1 = {
    name1: document.getElementById("Naam1"),
    img1: document.getElementById("Img1"),
    stats1: document.getElementById("Stats1")
  
};
  
const pokemon2 = {
    name2: document.getElementById("Naam2"),
    img2: document.getElementById("Img2"),
    stats2: document.getElementById("Stats2")
};
async function DoFetch(id) {
    let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemon = await result.json();
    return pokemon;
}
DoFetch(1).then(pokemon => {Naam1.textContent = pokemon.name; Img1.src = pokemon.sprites.other['official-artwork'].front_default;})
DoFetch(4).then(pokemon => {Naam2.textContent = pokemon.name; Img2.src = pokemon.sprites.other['official-artwork'].front_default;})
