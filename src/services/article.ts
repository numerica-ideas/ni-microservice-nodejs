/**
 * Article service.
 * @author dassiorleando
 */

import { Config } from "../config";
import { ArticleModel } from "../models";
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
    if (!data) return Promise.reject('Invalid article!');

    const article = new ArticleModel(data);
    await article.save();

    await cacheService.cacheArticle(article); // Update cache once the DB change is done
    return article;
}

export const findById = async (articleId) => {
    const cachedArticle = await cacheService.readArticle(articleId);
    if (!cachedArticle) {
        await new Promise(resolve => setTimeout(resolve, 3500));    // Wait for 5 seconds to show cache miss event
        
        console.log(`Cache miss for findById on article#${articleId}`);
        const articleFound = await ArticleModel.findById(articleId);

        console.log('Data loaded from the DB and cached');
        await cacheService.cacheArticle(articleFound); // Update cache once the DB change is done

        return articleFound;
    }
    console.log(`Cache hit for findById on article#${articleId}`);
    return cachedArticle;
}

export const findAll = async () => {
    return ArticleModel.find();
}

export const update = async (articleId, data) => {
    if (!data) return;
    delete data._id;

    await ArticleModel.findByIdAndUpdate(articleId, data);
    const articleFound = await ArticleModel.findById(articleId);
    await cacheService.cacheArticle(articleFound); // Update cache once the DB change is done

    return articleFound;
}

export const deleteIt = async (articleId) => {
    const articleFound = await ArticleModel.findById(articleId);
    if (articleFound) {
        await articleFound.remove();
        console.log('article deleted from DB');
        cacheService.deleteArticle(articleFound); // Delete cache once the DB change is done
    }
}
