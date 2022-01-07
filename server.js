// Retrieve API key from .env file.
const dotenv = require('dotenv');
dotenv.config();
const apiKeys = {
    API_KEY: process.env.API_KEY
}

// Setup empty JS object to act as endpoint for all routes.
let projectData = {};

// Require Express to run server and routes.
const express = require('express');

// Start up an instance of app.
const app = express();

// Dependencies
const countryCodes = require('./country-codes');
const bodyParser = require('body-parser');
// Middleware
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance.
const cors = require('cors');
app.use(cors());

// Initialize the main project folder.
app.use(express.static('website'));

// Initialize weather journal data route with a callback function.
app.get('/weatherJournal', (req, res) => {
    res.send(projectData);
});

// Initialize API key route with a callback function.
app.get('/apiKeys', (req, res) => {
    res.send(apiKeys);
});

// Initialize country code route with a callback function.
app.get('/countryCodes', (req, res) => {
    res.send(countryCodes);
});

// POST route
app.post('/addWeatherJournal', (req, res) => {
    projectData.temp = req.body.temp;
    projectData.zip = req.body.zip;
    projectData.city = req.body.city;
    projectData.country = req.body.country;
    projectData.date = req.body.date;
    projectData.content = req.body.content;
    res.send({});
});

// Setup Server
const port = 3000;

const server = app.listen(port, () => {
    console.log("server running");
    console.log(`running on localhost: ${port}`);
});
