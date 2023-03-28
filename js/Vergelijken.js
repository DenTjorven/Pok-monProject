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

const pokemon1 = {
    name: document.getElementById("Naam1"),
    img: document.getElementById("Img1"),
    hp: document.getElementById("hp1"),
    atk: document.getElementById("atk1"),
    def: document.getElementById("def1"),
    spAtk: document.getElementById("spAtk1"),
    spDef: document.getElementById("spDef1"),
    spd: document.getElementById("spd1")
};
//.className = "MyClass";
const pokemon2 = {
    name: document.getElementById("Naam2"),
    img: document.getElementById("Img2"),
    hp: document.getElementById("hp2"),
    atk: document.getElementById("atk2"),
    def: document.getElementById("def2"),
    spAtk: document.getElementById("spAtk2"),
    spDef: document.getElementById("spDef2"),
    spd: document.getElementById("spd2")
};
let pokemonJSON = []
async function DoFetch(id) {
    let counter = 1;
    let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (counter === 1){
        pokemonJSON[0] = await result.json();
        counter++
    }else{
        pokemonJSON[1] = await result.json();
    }
}

DoFetch(1); //Hardcoded values voor op te vragen ID's
DoFetch(4);

for (let i = 0; i < pokemonJSON.length; i++) {
    window['pokemon'+(i+1).name.textContext] = pokemonJSON[i].name;
    window['pokemon'+(i+1).img.src] = pokemonJSON[i].sprites.other['official-artwork'].front_default;
    window['pokemon'+(i+1).hp.textContext] = "HP: " + pokemonJSON[i].stats[0].base_stat;
    window['pokemon'+(i+1).atk.textContext] = "atk: " + pokemonJSON[i].stats[1].base_stat;
    window['pokemon'+(i+1).def.textContext] = "def: " + pokemonJSON[i].stats[2].base_stat;
    window['pokemon'+(i+1).spAtk.textContext] = "spAtk: " + pokemonJSON[i].stats[3].base_stat;
    window['pokemon'+(i+1).spDef.textContext] = "spDef: " + pokemonJSON[i].stats[4].base_stat;
    window['pokemon'+(i+1).spd.textContext] = "spd: " + pokemonJSON[i].stats[5].base_stat;
}

if(pokemonJSON[0].stats[0].base_stat > pokemonJSON[1].stats[0].base_stat){
    pokemon1.hp.className = "more";
    pokemon2.hp.className = "less";
}else if(pokemonJSON[0].stats[0].base_stat < pokemonJSON[1].stats[0].base_stat){
    pokemon1.hp.className = "less";
    pokemon2.hp.className = "more";
}else{
    pokemon1.hp.className = "even";
    pokemon2.hp.className = "even";
}
if(pokemonJSON[0].stats[1].base_stat > pokemonJSON[1].stats[1].base_stat){
    pokemon1.atk.className = "more";
    pokemon2.atk.className = "less";
}else if(pokemonJSON[0].stats[1].base_stat < pokemonJSON[1].stats[1].base_stat){
    pokemon1.atk.className = "less";
    pokemon2.atk.className = "more";
}else{
    pokemon1.atk.className = "even";
    pokemon2.atk.className = "even";
}
if(pokemonJSON[0].stats[2].base_stat > pokemonJSON[1].stats[2].base_stat){
    pokemon1.def.className = "more";
    pokemon2.def.className = "less";
}else if(pokemonJSON[0].stats[2].base_stat < pokemonJSON[1].stats[2].base_stat){
    pokemon1.def.className = "less";
    pokemon2.def.className = "more";
}else{
    pokemon1.def.className = "even";
    pokemon2.def.className = "even";
}
if(pokemonJSON[0].stats[3].base_stat > pokemonJSON[1].stats[3].base_stat){
    pokemon1.spAtk.className = "more";
    pokemon2.spAtk.className = "less";
}else if(pokemonJSON[0].stats[3].base_stat < pokemonJSON[1].stats[3].base_stat){
    pokemon1.spAtk.className = "less";
    pokemon2.spAtk.className = "more";
}else{
    pokemon1.spAtk.className = "even";
    pokemon2.spAtk.className = "even";
}
if(pokemonJSON[0].stats[4].base_stat > pokemonJSON[1].stats[4].base_stat){
    pokemon1.spDef.className = "more";
    pokemon2.spDef.className = "less";
}else if(pokemonJSON[0].stats[4].base_stat < pokemonJSON[1].stats[4].base_stat){
    pokemon1.spDef.className = "less";
    pokemon2.spDef.className = "more";
}else{
    pokemon1.spDef.className = "even";
    pokemon2.spDef.className = "even";
}
if(pokemonJSON[0].stats[5].base_stat > pokemonJSON[1].stats[5].base_stat){
    pokemon1.spd.className = "more";
    pokemon2.spd.className = "less";
}else if(pokemonJSON[0].stats[5].base_stat < pokemonJSON[1].stats[5].base_stat){
    pokemon1.spd.className = "less";
    pokemon2.spd.className = "more";
}else{
    pokemon1.spd.className = "even";
    pokemon2.spd.className = "even";
}