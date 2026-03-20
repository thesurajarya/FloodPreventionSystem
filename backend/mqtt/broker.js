const net = require('net');
const { Aedes } = require('aedes'); // Destructure Aedes from the package
const port = 1883;

// The initialization must now be async in V1.0.0+
const startBroker = async () => {
  try {
    // 1. Create the broker asynchronously
    const aedes = await Aedes.createBroker();
    
    // 2. Tie it to a standard Node.js TCP server
    const server = net.createServer(aedes.handle);

    // 3. Start listening for your ESP32
    server.listen(port, function () {
      console.log(`🚀 Local MQTT Broker is running on port ${port}`);
    });

    // --- DEBUGGING EVENTS ---
    
    // Fires when your ESP32 connects
    aedes.on('client', function (client) {
      console.log(`[CLIENT CONNECTED] ID: ${client ? client.id : 'unknown'}`);
    });

    // Fires when your ESP32 disconnects
    aedes.on('clientDisconnect', function (client) {
      console.log(`[CLIENT DISCONNECTED] ID: ${client ? client.id : 'unknown'}`);
    });

    // Fires every time water level data is published
    aedes.on('publish', function (packet, client) {
      // Ignore internal system logs that start with '$SYS'
      if (client && !packet.topic.startsWith('$SYS')) {
        const payload = packet.payload.toString();
        console.log(`[MESSAGE RECEIVED] Topic: ${packet.topic} | Data: ${payload}`);
      }
    });

    return aedes;
  } catch (error) {
    console.error('Failed to start MQTT broker:', error);
  }
};

module.exports = { startBroker };