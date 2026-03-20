const net = require('net');
const { Aedes } = require('aedes');
const { getIo } = require('../socket/socket'); // Make sure this points to your new socket.js file

const port = 1883; // Standard MQTT Port

const startBroker = async () => {
  try {
    console.log("⚙️  Initializing Aedes MQTT Broker...");
    
    // 1. Create the broker asynchronously (Aedes v1.0.0+)
    const aedes = await Aedes.createBroker();
    
    // 2. Tie it to a standard Node.js TCP server
    const server = net.createServer(aedes.handle);

    // 3. Start listening for your ESP32
    server.listen(port, function () {
      console.log(`🚀 Local MQTT Broker is officially running on port ${port}`);
    });

    // 4. Catch silent port errors (CRITICAL FOR WINDOWS)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: MQTT Port ${port} is already in use! Do you have another broker running in the background?`);
      } else {
        console.error("❌ MQTT Server Error:", err);
      }
    });

    // --- DEBUGGING EVENTS ---
    
    // Fires when your ESP32 connects
    aedes.on('client', function (client) {
      console.log(`[🟢 ESP32 CONNECTED] ID: ${client ? client.id : 'unknown'}`);
    });

    // Fires when your ESP32 disconnects
    aedes.on('clientDisconnect', function (client) {
      console.log(`[🔴 ESP32 DISCONNECTED] ID: ${client ? client.id : 'unknown'}`);
    });

    // Fires every time water level data is published from the ESP32
    aedes.on('publish', function (packet, client) {
      // Ignore internal aedes system topics that start with '$SYS'
      if (client && !packet.topic.startsWith('$SYS')) {
        const payload = packet.payload.toString();
        console.log(`[📡 MESSAGE RECEIVED] Topic: ${packet.topic} | Data: ${payload}`);

        // --- THE WEBSOCKET BRIDGE ---
        try {
          // Parse the JSON string from the ESP32 into a JavaScript object
          const sensorData = JSON.parse(payload);
          
          // Grab the active Socket.io instance
          const io = getIo();
          
          // Broadcast the event 'liveSensorData' to all connected React dashboards
          io.emit('liveSensorData', sensorData); 
        } catch (error) {
          console.error("⚠️ Failed to parse or emit MQTT payload to WebSockets:", error.message);
        }
      }
    });

    return aedes;
  } catch (error) {
    console.error('❌ Failed to start MQTT broker:', error);
    throw error; // Pass the error back to index.js so it knows we failed
  }
};

module.exports = { startBroker };