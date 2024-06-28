/**
 * Empty service.
 * @author dassiorleando
 */

import { Config } from "../config";
import { EmptyModel } from "../models";
import * as cacheService from './cache';

/**
 * A function (show case).
 * @param {boolean} isPublic To know if the route is public or not (optinal).
 * @returns {string} Just a simple message for now.
 */
export const aFunction = function (isPublic = false) {
	return isPublic ? `Public route on '${Config.ENV}'.` : 'Protected route';
}

export const create = async (data) => {
    if (!data) return Promise.reject('Invalid empty!');

    const empty = new EmptyModel(data);
    await empty.save();

    await cacheService.cacheEmpty(empty); // Update cache once the DB change is done
    return empty;
}

export const findById = async (emptyId) => {
    const cachedEmpty = await cacheService.readEmpty(emptyId);
    if (!cachedEmpty) {
        await new Promise(resolve => setTimeout(resolve, 3500));    // Wait for 5 seconds to show cache miss event
        
        console.log(`Cache miss for findById on empty#${emptyId}`);
        const emptyFound = await EmptyModel.findById(emptyId);

        console.log('Data loaded from the DB and cached');
        await cacheService.cacheEmpty(emptyFound); // Update cache once the DB change is done

        return emptyFound;
    }
    console.log(`Cache hit for findById on empty#${emptyId}`);
    return cachedEmpty;
}

export const findAll = async () => {
    return EmptyModel.find();
}

export const update = async (emptyId, data) => {
    if (!data) return;
    delete data._id;

    await EmptyModel.findByIdAndUpdate(emptyId, data);
    const emptyFound = await EmptyModel.findById(emptyId);
    await cacheService.cacheEmpty(emptyFound); // Update cache once the DB change is done

    return emptyFound;
}

export const deleteIt = async (emptyId) => {
    const emptyFound = await EmptyModel.findById(emptyId);
    if (emptyFound) {
        await emptyFound.remove();
        console.log('empty deleted from DB');
        cacheService.deleteEmpty(emptyFound); // Delete cache once the DB change is done
    }
}
