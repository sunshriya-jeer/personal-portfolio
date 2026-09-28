const app = require('./src/server.js');

if (require.main === module) {
  const { startServer } = require('./src/server.js');
  if (typeof startServer === 'function') {
    startServer();
  }
}

module.exports = app;
