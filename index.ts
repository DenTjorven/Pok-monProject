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
const CryptoJS = require('crypto-js');
const salt = CryptoJS.lib.WordArray.random().toString();
app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(session({ // Update this middleware setup
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
async function loadData(allepkmn: GevangenPokemon[]): Promise<{ pkmnNames: string[], pkmnImg: string[], pkmnHP: number[], pkmnAtk: number[], pkmnDef: number[], pkmnSpAtk: number[], pkmnSpDef: number[], pkmnSpd: number[] }> {
    const promises = allepkmn.map(async (pokemon) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokedexNr}`);
      const data = await response.json();
      const pkmnNames = data.name;
      const pkmnImg = data.sprites.other["official-artwork"].front_default;
      const pkmnHP = data.stats[0].base_stat;
      const pkmnAtk = data.stats[1].base_stat;
      const pkmnDef = data.stats[2].base_stat;
      const pkmnSpAtk = data.stats[3].base_stat;
      const pkmnSpDef = data.stats[4].base_stat;
      const pkmnSpd = data.stats[5].base_stat;
      return { pkmnNames, pkmnImg, pkmnHP, pkmnAtk, pkmnDef, pkmnSpAtk, pkmnSpDef, pkmnSpd};
    });
  
    const results = await Promise.all(promises);
  
    const pkmnNames: string[] = results.map((result) => result.pkmnNames);
    const pkmnImg: string[] = results.map((result) => result.pkmnImg);
    const pkmnHP: number[] = results.map((result) => result.pkmnHP);
    const pkmnAtk: number[] = results.map((result) => result.pkmnAtk);
    const pkmnDef: number[] = results.map((result) => result.pkmnDef);
    const pkmnSpAtk: number[] = results.map((result) => result.pkmnSpAtk);
    const pkmnSpDef: number[] = results.map((result) => result.pkmnSpDef);
    const pkmnSpd: number[] = results.map((result) => result.pkmnSpd);
  
    return { pkmnNames, pkmnImg, pkmnHP, pkmnAtk, pkmnDef, pkmnSpAtk, pkmnSpDef, pkmnSpd};
}
  
  
app.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('algemeneLandingspagina');
        }
    }); 
});
app.get("/pokedex", (req, res) => {
    res.render('eigenPokemonMultiple');
});

app.get("/pokedexsingle/:id", (req, res) => {

});

app.get("/login", (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const user = await checkUser(username, password);
    if (user) {
        req.session.user = user;
        res.redirect('/pokemon');
    } else {
        res.redirect('/error');
    }
});

app.get("/registration", (req, res) => {
    res.render('registration');
});
app.post('/registration', async (req, res) => {
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
    res.redirect('/login');
});
app.get("/pokemon", (req, res) => {
    res.render('pokemonLandingspagina');
});
app.get("/vangen", async (req, res) => {
    const userId = req.session?.user?._id;
    if (userId) {
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const { pkmnNames, pkmnAtk } = await loadData(allePkmn);
        res.render('pokemonVangen', { allePkmnNamen: pkmnNames, allePkmnAtk: pkmnAtk });
      }
    }
});
app.post('/vangen', async (req, res) => {
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
    res.redirect('/vangen');
});  
app.get("/vergelijken", async (req, res) => {
    const userId = req.session?.user?._id;
    if (userId) {
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const { pkmnNames, pkmnImg, pkmnHP, pkmnAtk, pkmnDef, pkmnSpAtk, pkmnSpDef, pkmnSpd } = await loadData(allePkmn);
        res.render('pokemonVergelijken', { allePkmnNamen: pkmnNames, allePkmnImg: pkmnImg, allePkmnHp: pkmnHP, allePkmnAtk: pkmnAtk,allePkmnDef: pkmnDef, allePkmnSpAtk: pkmnSpAtk, allePkmnSpDef: pkmnSpDef, allePkmnSpd: pkmnSpd, });
      }
    }
});
const main = async () => {
    try {
        await client.connect();
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