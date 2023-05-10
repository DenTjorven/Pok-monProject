import express from "express";
import ejs from "ejs";
const fetch = require('node-fetch');
const app = express();
import methodOverride from 'method-override';
import session from 'express-session';
app.use(methodOverride('_method'));
import { MongoClient, ObjectId, InsertOneResult } from "mongodb";
const uri: string = "mongodb+srv://kirolloswanas:W2Y5kH10NuxLDeQZ@cluster0.eqghavq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
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
      console.log(username);
      console.log(password);
      const userDoc = await client.db("Pokemon").collection("Users").findOne({ userName: username, userPassword: password });
      console.log(userDoc);
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

const addUser = async (user: User): Promise<User> => {
    try {
        await client.connect();
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
        console.log(id);
        let cursor = client.db("Pokemon").collection("GevangenPokemon").find<GevangenPokemon>({user_id: new ObjectId(id)});
        let result = await cursor.toArray();
        console.log(result);
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
      await client.db("Pokemon").collection("GevangenPokemon").insertOne({user_id: pokemon.user_id, pokedexNr: pokemon.pokedexNr});
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await client.close();
    }
};
async function loadData(allepkmn: GevangenPokemon[]): Promise<string[]> {
    const promises = allepkmn.map(async (pokemon) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokedexNr}`);
      const data = await response.json();
      return data.name;
    });
    return Promise.all(promises);
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
    console.log(req.body['pokemon-choice']);
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
    console.log(req.session?.user?._id);
    const userId = req.session?.user?._id;
    if (userId) {
      console.log(userId);
      const allePkmn: GevangenPokemon[] | undefined = await getPokemonArray(userId);
      if (allePkmn) {
        const allePkmnNamen: string[] | undefined = await loadData(allePkmn);
        console.log(allePkmn);
        console.log(allePkmnNamen);
        res.render('pokemonVangen', { allePkmnNamen });
      }
    }
  });
;
app.get("/vergelijken", (req, res) => {
    res.render('pokemonVergelijken');
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