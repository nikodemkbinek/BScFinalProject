const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors()); // Critical: allows React (port 3000) to talk to this server

// This is your 'Offline' data
const localData = {
    city: "London",
    food: 40,
    transport: 15,
    accommodation: 80
};

app.get('/api/budget', (req, res) => {
    // For now, we just return the local data
    res.json(localData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});