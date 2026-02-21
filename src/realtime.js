const { Server } = require('socket.io');

let io = null;

function init(server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log('[realtime] client connected', socket.id);
    socket.on('disconnect', (reason) => {
      console.log('[realtime] client disconnected', socket.id, reason);
    });
    socket.on('error', (err) => {
      console.error('[realtime] socket error', err);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { init, getIO };
