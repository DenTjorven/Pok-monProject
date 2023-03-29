const fetcher = require('node-fetch');

interface Pokemon{
    naam: string;
    imgurl: string;
    stats: number[]
}
const pokemon1:Pokemon = {
    naam: 'bulbasaur',
    imgurl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    stats: [45,49,49,65,65,45]
}
const pokemon2:Pokemon = {
    naam: 'bulbasaur',
    imgurl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    stats: [39,52,43,60,50,65]
}

const doFetch = async ():Promise<void> =>{
    let result:any = await fetcher(`https://pokeapi.co/api/v2/pokemon/1`);
    let response:any = await result.json();
    //console.log(response);
}
doFetch();
let stats1:string = "";
let stats2:string = "";
if(pokemon1.stats[0] > pokemon2.stats[0]){
    /*code pkmn1 More, pkmn2 Less*/
}else if(pokemon1.stats[0] < pokemon2.stats[0]){
    /*code pkmn2 More, pkmn1 Less*/
}else{
    /*code pkmn2 Even, pkmn1 Even*/
}
export{}
/*Dit is gewoon een test API call, can later verwijdered worden*/
