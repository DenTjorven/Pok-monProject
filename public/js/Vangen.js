let chanceCounter = 3;
let randomID;
const dropdown = document.getElementById('Chose_Your_Pokemon');
const catchButton = document.getElementById('catch-button');
const chanceLabel = document.getElementById('pokemon-name-label');
const catchImg = document.getElementById(`pokemon-image`);
const nics = document.getElementsByClassName('nickname');
const genRandom = async () => {
    randomID = Math.floor(Math.random() * 1010);
    loadData(randomID)
    chanceLabel.textContent = "Chances left: " + chanceCounter
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
const nickname = new Promise((resolve) => {
    const button = document.getElementById("nickname-form");
    button.addEventListener("submit", (event) => {
      event.preventDefault();
      const nicknameInput = document.getElementById("nickname-input");
      const nickname = nicknameInput.value;
      //code set nickname based on input
      for (let i = 0; i < nics.length; i++) {
        nics[i].style.display = "none";
      }   
      resolve(true);
      genRandom();
    });
  });
  
catchButton.addEventListener('click', async function(){
    const randomProcent = Math.floor(Math.random() * 98);
    const yourIndex = dropdown.selectedIndex;
        const def = await loadData(randomID);
        let check = 60-def+staticPKMNATKArray[yourIndex]
        if(check > 100){
            check = 100
        }
        //console.log(60-def+staticPKMNATKArray[yourIndex])
        //console.log("to beat:" + randomProcent)
    if(chanceCounter === 1 && check <= randomProcent){
        chanceCounter = 3;
        genRandom();
    } else if(check > randomProcent){
        chanceCounter = 3;
        chanceLabel.textContent = "SUCCES, POKEMON GEVANGEN"
        for (let i = 0; i < nics.length; i++) {
            nics[i].style.display = "inline-block";
        }
        await nickname;
    }else{
        chanceCounter--
        chanceLabel.textContent = "Chances left: " + chanceCounter
    }
});
catchImg.addEventListener('click', function() {
    window.open(catchImg.src, '_blank', 'height=600,width=800');
});
genRandom();