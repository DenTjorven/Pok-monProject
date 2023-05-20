async function loadData(gevangen:any){
    console.log(loadData);
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
    const data = await response.json();
    const pokemons = data.results;
    const container = document.querySelector('#pokedex') as HTMLElement;
    const toggle = document.getElementById("ToggleEigenPokemon") as HTMLInputElement;


    if (toggle.checked === false) {
        const promises = pokemons.map(async (pokemon:any) => {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            const dexentry = document.createElement('a');
            dexentry.classList.add('link-to-pokemon');
            dexentry.href = `/eigenPokemonBekijkenIndividual.html?id=${data.id}`;
            const pokemonOverview = `
              <div class="pokemon-overview">
                <section class="number-section">
                  <p>#</p>
                  <h1 class="nr-pokemon">${data.id}</h1>
                </section> 
                <section class="section-pokemon">
                  <img class="img-pokemon-one" src="${data.sprites.other['official-artwork'].front_default}" alt="img-pokemon" style="width: 150px;" height="150px">
                  <h2 class="naam-pokemon">${data.name}</h2>
                </section>
              </div>
            `;
            dexentry.innerHTML = pokemonOverview;
            return dexentry;
        })
        
        const entries = await Promise.all(promises);
        entries.forEach((entry:any) => container.appendChild(entry));

    } else if(toggle.checked === true) {
        const promises = pokemons.map(async (pokemon:any) => {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            for(const i of gevangen){
                if (gevangen[i].pokedexNr === data.id) {
                    const dexentry = document.createElement('a');
                    dexentry.classList.add('link-to-pokemon');
                    dexentry.href = `/eigenPokemonBekijkenIndividual.html?id=${data.id}`;
                    const pokemonOverview = `
                    <div class="pokemon-overview">
                        <section class="number-section">
                        <p>#</p>
                        <h1 class="nr-pokemon">${data.id}</h1>
                        </section> 
                        <section class="section-pokemon">
                        <img class="img-pokemon-one" src="${data.sprites.other['official-artwork'].front_default}" alt="img-pokemon" style="width: 150px;" height="150px">
                        <h2 class="naam-pokemon">${data.name}</h2>
                        </section>
                    </div>
                    `;
                    dexentry.innerHTML = pokemonOverview;
                    return dexentry;
                }
            }
        })
        
        const entries = await Promise.all(promises);
        entries.forEach((entry:any) => container.appendChild(entry));
    }
}
interface pokemonInterface{
    name: string;
    url: string;
}