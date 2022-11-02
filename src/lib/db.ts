/**
 * NI singleton MongoDB connection lib.
 * @author dassiorleando
 */
import * as Util from '../services/util';
import { Config } from '../config';
import { connect, connection, ConnectOptions } from 'mongoose';

const global: any = {};

/**
 * Connecting to the defined MongoDB server
 * @returns {void}
 */
module.exports = () => {
  global.isDBConnected = false;

  // Database connection
  const db = connection;

  // explicit connect
  function dbConnect () {
    const options: ConnectOptions = { useNewUrlParser: true, useUnifiedTopology: false, reconnectTries: 30, reconnectInterval: 500, autoReconnect: true };
    connect(Config.MONGODB_URI, options).then(() => {}).catch(Util.error);
  }

  dbConnect();

  // Connection events
  db.on('connected', function () {
    global.isDBConnected = true;
    console.log('✅ Connected to MongoDB database');
  });

  db.on('reconnected', function () {
    console.log('MongoDB reconnected');
  });

  db.on('error', function (e) {
    console.error('❌ MongoDB Connection Error: ', e);
  });

  db.on('disconnected', function () {
    console.log('MongoDB is disonnected!');
    if (!global.isDBConnected) dbConnect();
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', function () {
    db.close(function () {
        console.log('Force closing MongoDB conection');
        process.exit(0);
    });
  });
}
