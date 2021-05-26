/**
 * NI Redis sub service: for lambda (cloud function) deployment.
 * Useful to communicate (receive) between microservices.
 * @since 1.5.0
 * @author dassiorleando
 */
const Util = require('./util');
const constant = require('../config/constant');
const redisClient = require('../lib/redis')(true);

/**
 * Ingesting incoming App Events to save.
 * Coming from different sources (microservices).
 */
exports.ingestingEvents = function (callback = Util.noop) {
    redisClient.on('message', function (channel, data) {
        console.log('New event received');
        console.log('Microservice Events ---> Message: ' + data + ' on channel: ' + channel + ' just arrived!');

        // const event = JSON.parse(data);
        if (channel === constant.EVENTS[0]) {
            callback(null, 'Filter policy A processed.');
        } else if (channel === constant.EVENTS[1]) {
            callback(null, 'Filter policy B processed.');
        } else {
            console.error('Unknown filter policy!');
        }
    });
}

/**
 * Subscribes to events
 * @returns {void}
 */
exports.subscribing = function () {
    const events = constant.EVENTS || [];
    events.forEach(event => {
        redisClient.subscribe(event);
    });
}
