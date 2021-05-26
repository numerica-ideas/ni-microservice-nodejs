/**
 * Empty route.
 * @author dassiorleando
 */
const express = require('express');
const router = express.Router();
const eJwt = require('express-jwt');
const config = require('../config');
const emptyController = require('../controllers/empty');
const guard = require('express-jwt-permissions')();

// JWT authentication may be required
router.use(eJwt({
    secret: config.JWT_SECRET,
    credentialsRequired: false      // Turn this to true if all the routes below are protected
}));

// Some empty routes
router.get('/public', emptyController.public);
router.get('/protected', guard.check([['ADMIN'], ['MODERATOR'], ['USER']]), emptyController.protected);  // Protectd route

module.exports = router;
