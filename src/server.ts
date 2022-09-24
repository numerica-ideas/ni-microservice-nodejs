/**
 * Setting up the microservice server.
 * @author dassiorleando
 */
import dotenv from 'dotenv';
import * as app from './app';
import http from 'http';
import * as Util from './services/util';
import { Config } from './config';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.log('===== Error loading the .env file =====');
  process.exit(1);
}

// Initialization
Util.init(Config);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
const port = Config.PORT;
app.set('port', port);
app.set('trust proxy', true);

/**
 * Listen on provided port, on all network interfaces.
 * @param {number} port the port to run the project on
 * @returns {void}
 */
server.listen(port, function () {
  console.log(`Numerica Ideas - microservice: running on localhost ${port}.`);
});
