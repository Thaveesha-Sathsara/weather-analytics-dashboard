const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const { auth } = require('express-oauth2-jwt-bearer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const weatherController = require('./controllers/weatherController');

const app = express();
const cache = new NodeCache({ stdTTl: 300 }); //5 minute cache

const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf-8'));
const cityCodes = citiesData.List.map(city => city.CityCode);

// auth0 middleware
const checkJwt = auth({
    audience: process.env.AUTH_AUDIENCE || 'https://weather-api',
    issuerBaseURL: `https://${process.env.AUTH_DOMAIN || 'dev-b5yr0mxjii1hhmuo.us.auth0.com'}/`,
});

app.use(cors());

app.get('/api/weather', checkJwt, async (req, res) => { 
    weatherController.getWeatherData(req, res, cityCodes);
});

app.get('/api/debug/cache', (req, res) => {
    weatherController.getCacheStatus(req, res);
});

// helper function for comfort index
function calculateComfortIndex(temp, humidity, wind) {
    const tempImpact = Math.abs(temp - 22) * 2.5;
    const humidityImpact = humidity * 0.2;
    const windImpact = wind * 0.5;

    let score = 100 - (tempImpact + humidityImpact + windImpact);
    return Math.max(0, Math.min(100, score)); // value is between 0 and 100
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});