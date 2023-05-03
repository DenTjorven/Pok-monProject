import express from "express";
import ejs from "ejs";
const fetch = require('node-fetch');
const app = express();
app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

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

app.listen(app.get('port'), ()=>console.log( '[server] http://localhost:' + app.get('port')));