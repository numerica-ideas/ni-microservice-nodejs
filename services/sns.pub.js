/**
 * NI SNS publish service using AWS-SNS, for lambda deployment.
 * @since 1.5.0
 * @author dassiorleando
 */
const AWS = require('aws-sdk');
const config = require('../config');

/**
 * Publishes a message to an SNS topic.
 * @param {string} topic The topic to publish to.
 * @param {object} dataToSend The data to send.
 * @returns {Promise<object>} Promise that resolves to the message sent.
 */
exports.publishToTopic = async function (topic, dataToSend) {
    if (!topic || !dataToSend) return Promise.reject({ success: false, message: 'Invalid data provided for SNS push.' });

    // The parameter
    var params = {
        TopicArn: config.TOPIC_ARN,
        Message: JSON.stringify(dataToSend),
        MessageAttributes: {
            'type': {
                'DataType': 'String',
                'StringValue': topic
            }
        }
    }
    return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
}
