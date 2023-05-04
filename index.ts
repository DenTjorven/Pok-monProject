import express from "express";
import ejs from "ejs";
const fetch = require('node-fetch');
const app = express();
import methodOverride from 'method-override';
app.use(methodOverride('_method'));
import { MongoClient, ObjectId } from "mongodb";
const uri: string = "mongodb+srv://kirolloswanas:W2Y5kH10NuxLDeQZ@cluster0.eqghavq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

interface User {
    _id?: ObjectId,
    firstName: string,
    lastName: string,
    userPassword: string,
    userName: string,
}
interface GevangenPokemon {
    _id?: ObjectId,
    user_id: ObjectId,
    pokedexNr: number,
    nicknamePokemon?: string
}

const GetPokemonArray = async (_id:ObjectId) => {
    try {
        await client.connect();
        await client.db("Pokemon").collection("Users").deleteMany({}); //om dublicaties te vermijden elk keer we de script runnen
        await client.db("Pokemon").collection("GevangenPokemon").deleteMany({}); //om dublicaties te vermijden elk keer we de script runnen
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}

app.get("/", (req, res) => {
    res.render('algemeneLandingspagina');
});
app.get("/pokedex", (req, res) => {
    res.render('eigenPokemonMultiple');
});

app.get("/login", (req, res) => {
    res.render('login');
});
app.get("/registration", (req, res) => {
    res.render('registration');
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

main();


app.listen(app.get('port'), ()=>console.log( '[server] http://localhost:' + app.get('port')));
export {};