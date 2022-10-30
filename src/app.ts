/**
 * Setting up the express app.
 * @author dassiorleando
 */
import express, { Express } from 'express';
const db = require('./lib/db')();
const redisClient = require('./lib/redis')();
import * as Util from './services/util';
import cors from 'cors';
import cron from 'node-cron';

// Some routes
import emptyRoute from './routes/empty';

import * as redisSubService from './services/redis.sub';
const router = express.Router();
const app: Express = express();
import eJwt from 'express-jwt'; // The middleware for JWT (decrypt to have the req.user object)
import { Config } from './config';
const expressSwagger = require('express-swagger-generator')(app);

// Enable CORS
app.use(cors()); // Enable all CORS requests for all routes

// Parsers
app.use(express.json({ limit: '50000mb' }));                         // Json
app.use(express.urlencoded({ limit: '50000mb', extended: false }));  // form-url-encoded

// express-jwt config
app.use(eJwt({
  secret: Config.JWT_SECRET,
  credentialsRequired: false
}));

// The endpoints' prefix
app.use('/ni-microservice-node', router);

// Set our api routes
router.get('/pingify', (req, res) => res.send('SERVICE IS FINE'));
router.use('/empties', emptyRoute);

// Ingesting App events when deployed into a server, either we get them via SNS
(async () => {
  if (!Config.IS_LAMBDA) {
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
app.use(function (err, req, res, next) {
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
    host: `localhost:${Config.PORT}`,
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
if (Config.ENV !== 'production') expressSwagger(options);

// Catch all other routes then throw
app.get('*', (req, res) => {
  res.status(404).send('Resource Not Found');
});

export = app;
