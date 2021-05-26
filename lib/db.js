/**
 * NI singleton MongoDB connection lib.
 * @author dassiorleando
 */
const mongoose = require('mongoose');
const config = require('../config');
const Util = require('../services/util');

/**
 * Connecting to the defined MongoDB server
 * @returns {void}
 */
module.exports = () => {
  global.isDBConnected = false;

  // Database connection
  const db = mongoose.connection;

  // explicit connect
  function connect () {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: false, reconnectTries: 30, reconnectInterval: 500, auto_reconnect: true }).then(() => {
    }).catch(Util.error);
  }

  connect();

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
    if (!global.isDBConnected) connect();
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', function () {
    db.close(function () {
        console.log('Force closing MongoDB conection');
        process.exit(0);
    });
  });

  // Registering schemas
  require('../models/empty');
}
