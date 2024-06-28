/**
 * NI article controller that handles article API enpoints.
 * @author dassiorleando
 * @since 1.5.0
 */
import * as status from 'http-status';
import { Request, Response } from 'express';
import * as articleService from '../services/article';
import mongoose from 'mongoose';

/**
 * A public action.
 * @param {*} req
 * @param {*} res
 */
export const publicFunc = async (req: Request, res: Response) => {
    res.status(status.OK).json({ success: true, message: articleService.aFunction(true) });
}

/**
 * A protected action.
 * @param {*} req
 * @param {*} res
 */
export const protectedFunc = async (req: Request, res: Response) => {
    res.status(status.OK).json({ success: true, message: articleService.aFunction(false) });
}


/**
 * @param {*} req
 * @param {*} res
 */
export const create = async (req: Request, res: Response) => {
    const articleCreated = await articleService.create(req.body);
    res.status(status.OK).json({ success: true, data: articleCreated });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const findOne = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    // Check first if it is a valid Id
    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    const articleFound = await articleService.findById(articleId);
    res.status(status.OK).json({ success: true, data: articleFound });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const findAll = async (req: Request, res: Response) => {
    const articlesFound = await articleService.findAll();
    res.status(status.OK).json({ success: true, data: articlesFound });
}

/**
 * @param {*} req
 * @param {*} res
 */
export const update = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    // Check first if it is a valid Id
    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    try {
        const articleUpdated = await articleService.update(articleId, req.body);
        res.status(status.OK).json({ success: true, data: articleUpdated });
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
    const articleId = req.params.articleId;

    // Check first if it is a valid Id
    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: 'Invalid id provided!'
        });
    }

    await articleService.deleteIt(articleId);
    res.status(status.OK).json({ success: true });
}
