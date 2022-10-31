/**
 * NI empty controller that handles empty API enpoints.
 * @author dassiorleando
 * @since 1.5.0
 */
import * as status from 'http-status';
import * as emptyService from '../services/empty';

/**
 * A public action.
 * @param {*} req
 * @param {*} res
 */
export const publicFunc = async (req, res) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(true) });
}

/**
 * A protected action.
 * @param {*} req
 * @param {*} res
 */
export const protectedFunc = async (req, res) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(false) });
}
