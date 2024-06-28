import * as Util from './util';
import { Constant } from '../config/constant';
const redisClient = require('../lib/redis')();

export const cacheArticle = async (article) => {
    if (!article) return Promise.resolve(null);
    const articleId = article?._id;
    if (!articleId) return Promise.reject('invalid article data provided');
    const articleData = JSON.parse(JSON.stringify(article));
    await redisClient.hmsetAsync(Constant.ARTICLE + ':' + articleId, Util.objectToArray(articleData));
    return Promise.resolve('article data saved successfully');
}

export const readArticle = async (articleId) => {
    if (!articleId) return Promise.resolve(null);
    const article = await redisClient.hgetallAsync(Constant.ARTICLE + ':' + articleId);
    if (!article) return Promise.resolve(null);

    // Parsed fields values
    Object.keys(article).forEach(function (field) {
        try {
            article[field] = JSON.parse(article[field]);
        } catch (error) {}
    });

    return article;
}

export const readArticleField = async (articleId, field) => {
    if (!articleId || !field) return Promise.resolve('');
    return redisClient.hgetAsync(Constant.ARTICLE + ':' + articleId, field);
}

export const deleteArticle = async (article) => {
    // Object validation
    if (!article || typeof article !== 'object' || !article._id) return Promise.reject('invalid article provided!');

    article = JSON.parse(JSON.stringify(article));
    const articleId = article._id;
    
    // Deleting all article fields
    const articleFields = Object.keys(article);
    
    // Deleting all article fields
    deleteModelFields(articleId, articleFields);

    console.log(`Article of id ${articleId} was deleted from cache.`);
}

/**
 * Deleting model fields.
 * @param {string} id the targeted model.
 * @param {string} fields the fields to delete.
 * @returns {void}
 */
function deleteModelFields(id, fields = [], model = Constant.ARTICLE) {
    if (!id) return;
    fields.forEach(function (field) {
        redisClient.hdel(model + ':' + id, field);
    });
}
