const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  // Enable CORS so your Vite frontend can talk to your backend
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 [WEBSOCKET CONNECTED] React Dashboard ID: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 [WEBSOCKET DISCONNECTED] React Dashboard ID: ${socket.id}`);
    });
  });

  return io;
};

// This lets us grab the live socket connection from our MQTT file
const getIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet!");
  }
  return io;
};

module.exports = { initSocket, getIo };