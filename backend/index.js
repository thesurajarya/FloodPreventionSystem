// 1. THE SANITY CHECK: If you don't see this, the file isn't running or isn't saved!
console.log("🚀 Booting up index.js..."); 

const express = require('express');
const http = require('http'); 
const { startBroker } = require('./mqtt/broker');
const { initSocket } = require('./socket/socket'); 

const app = express();
const server = http.createServer(app); 
const PORT = 5000;

// 2. Initialize the WebSocket Server with Error Catching
try {
  initSocket(server);
  console.log("✅ WebSocket bridge initialized.");
} catch (error) {
  console.error("❌ Failed to initialize WebSockets:", error);
}

// 3. Middleware
app.use(express.json());

// 4. Basic Test Route
app.get('/', (req, res) => {
  res.send('HydroGuard API is running!');
});

// 5. Start the HTTP & WebSocket Server
server.listen(PORT, () => {
  console.log(`🌐 API & WebSocket Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  // This catches the silent "Port is already in use" error!
  console.error("❌ Server failed to start. Is port 5000 already in use?", err.message);
});

// 6. Start the MQTT Broker
console.log("⏳ Starting MQTT Broker...");
startBroker().then(() => {
  console.log("✅ Broker startup sequence complete.");
}).catch(err => {
  console.error("❌ MQTT Broker failed to start:", err);
});