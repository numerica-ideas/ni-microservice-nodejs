/**
 * Setting up the express app.
 * @author dassiorleando
 */
const express = require('express');
const db = require('./lib/db')();
const redisClient = require('./lib/redis')();
const Util = require('./services/util');
const cors = require('cors');
const cron = require('node-cron');

// Some routes
const emptyRoute = require('./routes/empty');

const redisSubService = require('./services/redis.sub');
const router = express.Router();
const app = express();
const eJwt = require('express-jwt'); // The middleware for JWT (decrypt to have the req.user object)
const config = require('./config');
const expressSwagger = require('express-swagger-generator')(app);

// Enable CORS
app.use(cors()); // Enable all CORS requests for all routes

// Parsers
app.use(express.json({ limit: '50000mb' }));                         // Json
app.use(express.urlencoded({ limit: '50000mb', extended: false }));  // form-url-encoded

// express-jwt config
app.use(eJwt({
  secret: config.JWT_SECRET,
  credentialsRequired: false
}));

// The endpoints' prefix
app.use('/ni-microservice-node', router);

// Set our api routes
router.get('/pingify', (req, res) => res.send('SERVICE IS FINE'));
router.use('/empties', emptyRoute);

// Ingesting App events when deployed into a server, either we get them via SNS
(async () => {
  if (!config.IS_LAMBDA) {
    // Loading Redis ingest and subscriber services for server deployment
    redisSubService.ingestingEvents();
    redisSubService.subscribing();

    // We save some service settings, it can be accessible by other ones trying to communicate with it
    // If they notice it's deployed on Lambda they send SNS events here, but for server they will use redis.
    await redisClient.hmsetAsync('service:ni-microservice-node', ['type', 'server']);  // Server (ec2) deployment
    
    // Running jogs using node-cron package
    cron.schedule("0 * * * *", () => { // Every hour
      // Calling a service for scheduled event processing
    });
  } else {
    // Here events are handled using AWS-SNS
    await redisClient.hmsetAsync('service:ni-microservice-node', ['type', 'lambda']);  // Lambda deployment

    // Caching and cron jobs for Lambda deployments are executed by scheduled events defined by running some NPM scripts once.
  }
})();

// Middleware for handling some errors
router.use(function (err, req, res, next) {
  if (err.code === 'invalid_token') {
    res.status(403).send('Invalid token!');
  } else if (err.code === 'permission_denied' || err.code === 'permissions_invalid' || err.name === 'UnauthorizedError') {
    res.status(403).send('Not allowed !');
  } else if (err.code === 'user_object_not_found' || err.code === 'permissions_not_found' || err.code === 'request_property_undefined' || err.code === 'credentials_required') {
    res.status(403).send('Access Denied !');
  } else {
    // Catch up unhandled errors
    Util.error(err);
    res.status(400).json({ success: false, message: Util.getErrorMessage(err) });
  }
});

// Swagger configurations
let options = {
  swaggerDefinition: {
    info: {
      description: 'Micro service sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: `localhost:${config.PORT}`,
    basePath: '/ni-microservice-node',
    produces: [
      "application/json",
      "application/xml"
    ],
    schemes: [ 'http', 'https' ],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "The user's token used for protected endpoints, the format is 'Bearer token'.",
      }
    }
  },
  basedir: __dirname, // App absolute path
  files: [ './routes/*.js', './routes/**/*.js' ] //Path to the API handle folder
};

// Let's disable swagger for production deployment only
// If enabled, we can import it in Postman to experiment with the API endpoints.
if (config.ENV !== 'production') expressSwagger(options);

// Catch all other routes then throw
app.get('*', (req, res) => {
  res.status(404).send('Resource Not Found');
});

module.exports = app;
