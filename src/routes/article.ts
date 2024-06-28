/**
 * Article route.
 * @author dassiorleando
 */
import express from 'express';
const router = express.Router();
import eJwt from 'express-jwt';
import { Config } from '../config';
import * as articleController from '../controllers/article';
import eJwtPerm from 'express-jwt-permissions';
const guard = eJwtPerm();

// JWT authentication may be required
router.use(eJwt({
    secret: Config.JWT_SECRET,
    credentialsRequired: false      // Turn this to true if all the routes below are protected
}));

/**
 * Runs the articles public request.
 * @route GET /articles/public
 * @group Article - Operations about articles.
 * @returns {object} 200 - A public response.
 * @returns {Error}  default - Unexpected error
 */
router.get('/public', articleController.publicFunc);

/**
 * Runs the articles protected request.
 * @route GET /articles/protected
 * @group Article - Operations about articles.
 * @returns {object} 200 - A protected response.
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/protected', guard.check([['ADMIN'], ['MODERATOR'], ['USER']]), articleController.protectedFunc);  // Protectd route

// CRUD routes
router.post('/', articleController.create);
router.get('/', articleController.findAll);
router.get('/:articleId', articleController.findOne);
router.put('/:articleId', articleController.update);
router.delete('/:articleId', articleController.deleteIt);

export = router;
