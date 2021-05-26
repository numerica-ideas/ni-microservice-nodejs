/**
 * NI SNS subscribe service using AWS-SNS, for lambda deployment.
 * @since 1.5.0
 * @author dassiorleando
 */
const constant = require('../config/constant');

/**
 * Ingesting incoming SNS events.
 * @param {object} snsEvent The incomming SNS event data.
 * @param {*} callback The Lambda callback
 * @returns {void}
 */
exports.ingestingEvents = function (snsEvent, callback) {
    console.log('The event message ID is: ' + snsEvent.MessageId);
    const filterPolicyType = snsEvent.MessageAttributes && snsEvent.MessageAttributes.type && snsEvent.MessageAttributes.type.Value;
    if (snsEvent.Type === 'Notification') {
        // Let's process it depending on the filter policies
        if (filterPolicyType === constant.EVENTS[0]) {
            callback(null, 'Filter policy A processed.');
        } else if (filterPolicyType === constant.EVENTS[1]) {
            callback(null, 'Filter policy B processed.');
        } else {
            callback(new Error('Unknown filter policy!'), null);
        }
    } else {
        callback(new Error('We only process notification.'), null);
    }
}
