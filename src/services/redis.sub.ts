/**
 * NI Redis sub service: for lambda (cloud function) deployment.
 * Useful to communicate (receive) between microservices.
 * @since 1.5.0
 * @author dassiorleando
 */
import * as Util from './util';
import { Constant } from '../config/constant';
const redisClient = require('../lib/redis')(true);

/**
 * Ingesting incoming App Events to save.
 * Coming from different sources (microservices).
 */
 export const ingestingEvents = function (callback = Util.noop) {
    redisClient.on('message', function (channel, data) {
        console.log('New event received');
        console.log('Microservice Events ---> Message: ' + data + ' on channel: ' + channel + ' just arrived!');

        // const event = JSON.parse(data);
        if (channel === Constant.EVENTS[0]) {
            callback(null, 'Filter policy A processed.');
        } else if (channel === Constant.EVENTS[1]) {
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
export const subscribing = function () {
    const events = Constant.EVENTS || [];
    events.forEach(event => {
        redisClient.subscribe(event);
    });
}
