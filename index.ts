import express from "express";
import ejs from "ejs";
const fetch = require('node-fetch');
const app = express();
import session from 'express-session';
import methodOverride from 'method-override';
app.use(methodOverride('_method'));
import { MongoClient, ObjectId, InsertOneResult } from "mongodb";
const uri: string = "mongodb+srv://kirolloswanas:W2Y5kH10NuxLDeQZ@cluster0.eqghavq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
export const clientex = client; 
const CryptoJS = require('crypto-js');
const salt = CryptoJS.lib.WordArray.random().toString();
app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
declare module 'express-session' {
    interface SessionData {
      user?: User;
    }
}    

interface User {
    _id?: ObjectId,
    firstName: string,
    lastName: string,
    userPassword: string,
    userName: string
}
interface GevangenPokemon {
    _id?: ObjectId,
    user_id?: ObjectId,
    pokedexNr: number,
    nicknamePokemon?: string
}
interface PokemonData {
    pkmnNames: string[];
    pkmnIds: number[];
    pkmnImg: string[];
    pkmnHP: number[];
    pkmnAtk: number[];
    pkmnDef: number[];
    pkmnSpAtk: number[];
    pkmnSpDef: number[];
    pkmnSpd: number[];
}
interface FetchedPokemonData {
    id: number;
    name: string;
    img: string;
}
interface EvolutionChainData {
  evolvesToCount: number;
  evolvesToIds: (number | null)[];
  images: string[];
}
let allPokemonList: { id: number, name: string, url: string }[];
let allPokemonData: any[] = [];
const checkUser = async (username: string, password: string): Promise<User | null> => {
    try {
      await client.connect();
      const hashedPasword = hash(password);
      const userDoc = await client.db("Pokemon").collection("Users").findOne({ userName: username, userPassword: hashedPasword });
      if (userDoc) {
        const { _id, firstName, lastName, userName, password: userPassword } = userDoc;
        const user: User = { _id: new ObjectId(_id), firstName, lastName, userName, userPassword };
        return user;
      }
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
    return null;
};
const hash = (password: string) => {
    let hashedPasword = CryptoJS.PBKDF2(password, salt, {iterations: 30000}).toString(); 
    return hashedPasword;
}
const addUser = async (user: User): Promise<User> => {
    try {
        await client.connect();
        user.userPassword = hash(user.userPassword);
        await client.db("Pokemon").collection("Users").insertOne(user);
        return user;
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        await client.close();
    }
};
const getPokemonArray = async (id:ObjectId) => {
    try {
        await client.connect();
        let cursor = client.db("Pokemon").collection("GevangenPokemon").find<GevangenPokemon>({user_id: new ObjectId(id)});
        let result = await cursor.toArray();
        console.log(result)
        return result;
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}
const addPokemon = async (pokemon: GevangenPokemon): Promise<void> => {
    try {
      await client.connect();
      if(pokemon.nicknamePokemon == null){
        pokemon.nicknamePokemon = "";
      }
      await client.db("Pokemon").collection("GevangenPokemon").insertOne({user_id: new ObjectId(pokemon.user_id), pokedexNr: pokemon.pokedexNr, nicknamePokemon: pokemon.nicknamePokemon});
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await client.close();
    }
};
async function fetchAllPokemonList(): Promise<{ id: number, name: string, url: string }[]> {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
    const data = await response.json();
    const allPokemonList = data.results.map((pokemon: { name: string, url: string }) => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);
      return {
        id,
        name: pokemon.name,
        url: pokemon.url
      };
    });
    return allPokemonList;
  }
  
  async function fetchSpecificPokemonData(allepkmn: GevangenPokemon[]): Promise<{pkmnNames: string[],pkmnIds: number[],pkmnImg: string[],pkmnHP: number[],pkmnAtk: number[],pkmnDef: number[],pkmnSpAtk: number[],pkmnSpDef: number[],pkmnSpd: number[]}> {
    const pkmnPromises = allepkmn.map(async (pokemon) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokedexNr}`);
      const data = await response.json();
      const pkmnNames = data.name;
      const pkmnIds = data.id;
      const pkmnImg = data.sprites.other['official-artwork'].front_default;
      const pkmnHP = data.stats[0].base_stat;
      const pkmnAtk = data.stats[1].base_stat;
      const pkmnDef = data.stats[2].base_stat;
      const pkmnSpAtk = data.stats[3].base_stat;
      const pkmnSpDef = data.stats[4].base_stat;
      const pkmnSpd = data.stats[5].base_stat;
      return { pkmnNames, pkmnIds, pkmnImg, pkmnHP, pkmnAtk, pkmnDef, pkmnSpAtk, pkmnSpDef, pkmnSpd };
    });
  
    const pkmnResults = await Promise.all(pkmnPromises);
  
    return {
      pkmnNames: pkmnResults.map(result => result.pkmnNames),
      pkmnIds: pkmnResults.map(result => result.pkmnIds),
      pkmnImg: pkmnResults.map(result => result.pkmnImg),
      pkmnHP: pkmnResults.map(result => result.pkmnHP),
      pkmnAtk: pkmnResults.map(result => result.pkmnAtk),
      pkmnDef: pkmnResults.map(result => result.pkmnDef),
      pkmnSpAtk: pkmnResults.map(result => result.pkmnSpAtk),
      pkmnSpDef: pkmnResults.map(result => result.pkmnSpDef),
      pkmnSpd: pkmnResults.map(result => result.pkmnSpd),
    };
  }  
async function fetchPokemonData(index:number) {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}`;
    const response = await fetch(url);
    const data = await response.json();
    const pokemonData = {
      id: data.id,
      name: data.name,
      img: data.sprites.other['official-artwork'].front_default,
    };
    return pokemonData;
}
  
async function fetchAllPokemonData(startIndex: number, endIndex: number): Promise<FetchedPokemonData[]> {
    const indices = Array.from({ length: endIndex - startIndex + 1 }, (_, index) => startIndex + index).filter((index) => index !== 0);
    const pokemonDataPromises = indices.map((id) =>
      fetchPokemonData(id).catch((error) => {
        console.error('Error fetching Pokémon data:', error);
        return null;
      })
    );
    const allPokemonData = await Promise.all(pokemonDataPromises);
    return allPokemonData.filter((data): data is FetchedPokemonData => data !== null) as FetchedPokemonData[]; // Use type assertion
}

async function getEvolutionChainData(id: number): Promise<EvolutionChainData> {
  const evolutionChainNumber = await getEvolutionChainNumber(id);
  const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainNumber}`);
  const data = await response.json();
  const evolvesToCount = countEvolutions(data.chain);
  const evolvesToIds = getEvolutionsIds(data.chain);
  const images = await fetchPokemonImages([id, ...evolvesToIds]);
  
  return {
    evolvesToCount,
    evolvesToIds,
    images
  };
}

async function getEvolutionChainNumber(id: number): Promise<number> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  const data = await response.json();
  const evolutionChainUrl = data.evolution_chain.url;
  const evolutionChainNumber = parseInt(evolutionChainUrl.split('/').slice(-2, -1)[0]);
  return evolutionChainNumber;
}

function countEvolutions(chain: any): number {
  let count = 0;
  if (chain.evolves_to.length === 0) {
    return count;
  }
  count += chain.evolves_to.length;
  chain.evolves_to.forEach((evolution: any) => {
    count += countEvolutions(evolution);
  });
  return count;
}

function getEvolutionsIds(chain: any): (number | null)[] {
  const ids: (number | null)[] = [];
  if (chain.evolves_to.length > 0) {
    chain.evolves_to.forEach((evolution: any) => {
      ids.push(parseInt(evolution.species.url.split('/').slice(-2, -1)[0]));
      ids.push(...getEvolutionsIds(evolution));
    });
  }
  return ids;
}

async function fetchPokemonImages(ids: (number | null)[]): Promise<string[]> {
  const imagePromises = ids.map(async (id) => {
    if (id !== null) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      return data.sprites.other['official-artwork'].front_default;
    }
    return '';
  });

  return Promise.all(imagePromises);
}

app.get("/", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("algemeneLandingspagina");
        }
    }); 
});
let gevangenPokemon: FetchedPokemonData[] = [];
let toggleCheckbox: boolean = false;
let currentPage: number = 1;
app.get("/pokedex", async (req, res) => {
  const userId = req.session?.user?._id;
  const toggleHidden = req.query.toggleHidden;
  
  if (toggleHidden && !toggleCheckbox) {
    toggleCheckbox = true;
  }
  
  if (userId) {
    if (toggleCheckbox) {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 52;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      const pokemon = await fetchAllPokemonData(startIndex, endIndex);
      currentPage = page;
      res.render('eigenPokemonMultiple', { pokemon, toggle: toggleCheckbox, page: currentPage });
      toggleCheckbox = false;
      return;
    } else {
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const pkmnData = await fetchSpecificPokemonData(allePkmn);
        const PkmnNamen = pkmnData.pkmnNames;
        const PkmnIds = pkmnData.pkmnIds;
        const PkmnImg = pkmnData.pkmnImg;
        gevangenPokemon = PkmnNamen.map((name, index) => {
          return {
            id: PkmnIds[index],
            name: PkmnNamen[index],
            img: PkmnImg[index],
          };
        });
        res.render('eigenPokemonMultiple', { pokemon: gevangenPokemon, toggle: toggleCheckbox, page: currentPage });
        toggleCheckbox = true;
        return;
      }
    }
  }
  res.render('eigenPokemonMultiple', { pokemon: [], toggle: false });
});


app.post("/pokedex", async (req, res) => {
  const userId = req.session?.user?._id;
  
  if (userId) {
    let toggleState = toggleCheckbox;
    const toggleHidden = req.body.toggleHidden;
    
    if (toggleHidden && !toggleState) {
      toggleState = true;
    }
    
    if (toggleState) {
      const page = parseInt(req.body.page as string) || 1;
      const pageSize = 53;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      const pokemonData = await fetchAllPokemonData(startIndex, endIndex);
      currentPage = page;
      res.render('eigenPokemonMultiple', { pokemon: pokemonData, toggle: toggleState, page: currentPage });
      toggleCheckbox = false;
      return;
    } else {
      res.render('eigenPokemonMultiple', { pokemon: gevangenPokemon, toggle: toggleState, page: currentPage });
      toggleCheckbox = true;
      return;
    }
  }
});

app.get("/pokedexsingle/:id", async (req, res) => {
  const userId = req.session?.user?._id;
  const id = req.params.id;
  const userPkmn1: GevangenPokemon[] = [];
  const Nieuwepokemon1: GevangenPokemon = {
      pokedexNr: parseInt(id),
  };
  userPkmn1.push(Nieuwepokemon1);
  if (userId) {
    const pkmnData1 = (await fetchSpecificPokemonData(userPkmn1));
    const evolutionChainData = await getEvolutionChainData(parseInt(id));
    const { pkmnNames: PkmnName1, pkmnImg: PkmnImg1, pkmnHP: PkmnHp1, pkmnAtk: PkmnAtk1, pkmnDef: PkmnDef1, pkmnSpAtk: pkmnSpAtk1, pkmnSpDef: pkmnSpDef1, pkmnSpd: PkmnSpd1 } = pkmnData1; 
    res.render("eigenPokemonSingle", {
        PkmnId1: id,
        PkmnName1: PkmnName1.toString(),
        PkmnImg1: PkmnImg1.toString(),
        PkmnHp1: PkmnHp1.toString(),
        PkmnAtk1: PkmnAtk1.toString(),
        PkmnDef1: PkmnDef1.toString(),
        pkmnSpAtk1: pkmnSpAtk1.toString(),
        pkmnSpDef1: pkmnSpDef1.toString(),
        PkmnSpd1: PkmnSpd1.toString(),
        evolutionChainData: evolutionChainData
      });
  }
});

app.get("/login", async (req, res) => {
    console.log(allPokemonList);
    res.render("login");
});
app.post("/login", async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const user = await checkUser(username, password);
    if (user) {
        req.session.user = user;
        console.log(req.session.user)
        res.redirect("/pokemon");
    } else {
        res.redirect("/error");
    }
});
app.get("/registration", (req, res) => {
    res.render("registration");
});
app.post("/registration", async (req, res) => {
    const user: User = {
        firstName: req.body.name,
        lastName: req.body.lastname,
        userPassword: req.body.password,
        userName: req.body.username
    };
    const newUser = await addUser(user);
    const pokemon: GevangenPokemon = {
        user_id: newUser._id, 
        pokedexNr: req.body['pokemon-choice']
    };
    await addPokemon(pokemon);
    res.redirect("/login");
});
app.get("/pokemon", async (req, res) => {
    allPokemonList = await fetchAllPokemonList();
    res.render("pokemonLandingspagina");
});
app.get("/vangen", async (req, res) => {
    const userId = req.session?.user?._id;
    if (userId) {
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const pkmnData = await fetchSpecificPokemonData(allePkmn);
        const pkmnNames = pkmnData.pkmnNames
        const pkmnAtk = pkmnData.pkmnAtk
        res.render("pokemonVangen", { allePkmnNamen: pkmnNames, allePkmnAtk: pkmnAtk });
      }
    }
});
app.post("/vangen", async (req, res) => {
    const user = req.session?.user;
    console.log(user);
    const NieuweID = parseInt(req.body.nicknamevalue);
    console.log(NieuweID);
    const Nieuwepokemon: GevangenPokemon = {
        user_id: user?._id, 
        pokedexNr: NieuweID,
        nicknamePokemon: req.body.nickname
    };
    await addPokemon(Nieuwepokemon);
    res.redirect("/vangen");
});  
app.get("/vergelijken", async (req, res) => {
    const userId = req.session?.user?._id;
    console.log(req.session.user)
    if (userId) {
        const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
        if (allePkmn) {
            const pkmnData = await fetchSpecificPokemonData(allePkmn);
            const PkmnNamen = pkmnData.pkmnNames
            const PkmnIds = pkmnData.pkmnIds
            const allPokemonList = await fetchAllPokemonList();
            res.render("pokemonVergelijken", {PkmnNamen,PkmnIds,allePkmnNamen: allPokemonList});
        } 
    }
});
app.post("/comparedd", async (req, res) => {
    console.log(req.session.user)
    const userId = req.session?.user?._id;
    const userPkmn1: GevangenPokemon[] = [];
    const Nieuwepokemon1: GevangenPokemon = {
        pokedexNr: req.body.pokemon1,
    };
    const userPkmn2: GevangenPokemon[] = [];
    const Nieuwepokemon2: GevangenPokemon = {
        pokedexNr: req.body.pokemon2,
    };
    userPkmn1.push(Nieuwepokemon1);
    userPkmn2.push(Nieuwepokemon2);
    if (userId) {
        const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
        if (allePkmn) {
            const pkmnData = await fetchSpecificPokemonData(allePkmn);
            const PkmnNamen = pkmnData.pkmnNames
            const PkmnIds = pkmnData.pkmnIds
            const allPokemonList = await fetchAllPokemonList();
            const pkmnData1 = (await fetchSpecificPokemonData(userPkmn1));
            const pkmnData2 = (await fetchSpecificPokemonData(userPkmn2));
            
            const { pkmnNames: PkmnName1, pkmnImg: PkmnImg1, pkmnHP: PkmnHp1, pkmnAtk: PkmnAtk1, pkmnDef: PkmnDef1, pkmnSpAtk: pkmnSpAtk1, pkmnSpDef: pkmnSpDef1, pkmnSpd: PkmnSpd1 } = pkmnData1;
            const { pkmnNames: PkmnName2, pkmnImg: PkmnImg2, pkmnHP: PkmnHp2, pkmnAtk: PkmnAtk2, pkmnDef: PkmnDef2, pkmnSpAtk: pkmnSpAtk2, pkmnSpDef: pkmnSpDef2, pkmnSpd: PkmnSpd2 } = pkmnData2;

            const attributes = ['HP', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spd'];
            const comparisonResults1: string[] = [];
            const comparisonResults2: string[] = [];

            if (attributes && attributes.length === 6) {
            attributes.forEach((attribute, index) => {
                const stat1 = pkmnData1[`pkmn${attribute}` as keyof typeof pkmnData1];
                const stat2 = pkmnData2[`pkmn${attribute}` as keyof typeof pkmnData2];

                if (stat1 > stat2) {
                comparisonResults1.push('more');
                comparisonResults2.push('less');
                } else if (stat1 < stat2) {
                comparisonResults1.push('less');
                comparisonResults2.push('more');
                } else {
                comparisonResults1.push('even');
                comparisonResults2.push('even');
                }
            });
            }
            console.log(comparisonResults1)
            console.log(comparisonResults2)
            res.render("pokemonVergelijken", {
                PkmnNamen,
                PkmnIds,
                allePkmnNamen: allPokemonList,
                comparisonResults1,
                comparisonResults2,
                PkmnName1: PkmnName1.toString(),
                PkmnImg1: PkmnImg1.toString(),
                PkmnHp1: PkmnHp1.toString(),
                PkmnAtk1: PkmnAtk1.toString(),
                PkmnDef1: PkmnDef1.toString(),
                pkmnSpAtk1: pkmnSpAtk1.toString(),
                pkmnSpDef1: pkmnSpDef1.toString(),
                PkmnSpd1: PkmnSpd1.toString(),
                PkmnName2: PkmnName2.toString(),
                PkmnImg2: PkmnImg2.toString(),
                PkmnHp2: PkmnHp2.toString(),
                PkmnAtk2: PkmnAtk2.toString(),
                PkmnDef2: PkmnDef2.toString(),
                pkmnSpAtk2: pkmnSpAtk2.toString(),
                pkmnSpDef2: pkmnSpDef2.toString(),
                PkmnSpd2: PkmnSpd2.toString()
              });              
        }
    }
});

app.listen(app.get('port'), ()=>console.log( '[server] http://localhost:' + app.get('port')));
export {};