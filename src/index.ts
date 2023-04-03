import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';
import { config } from './config.js';
const { PORT } = config;
import createDebug from 'debug';

const debug = createDebug('GW');
const port = PORT || 6000;
const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(port);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error', error.message);
});

server.on('listening', () => {
  debug('Listening http://localhost:' + port);
});
