/**
 * NI Empty model.
 * @author dassiorleando
 * @since 1.5.0
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emptySchema = new Schema({
    title: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
});

emptySchema.pre('save', function (next) {
    var currentDate = new Date();
  
    // Edit the updatedAt field to the current date
    if (!this.keepUpdatedDate) this.updatedAt = currentDate;

    // if createdAt doesn't exist, add to that field
    if (!this.createdAt) this.createdAt = currentDate;

    next();
});

var Empty = mongoose.model('Empty', emptySchema);

module.exports = Empty;
