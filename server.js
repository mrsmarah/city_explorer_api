'use strict';
// Load Environment Variables from (.env) file:
require('dotenv').config();
// Application Dependencies:
const express = require('express');
const cors = require('cors');

// Application Setup:
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

// API Routes:
app.get('/', (request, response) => {
  response.status(200).send('Home Page!');
});

app.get('/bad', (request, response) => {
  throw new Error('oh nooooo!');
});
  //Location route:
app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.status(200).json(locationData);
  } catch (error) {errorHandler(error, request, response);}
});
  //Weather route:
app.get('/weather', (request, response) => {
  try {
    const skyData = require('./data/darksky.json');
    const city = request.query.city;
    for ( var i=0 ; i<8 ; i++){
    new Weather(city, skyData.data[i]);
    }
    response.status(200).json(eightDaysArr);
    eightDaysArr =[];
  } catch (error) {errorHandler(error, request, response);}  
});

app.use('*', notFoundHandler);

//location constructor:
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
// let str = skyData.data[0].valid_date;
// var b = str.split(/\D/);
// var date = new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]);
// console.log(date);

//weather constructor:
var eightDaysArr =[];
function Weather(city, skyData) {
  this.search_query = city;
  this.valid_date = skyData.valid_date;
  this.weather = skyData.weather.description;
  eightDaysArr.push(this);
}
// Helper Functios:
function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
//Server is listening for requests:
app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));
