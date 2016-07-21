'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var ratingSchema = new Schema({
        restroomId : {type: ObjectId},
        userId : {type: ObjectId},
        cleanliness : {type: Number ,  enum : [1,2,3,4,5]},
        privacy : {type: Number ,  enum : [1,2,3,4,5]},
        review : {type: String},
        date : {type: Date , default: Date.Now}
}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});

ratingSchema.static('defRatingSchema', function () {
    return {
        review : null
        }
});
mongoose.model('rating', ratingSchema);
