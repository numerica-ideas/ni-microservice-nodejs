/**
 * Empty route.
 * @author dassiorleando
 */
import express from 'express';
const router = express.Router();
import * as eJwt from 'express-jwt';
import { Config } from '../config';
import * as emptyController from '../controllers/empty';
import eJwtPerm from 'express-jwt-permissions';
const guard = eJwtPerm();

// JWT authentication may be required
router.use(eJwt({
    secret: Config.JWT_SECRET,
    credentialsRequired: false      // Turn this to true if all the routes below are protected
}));

/**
 * Runs the empties public request.
 * @route GET /empties/public
 * @group Empty - Operations about empties.
 * @returns {object} 200 - A public response.
 * @returns {Error}  default - Unexpected error
 */
router.get('/public', emptyController.publicFunc);

/**
 * Runs the empties protected request.
 * @route GET /empties/protected
 * @group Empty - Operations about empties.
 * @returns {object} 200 - A protected response.
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/protected', guard.check([['ADMIN'], ['MODERATOR'], ['USER']]), emptyController.protectedFunc);  // Protectd route

export = router;
