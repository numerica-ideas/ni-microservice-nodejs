/**
 * NI SNS publish service using AWS-SNS, for lambda deployment.
 * @since 1.5.0
 * @author dassiorleando
 */
import { SNS } from 'aws-sdk';
import { Config } from '../config';

/**
 * Publishes a message to an SNS topic.
 * @param {string} topic The topic to publish to.
 * @param {object} dataToSend The data to send.
 * @returns {Promise<object>} Promise that resolves to the message sent.
 */
export const publishToTopic = async function (topic, dataToSend) {
    if (!topic || !dataToSend) return Promise.reject({ success: false, message: 'Invalid data provided for SNS push.' });

    // The parameter
    const params: any = {
        TopicArn: Config.TOPIC_ARN,
        Message: JSON.stringify(dataToSend),
        MessageAttributes: {
            Channel: {
                Type: 'String',
                Value: topic
            }
        }
    }
    return new SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
}
