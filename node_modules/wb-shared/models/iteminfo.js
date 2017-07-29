'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var ItemSchema = new Schema({
    iName: {
        type: String,
        default: null
    },
    clothType: {
        type: Number,
        enum: constants.CLOTHTYPE
    },
    wcost: {
        classic: {
            type: Number,
            default: 5
        },
        super: {
            type: Number,
            default: 10
        },
        ultra: {
            type: Number,
            default: 15
        }
    },
    icost: {
        type: Number,
        default: 3
    },
    dcost: {
        type: Number,
        default: 20
    },
    bulkFactor: {
        type: Number,
        default: 10
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            if (retJ.created)
                retJ.created = new Date(retJ.created).getTime();
            if (retJ.modified)
                retJ.modified = new Date(retJ.modified).getTime();
            return retJ;
        }
    }
});
ItemSchema.static('defItemSchema', function () {
    return {
        iName: null,
        clothType: null,
        cost: {
            classic: null,
            super: null,
            ultra: null
        }
    };
});
mongoose.model('Item', ItemSchema);
