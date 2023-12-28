/**
 * Config file depending on the env.
 * @author dassiorleando
 */
export const Config = {
    // Process config
    PORT: process.env.PORT || '3000',
    ENV: process.env.NODE_ENV || 'dev',

}
