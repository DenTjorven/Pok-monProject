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
      const userDoc = await client.db("mydatabase").collection("users").findOne({ userName: username, userPassword: password });
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
const getPokemonArray = async (_id:ObjectId) => {
    try {
        await client.connect();
        //code to be completed
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}
const addPokemon = async (pokemon: GevangenPokemon): Promise<void> => {
    try {
      await client.connect();
      await client.db("Pokemon").collection("GevangenPokemon").insertOne(pokemon);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await client.close();
    }
};
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
    console.log(user);
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
app.get("/vangen", (req, res) => {
    res.render('pokemonVangen');
});
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