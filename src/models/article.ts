/**
 * NI Article model.
 * @author dassiorleando
 * @since 1.5.0
 */
import { Schema, model, Document } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    description: string;
}

const articleSchema = new Schema<IArticle>({
    title: { type: String, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

export const ArticleModel = model<IArticle>('Article', articleSchema);
