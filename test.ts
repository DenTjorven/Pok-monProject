const fetcher = require('node-fetch');
const doFetch = async ():Promise<void> =>{
    let result:any = await fetcher(`https://pokeapi.co/api/v2/pokemon/1`);
    let response:any = await result.json();
    console.log(response);
}
doFetch();
export{}