/**
 * NI Empty model.
 * @author dassiorleando
 * @since 1.5.0
 */
import { Schema, model, Document } from 'mongoose';

export interface IEmpty extends Document {
    title: string;
    descriptdion: string;
    createdAt: Date;
    updatedAt: Date;
}

const emptySchema = new Schema<IEmpty>({
    title: { type: String, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date
});

emptySchema.pre('save', function (next) {
    const currentDate = new Date();

    // Edit the updatedAt field to the current date
    if (!this['keepUpdatedDate']) this['updatedAt'] = currentDate;

    // if createdAt doesn't exist, add to that field
    if (!this['createdAt']) this['createdAt'] = currentDate;

    next();
});

export const Empty = model<IEmpty>('Empty', emptySchema);
