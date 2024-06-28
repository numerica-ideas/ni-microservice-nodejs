/**
 * NI empty controller that handles empty API enpoints.
 * @author dassiorleando
 * @since 1.5.0
 */
import * as status from 'http-status';
import { Request, Response } from 'express';
import * as emptyService from '../services/empty';
import mongoose from 'mongoose';

/**
 * A public action.
 * @param {*} req
 * @param {*} res
 */
export const publicFunc = async (req: Request, res: Response) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(true) });
}

/**
 * A protected action.
 * @param {*} req
 * @param {*} res
 */
export const protectedFunc = async (req: Request, res: Response) => {
    res.status(status.OK).json({ success: true, message: emptyService.aFunction(false) });
}


/**
 * @param {*} req
 * @param {*} res
 */
export const create = async (req: Request, res: Response) => {
    const emptyCreated = await emptyService.create(req.body);
    res.status(status.OK).json({ success: true, data: emptyCreated });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const findOne = async (req: Request, res: Response) => {
    const emptyId = req.params.emptyId;

    // Check first if it is a valid Id
    if (!emptyId || !mongoose.Types.ObjectId.isValid(emptyId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    const emptyFound = await emptyService.findById(emptyId);
    res.status(status.OK).json({ success: true, data: emptyFound });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const findAll = async (req: Request, res: Response) => {
    const emptiesFound = await emptyService.findAll();
    res.status(status.OK).json({ success: true, data: emptiesFound });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const update = async (req: Request, res: Response) => {
    const emptyId = req.params.emptyId;

    // Check first if it is a valid Id
    if (!emptyId || !mongoose.Types.ObjectId.isValid(emptyId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    try {
        const emptyUpdated = await emptyService.update(emptyId, req.body);
        res.status(status.OK).json({ success: true, data: emptyUpdated });
    } catch (e) {
        console.log(e);
        res.status(status.INTERNAL_SERVER_ERROR).json(e);
    }
}

/**
 * @param {*} req
 * @param {*} res
 */
export const deleteIt = async (req: Request, res: Response) => {
    const emptyId = req.params.emptyId;

    // Check first if it is a valid Id
    if (!emptyId || !mongoose.Types.ObjectId.isValid(emptyId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    await emptyService.deleteIt(emptyId);
    res.status(status.OK).json({ success: true });
}
