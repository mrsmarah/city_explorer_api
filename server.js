'use strict';
// Load Environment Variables from (.env) file:
require('dotenv').config();
// Application Dependencies:
const express = require('express');
const cors = require('cors');

// Application Setup:
const PORT = process.env.PORT || 4000;
const app = express(); //creating the server, waiting for the app.listen
app.use(cors());//will respond to any request

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
    const allDaysArr =[];
    skyData.data.forEach((day) =>{
      allDaysArr.push(new Weather(day))
    })
    response.status(200).json(allDaysArr);
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
//weather constructor:
function Weather(skyData) {
  this.forecast = skyData.weather.description;
  this.time = new Date(skyData.valid_date).toDateString();
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
