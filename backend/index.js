const express = require('express');
const { startBroker } = require('./mqtt/broker'); // Import the broker

const app = express();
const PORT = 5000; // Your Express API port

app.use(express.json());

// Start the Express server
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});

// Start the MQTT Broker simultaneously
startBroker();