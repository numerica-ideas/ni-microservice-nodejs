/**
 * Empty route.
 * @author dassiorleando
 */
import express from 'express';
const router = express.Router();
import * as emptyController from '../controllers/empty';

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
router.get('/protected', emptyController.protectedFunc);  // Protectd route

export = router;
