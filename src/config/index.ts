/**
 * Config file depending on the env.
 * @author dassiorleando
 */
export const Config = {
    // Process config
    PORT: process.env.PORT || '3000',
    ENV: process.env.NODE_ENV || 'dev',

    // Determining if we did a lambda or ec2 deployment
    IS_LAMBDA: process.env.IS_LAMBDA == 'true' ? true : false,
    TOPIC_ARN: process.env.TOPIC_ARN,

    // Redis credentials
    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_AUTH: process.env.REDIS_AUTH,

    // JWT secret key for tokens encryption/decryption
    JWT_SECRET: process.env.JWT_SECRET,

    // MongoDB uri
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1/ni_microservice_db'

}
