/**
 * Setting up the express app and server.
 * @author dassiorleando
 */
import express, { Express, Request, Response, NextFunction } from 'express';

// Environment variables lookup
import dotenv from 'dotenv';
import { resolve } from 'path'
const dotenvResult = dotenv.config({ path: resolve(__dirname, '../.env') });

import * as Util from './services/util';
import cors from 'cors';

// Some routes
import emptyRoute from './routes/empty';

const router = express.Router();
const app: Express = express();
import { Config } from './config';
const expressSwagger = require('express-swagger-generator')(app);

if (dotenvResult.error) {
	console.log('===== Error loading the .env file =====');
	process.exit(1);
}

// Enable CORS
app.use(cors()); // Enable all CORS requests for all routes

// Parsers
app.use(express.json({ limit: '50000mb' }));                         // Json
app.use(express.urlencoded({ limit: '50000mb', extended: false }));  // form-url-encoded

// The endpoints' prefix
app.use('/ni-microservice-node', router);

// Set our api routes
router.get('/pingify', (req: Request, res: Response) => res.send('SERVICE IS FINE'));
router.use('/empties', emptyRoute);

// Middleware for errors handling
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
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
		schemes: ['http', 'https'],
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
	files: ['./routes/*.js', './routes/**/*.js'] //Path to the API handle folder
};

// Let's disable swagger for production deployment only
// If enabled, we can import it in Postman to experiment with the API endpoints.
if (Config.ENV !== 'production') expressSwagger(options);

// Catch all other routes then throw
app.get('*', (req: Request, res: Response) => {
	res.status(404).send('Resource Not Found');
});

// Initialization
Util.init();

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(Config.PORT, function () {
	console.log(`Numerica Ideas - microservice: running on http://localhost:${Config.PORT}`);
});
