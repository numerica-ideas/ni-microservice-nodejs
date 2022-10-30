/**
 * NI Empty model.
 * @author dassiorleando
 * @since 1.5.0
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const emptySchema = new Schema({
    title: String,
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

const Empty = mongoose.model('Empty', emptySchema);

export = Empty;
