const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

const calculateComfortIndex = (temp, humidity, wind) => {
    const tempImpact = Math.abs(temp - 22) * 2.5;
    const humidityImpact = humidity * 0.2;
    const windImpact = wind * 0.5;
    let score = 100 - (tempImpact + humidityImpact + windImpact);
    return Math.max(0, Math.min(100, score));
};

let cacheStats = {
    hits: 0,
    misses: 0,
    lastUpdated: null
};

exports.getWeatherData = async (req, res, cityCodes) => {
    const cachedData = cache.get("weather_results");
    if (cachedData) return res.json({ source: 'cache', data: cachedData });

    try {
        const requests = cityCodes.map(id =>
            axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=${process.env.OPENWEATHER_KEY}`)
        );

        const responses = await Promise.all(requests);
        const processedResults = responses.map(r => {
            const data = r.data;
            const score = calculateComfortIndex(data.main.temp, data.main.humidity, data.wind.speed);
            return {
                name: data.name,
                description: data.weather[0].description,
                temp: data.main.temp,
                score: parseFloat(score.toFixed(2)),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            };
        });

        processedResults.sort((a, b) => b.score - a.score);
        const rankedResults = processedResults.map((city, index) => ({ ...city, rank: index + 1 }));

        cache.set("weather_results", rankedResults);
        res.json({ source: 'api', data: rankedResults });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};

exports.getCacheStatus = (req, res) => {
    const keys = cache.keys();
    res.json({
        status: "Active",
        stats: cacheStats,
        keysStored: keys,
        ttlSeconds: 300
    });
};