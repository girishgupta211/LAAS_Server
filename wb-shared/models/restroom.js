'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var restroomSchema = new Schema({
        name : {type: String},
        address : {
            address : {type: String},
            city : { type: String},
            state : {type: String},
            pincode : {type : String},
            geoLoc : [type: Number],
        },
        startTime : {type: Date} ,
        endTime : {type: Date}
        facilities :[ { type: String } ],
        mFacilty : {type: Boolean} ,
        fFacilty : {type: Boolean} ,
        daFacilty : {type: Boolean} ,
        managedBy : {type: Schema.Type.ObjectId},
        createdBy : {type: String},
        createdDate : {type: Date , default : Date.Now},
        modifiedBy : {type: String},
        modifiedDate : {type: Date , default ; Date.Now}

}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
restroomSchema.static('defRestroomSchema', function () {
    return {
        name : null
        }
});
mongoose.model('restroom', restroomSchema);
