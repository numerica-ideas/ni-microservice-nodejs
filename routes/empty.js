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

/**
 * Runs the empties public request.
 * @route GET /empties/public
 * @group Empty - Operations about empties.
 * @returns {object} 200 - A public response.
 * @returns {Error}  default - Unexpected error
 */
router.get('/public', emptyController.public);

/**
 * Runs the empties protected request.
 * @route GET /empties/protected
 * @group Empty - Operations about empties.
 * @returns {object} 200 - A protected response.
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/protected', guard.check([['ADMIN'], ['MODERATOR'], ['USER']]), emptyController.protected);  // Protectd route

module.exports = router;
