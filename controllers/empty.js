/**
 * NI empty controller that handles empty API enpoints.
 * @author dassiorleando
 * @since 1.5.0
 */
const status = require('http-status');
const emptyService = require('../services/empty');

/**
 * A public action.
 * @param {*} req 
 * @param {*} res 
 */
exports.public = async (req, res) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(true) });
}

/**
 * A protected action.
 * @param {*} req 
 * @param {*} res 
 */
exports.protected = async (req, res) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(false) });
}
