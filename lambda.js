/**
 * AWS Lambda handler.
 * @author dassiorleando
 */
const config = require('./config');
const app = require('./app');
const Util = require('./services/util');
const serverless = require('serverless-http');
const snsSubService = require('./services/sns.sub');

// Initialization
Util.init(config);

// Serverless handler
const handle = serverless(app);

/**
 * The Lambda handler is required to run the App on AWS Lambda
 * @param {Object} event the event starting the function (the request)
 * @param {Object} context the context
 * @returns {void}
 */
exports.handler = (event, context, callback) => {
	console.log('The stage is: ' + process.env.NODE_ENV);
	
	// Don't wait for the event loop to be empty to return the callback (mongoose/redis pool and/or cached variables).
	context.callbackWaitsForEmptyEventLoop = false;

	const eventName = event.name + '';
	const eventData = event.Records && event.Records[0];

	if (eventName.indexOf('LAMBDA_WARMER') !== -1) {		// The Lambda warmer.
		console.log('Warming the lambda ...');
		context.succeed({ success: true });
		console.log('Warmed up successfully');
	} else if (eventName === 'CACHING_DATA') {				// For cron jobs defined as scheduled nevents into the package.json file.
		// Calling some code to process the caching data job
	} else if (eventData && eventData.EventSource === 'aws:sns') {
		// Investing other SNS notification for inter-microservices communication
		snsSubService.ingestingEvents(eventData.Sns, callback);
	} else {
		return handle(event, context, callback);
	}
}
