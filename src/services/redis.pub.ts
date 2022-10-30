/**
 * NI Redis pub service: for server (ec2) deployment.
 * Useful to communicate (publish) between microservices.
 * @since 1.5.0
 * @author dassiorleando
 */
const redisClient = require('../lib/redis')(true);

/**
 * Pushing the event
 */
export const send = function (topic, data) {
    if (topic && data) {
        return redisClient.publishAsync(topic, JSON.stringify(data));
    } else {
        return Promise.reject({ success: false, message: 'Bad parameters provided for Redis pub!' });
    }
}
