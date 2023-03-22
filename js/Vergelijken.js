function Pokemon(name, imgurl, hp, atk, def, spAtk, spDef, spd) {
    this.name = name;
    this.imgurl = imgurl;
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.spAtk = spAtk;
    this.spDef = spDef;
    this.spd = spd;
}
const rawpokemon1 = new Pokemon('bulbasaur','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',45,49,49,65,65,45);
const rawpokemon2 = new Pokemon('bulbasaur','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',39,52,43,60,50,65);

const pokemon1 = {
    name1: document.getElementById("Naam1"),
    img1: document.getElementById("Img1"),
    hp1: document.getElementById("hp1"),
    atk1: document.getElementById("atk1"),
    def1: document.getElementById("def1"),
    spAtk1: document.getElementById("spAtk1"),
    spDef1: document.getElementById("spDef1"),
    spd1: document.getElementById("spd1")
};
//.className = "MyClass";
const pokemon2 = {
    name2: document.getElementById("Naam2"),
    img2: document.getElementById("Img2"),
    hp2: document.getElementById("hp2"),
    atk2: document.getElementById("atk2"),
    def2: document.getElementById("def2"),
    spAtk2: document.getElementById("spAtk2"),
    spDef2: document.getElementById("spDef2"),
    spd2: document.getElementById("spd2")
};

async function DoFetch(id) {
    let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemon = await result.json();
    return pokemon;
}
DoFetch(1).then(pokemon => {
    Naam1.textContent = pokemon.name; 
    Img1.src = pokemon.sprites.other['official-artwork'].front_default;
    
})
DoFetch(4).then(pokemon => {
    Naam2.textContent = pokemon.name; 
    Img2.src = pokemon.sprites.other['official-artwork'].front_default;

})
if(rawpokemon1.hp > rawpokemon2.hp){
    pokemon1.hp1.className = "more"; pokemon1.hp1.textContent = "HP: " + rawpokemon1.hp;
    pokemon2.hp2.className = "less"; pokemon2.hp2.textContent = "HP: " + rawpokemon2.hp;
}else if(rawpokemon1.hp < rawpokemon2.hp){
    pokemon1.hp1.className = "less"; pokemon1.hp1.textContent = "HP: " + rawpokemon1.hp;
    pokemon2.hp2.className = "more"; pokemon2.hp2.textContent = "HP: " + rawpokemon2.hp;
}else{
    pokemon1.hp1.className = "even"; pokemon1.hp1.textContent = "HP: " + rawpokemon1.hp;
    pokemon2.hp2.className = "even"; pokemon2.hp2.textContent = "HP: " + rawpokemon2.hp;
}
if(rawpokemon1.atk > rawpokemon2.atk){
    pokemon1.atk1.className = "more"; pokemon1.atk1.textContent = "atk: " + rawpokemon1.atk;
    pokemon2.atk2.className = "less"; pokemon2.atk2.textContent = "atk: " + rawpokemon2.atk;
}else if(rawpokemon1.atk < rawpokemon2.atk){
    pokemon1.atk1.className = "less"; pokemon1.atk1.textContent = "atk: " + rawpokemon1.atk;
    pokemon2.atk2.className = "more"; pokemon2.atk2.textContent = "atk: " + rawpokemon2.atk;
}else{
    pokemon1.atk1.className = "even"; pokemon1.atk1.textContent = "atk: " + rawpokemon1.atk;
    pokemon2.atk2.className = "even"; pokemon2.atk2.textContent = "atk: " + rawpokemon2.atk;
}
if(rawpokemon1.def > rawpokemon2.def){
    pokemon1.def1.className = "more"; pokemon1.def1.textContent = "def: " + rawpokemon1.def;
    pokemon2.def2.className = "less"; pokemon2.def2.textContent = "def: " + rawpokemon2.def;
}else if(rawpokemon1.def < rawpokemon2.def){
    pokemon1.def1.className = "less"; pokemon1.def1.textContent = "def: " + rawpokemon1.def;
    pokemon2.def2.className = "more"; pokemon2.def2.textContent = "def: " + rawpokemon2.def;
}else{
    pokemon1.def1.className = "even"; pokemon1.def1.textContent = "def: " + rawpokemon1.def;
    pokemon2.def2.className = "even"; pokemon2.def2.textContent = "def: " + rawpokemon2.def;
}
if(rawpokemon1.spAtk > rawpokemon2.spAtk){
    pokemon1.spAtk1.className = "more"; pokemon1.spAtk1.textContent = "spAtk: " + rawpokemon1.spAtk;
    pokemon2.spAtk2.className = "less"; pokemon2.spAtk2.textContent = "spAtk: " + rawpokemon2.spAtk;
}else if(rawpokemon1.spAtk < rawpokemon2.spAtk){
    pokemon1.spAtk1.className = "less"; pokemon1.spAtk1.textContent = "spAtk: " + rawpokemon1.spAtk;
    pokemon2.spAtk2.className = "more"; pokemon2.spAtk2.textContent = "spAtk: " + rawpokemon2.spAtk;
}else{
    pokemon1.spAtk1.className = "even"; pokemon1.spAtk1.textContent = "spAtk: " + rawpokemon1.spAtk;
    pokemon2.spAtk2.className = "even"; pokemon2.spAtk2.textContent = "spAtk: " + rawpokemon2.spAtk;
}
if(rawpokemon1.spDef > rawpokemon2.spDef){
    pokemon1.spDef1.className = "more"; pokemon1.spDef1.textContent = "spDef: " + rawpokemon1.spDef;
    pokemon2.spDef2.className = "less"; pokemon2.spDef2.textContent = "spDef: " + rawpokemon2.spDef;
}else if(rawpokemon1.spDef < rawpokemon2.spDef){
    pokemon1.spDef1.className = "less"; pokemon1.spDef1.textContent = "spDef: " + rawpokemon1.spDef;
    pokemon2.spDef2.className = "more"; pokemon2.spDef2.textContent = "spDef: " + rawpokemon2.spDef;
}else{
    pokemon1.spDef1.className = "even"; pokemon1.spDef1.textContent = "spDef: " + rawpokemon1.spDef;
    pokemon2.spDef2.className = "even"; pokemon2.spDef2.textContent = "spDef: " + rawpokemon2.spDef;
}
if(rawpokemon1.spd > rawpokemon2.spd){
    pokemon1.spd1.className = "more"; pokemon1.spd1.textContent = "spd: " + rawpokemon1.spd;
    pokemon2.spd2.className = "less"; pokemon2.spd2.textContent = "spd: " + rawpokemon2.spd;
}else if(rawpokemon1.spd < rawpokemon2.spd){
    pokemon1.spd1.className = "less"; pokemon1.spd1.textContent = "spd: " + rawpokemon1.spd;
    pokemon2.spd2.className = "more"; pokemon2.spd2.textContent = "spd: " + rawpokemon2.spd;
}else{
    pokemon1.spd1.className = "even"; pokemon1.spd1.textContent = "spd: " + rawpokemon1.spd;
    pokemon2.spd2.className = "even"; pokemon2.spd2.textContent = "spd: " + rawpokemon2.spd;
}