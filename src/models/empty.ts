/**
 * NI Empty model.
 * @author dassiorleando
 * @since 1.5.0
 */
import { Schema, model, Document } from 'mongoose';

export interface IEmpty extends Document {
    title: string;
    description: string;
}

const emptySchema = new Schema<IEmpty>({
    title: { type: String, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

export const EmptyModel = model<IEmpty>('Empty', emptySchema);
