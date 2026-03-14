const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors()); 

const travelDatabase = {
  london: { city: "London", food: 40, transport: 15, accommodation: 80 },
  tokyo: { city: "Tokyo", food: 30, transport: 10, accommodation: 60 },
  paris: { city: "Paris", food: 45, transport: 20, accommodation: 100 },
  newyork: { city: "New York", food: 50, transport: 15, accommodation: 120 },
  rome: { city: "Rome", food: 35, transport: 12, accommodation: 90 }
};

app.get('/api/budget', (req, res) => {
  const requestedCity = req.query.city ? req.query.city.toLowerCase().replace(/\s/g, '') : 'london';
  
  const days = req.query.days ? parseInt(req.query.days) : 1;

  const cityData = travelDatabase[requestedCity];

  if (cityData) {
    const responseData = {
      city: cityData.city,
      days: days,
      food: cityData.food * days,
      transport: cityData.transport * days,
      accommodation: cityData.accommodation * days
    };
    res.json(responseData);
  } else {

    res.status(404).json({ error: "City not found in database. Try London, Tokyo, Paris, New York, or Rome." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});