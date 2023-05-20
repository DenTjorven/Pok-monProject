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
      console.log(pokemon.nicknamePokemon);
      console.log(pokemon.pokedexNr);
      console.log(pokemon.user_id);
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
async function loadData(allepkmn: GevangenPokemon[]): Promise<{ pkmnData: { pkmnNames: string[], pkmnIds: number[], pkmnImg: string[], pkmnHP: number[], pkmnAtk: number[], pkmnDef: number[], pkmnSpAtk: number[], pkmnSpDef: number[], pkmnSpd: number[] }[], allPokemonList: { id: number, name: string }[] }> {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
    const data = await response.json();
    const allPokemonList = data.results.map((pokemon: { name: string, url: string }) => {
        const urlParts = pokemon.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        return {
          id,
          name: pokemon.name
        };
    });      
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
    const pkmnData = pkmnResults.map((result) => ({
      pkmnNames: result.pkmnNames,
      pkmnIds: result.pkmnIds,
      pkmnImg: result.pkmnImg,
      pkmnHP: result.pkmnHP,
      pkmnAtk: result.pkmnAtk,
      pkmnDef: result.pkmnDef,
      pkmnSpAtk: result.pkmnSpAtk,
      pkmnSpDef: result.pkmnSpDef,
      pkmnSpd: result.pkmnSpd
    }));
    return { pkmnData, allPokemonList };
}    
app.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("algemeneLandingspagina");
        }
    }); 
});
app.get("/pokedex", (req, res) => {
    const userId = req.session?.user?._id;
    const id = new ObjectId(userId)
    const gevangenPok = getPokemonArray(id)
    res.render('eigenPokemonMultiple', {
        gevangen:gevangenPok,
    });
});
app.get("/pokedexsingle/:id", (req, res) => {

});
app.get("/login", (req, res) => {
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
app.get("/pokemon", (req, res) => {
    res.render("pokemonLandingspagina");
});
app.get("/vangen", async (req, res) => {
    const userId = req.session?.user?._id;
    if (userId) {
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const { pkmnData } = await loadData(allePkmn);
        const pkmnNames: string[] = pkmnData.flatMap((pkmn) => pkmn.pkmnNames);
        const pkmnAtk: number[] = pkmnData.flatMap((pkmn) => pkmn.pkmnAtk);
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
            const { pkmnData, allPokemonList } = await loadData(allePkmn);
            const PkmnNamen = pkmnData.map((data) => data.pkmnNames);
            const PkmnIds = pkmnData.map((data) => data.pkmnIds);

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
            const { pkmnData, allPokemonList } = await loadData(allePkmn);
            const pkmnData1 = (await loadData(userPkmn1)).pkmnData;
            const pkmnData2 = (await loadData(userPkmn2)).pkmnData;
            
            const PkmnNamen = pkmnData.map((data) => data.pkmnNames);
            const PkmnIds = pkmnData.map((data) => data.pkmnIds);
            
            const { pkmnNames: PkmnName1, pkmnImg: PkmnImg1, pkmnHP: PkmnHp1, pkmnAtk: PkmnAtk1, pkmnDef: PkmnDef1, pkmnSpAtk: pkmnSpAtk1, pkmnSpDef: pkmnSpDef1, pkmnSpd: PkmnSpd1 } = pkmnData1[0];
            const { pkmnNames: PkmnName2, pkmnImg: PkmnImg2, pkmnHP: PkmnHp2, pkmnAtk: PkmnAtk2, pkmnDef: PkmnDef2, pkmnSpAtk: pkmnSpAtk2, pkmnSpDef: pkmnSpDef2, pkmnSpd: PkmnSpd2 } = pkmnData2[0];

            const attributes = ['HP', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spd'];
            const comparisonResults1: string[] = [];
            const comparisonResults2: string[] = [];

            if (attributes && attributes.length === 6) {
            attributes.forEach((attribute, index) => {
                const stat1 = pkmnData1[0][`pkmn${attribute}` as keyof typeof pkmnData1[0]];
                const stat2 = pkmnData2[0][`pkmn${attribute}` as keyof typeof pkmnData2[0]];

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
const main = async () => {
    try {
        await client.connect();
        /*if (userId) {
            const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
            if (allePkmn) {
              const { pkmnNames, pkmnImg, pkmnHP, pkmnAtk, pkmnDef, pkmnSpAtk, pkmnSpDef, pkmnSpd } = await loadData(allePkmn);
              res.render('pokemonVergelijken', { allePkmnNamen: pkmnNames, allePkmnImg: pkmnImg, allePkmnHp: pkmnHP, allePkmnAtk: pkmnAtk,allePkmnDef: pkmnDef, allePkmnSpAtk: pkmnSpAtk, allePkmnSpDef: pkmnSpDef, allePkmnSpd: pkmnSpd, });
            }
          }*/
        //let databases = await client.db().admin().listDatabases();

        //console.log(databases.databases);

        await client.db("Pokemon").collection("Users").deleteMany({}); //om dublicaties te vermijden elk keer we de script runnen
        await client.db("Pokemon").collection("GevangenPokemon").deleteMany({}); //om dublicaties te vermijden elk keer we de script runnen

        //await client.db("Pokemon").collection("Users").insert();
        //await client.db("Pokemon").collection("GevangenPokemon").insert();

    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}

app.listen(app.get('port'), ()=>console.log( '[server] http://localhost:' + app.get('port')));
export {};