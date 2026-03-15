const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());

app.get('/api/budget', async (req, res) => {
  const city = req.query.city ? req.query.city.toLowerCase() : 'london';
  const days = req.query.days ? parseInt(req.query.days) : 1;

  try {
    const apiResponse = await fetch(`https://restcountries.com/v3.1/capital/${city}`);

    if (!apiResponse.ok) {
      return res.status(404).json({ error: "City not found. Try a capital city like Tokyo, Berlin, or Ottawa!" });
    }


    const data = await apiResponse.json();
    const countryData = data[0]; 

    const countryName = countryData.name.common;
    const region = countryData.region; 
    const flagSvg = countryData.flags.svg; 


    let baseFood = 30, baseTransport = 10, baseAccommodation = 50; 

    if (region === 'Europe' || region === 'Americas') {
      baseFood = 55; baseTransport = 20; baseAccommodation = 110;
    } else if (region === 'Oceania') {
      baseFood = 50; baseTransport = 15; baseAccommodation = 100;
    }

    res.json({
      city: `${countryData.capital[0]}, ${countryName}`,
      days: days,
      food: baseFood * days,
      transport: baseTransport * days,
      accommodation: baseAccommodation * days,
      flag: flagSvg
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to connect to the external API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});