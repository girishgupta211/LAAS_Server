'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var KidSchema = new Schema(
{
    registrationNo:
    {
        "type": "string"
    },
    name : {
        "type": "string"
    },
    dob: {
        "type": Date
    },
    bithTime: { "type": "string" },
    gastation: { "type": "string" },
    modeOfDelivery: { "type": "string" },
    motherHeight: { "type": "string"   },
    motherMob :   { "type": "string"   },
    motherEmail:  {  "type": "string"  }, 
    fatherHeight: {  "type": "string"  },
    fatherMob :   {    "type": "string"    },
    fatherEmail:  {    "type": "string"   },
    mph: { "type":  "string"  },
    gender:   { "type": "string"  },
    birthWeight: 
    {    "type": "string"
    },
    birthLength:
    {
        "type": "string"
    },
    headCircumference:
    {
        "type": "string"
    },
    image:
    {
          type: Schema.Types.Mixed,
          default: {}
    } 
}
, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
KidSchema.static('defKidSchema', function () {
    return {
        name: null
        }
});
mongoose.model('Kid', KidSchema);
        
