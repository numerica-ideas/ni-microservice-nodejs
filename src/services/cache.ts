import * as Util from './util';
import { Constant } from '../config/constant';
const redisClient = require('../lib/redis')();

export const cacheEmpty = async (empty) => {
    if (!empty) return Promise.resolve(null);
    const emptyId = empty?._id;
    if (!emptyId) return Promise.reject('invalid empty data provided');
    const emptyData = JSON.parse(JSON.stringify(empty));
    await redisClient.hmsetAsync(Constant.EMPTY + ':' + emptyId, Util.objectToArray(emptyData));
    return Promise.resolve('empty data saved successfully');
}

export const readEmpty = async (emptyId) => {
    if (!emptyId) return Promise.resolve(null);
    const empty = await redisClient.hgetallAsync(Constant.EMPTY + ':' + emptyId);
    if (!empty) return Promise.resolve(null);

    // Parsed fields values
    Object.keys(empty).forEach(function (field) {
        try {
            empty[field] = JSON.parse(empty[field]);
        } catch (error) {}
    });

    return empty;
}

export const readEmptyField = async (emptyId, field) => {
    if (!emptyId || !field) return Promise.resolve('');
    return redisClient.hgetAsync(Constant.EMPTY + ':' + emptyId, field);
}

export const deleteEmpty = async (empty) => {
    // Object validation
    if (!empty || typeof empty !== 'object' || !empty._id) return Promise.reject('invalid empty provided!');

    empty = JSON.parse(JSON.stringify(empty));
    const emptyId = empty._id;
    
    // Deleting all empty fields
    const emptyFields = Object.keys(empty);
    
    // Deleting all empty fields
    deleteModelFields(emptyId, emptyFields);

    console.log(`empty of id ${emptyId} was deleted from cache.`);
}

/**
 * Deleting model fields.
 * @param {string} id the targeted model.
 * @param {string} fields the fields to delete.
 * @returns {void}
 */
function deleteModelFields(id, fields = [], model = Constant.EMPTY) {
    if (!id) return;
    fields.forEach(function (field) {
        redisClient.hdel(model + ':' + id, field);
    });
}
