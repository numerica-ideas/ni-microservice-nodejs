/**
 * Setting up the microservice server.
 * @author dassiorleando
 */
const dotenvResult = require('dotenv').config();
const app = require('./app');
const http = require('http');
const Util = require('./services/util');
const config = require('./config');

if (dotenvResult.error) {
  console.log('===== Error loading the .env file =====');
  process.exit(1);
}

// Initialization
Util.init(config);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
const port = config.PORT;
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
