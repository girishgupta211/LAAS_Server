'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var ScheduleSchema = new Schema(
{
    KidId : { type : Schema.Types.ObjectId,  ref: 'Kid' },
    DueDate: { type: Date },
    GivenDate: { type: Date },
    IsActual: { type: Boolean }, // Used to keep saperate from other reminder dates 
    Status: { type: String, default : "pending"  }, // Status can be like this is done, pending
    Message: { type: String  }, // to Generated Dynamically
    Created : { type: Date,  default: Date.now  }
}
, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
ScheduleSchema.static('defScheduleSchema', function () {
    return {
        Name: null
        }
});
mongoose.model('Schedule', ScheduleSchema);
        
