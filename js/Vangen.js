

const staticPKMNURLArray = ["https://pokeapi.co/api/v2/pokemon/1","https://pokeapi.co/api/v2/pokemon/4","https://pokeapi.co/api/v2/pokemon/7"]
const staticPKMNNAMEArray = ["bulbasaur","charmander","squirtle"];
const staticPKMNATKArray = [49,52,48]
let chanceCounter = 3;
let randomID;
const dropdown = document.getElementById('yourPokemon');
const catchButton = document.getElementById('catch-button');
const chanceLabel = document.getElementById('pokemon-name-label');
const catchImg = document.getElementById(`pokemon-image`);
const genRandom = async () => {
    randomID = Math.floor(Math.random() * 1010);
    loadData(randomID)
    chanceLabel.textContent = "Chances left: " + chanceCounter
}
const populateDropdown = () => {
    for (let i = 0; i < staticPKMNURLArray.length; i++) {
        const option = document.createElement('option');
        option.value = staticPKMNURLArray[i];
        option.textContent = staticPKMNNAMEArray[i];
        dropdown.appendChild(option);
    }
}
async function loadData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const pokemon = data;
    const pkmnName = document.getElementById('pokemon-name');
    pkmnName.textContent = pokemon.name;
    catchImg.src = pokemon.sprites.other["official-artwork"].front_default;
    return pokemon.stats[3].base_stat;
}
catchButton.addEventListener('click', async function(){
    const randomProcent = Math.floor(Math.random() * 98);
    if(chanceCounter === 0){
        chanceCounter = 3;
        genRandom();
    } else {
        const yourIndex = dropdown.selectedIndex;
        const def = await loadData(randomID);
        let check = 60-def+staticPKMNATKArray[yourIndex]
        if(check > 100){
            check = 100
        }
        console.log(60-def+staticPKMNATKArray[yourIndex])
        console.log("to beat:" + randomProcent)
        if(check > randomProcent){
            chanceCounter = 3;
            genRandom();
            chanceLabel.textContent = "SUCCES, POKEMON GEVANGEN"
            //Code to add to dropdown + database of caught pokemon
        }else {
            chanceCounter--
            chanceLabel.textContent = "Chances left: " + chanceCounter
        }
    }
});
catchImg.addEventListener('click', function() {
    window.open(catchImg.src, '_blank', 'height=600,width=800');
});
populateDropdown();
genRandom();