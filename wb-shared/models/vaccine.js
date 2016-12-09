'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var VaccineSchema = new Schema(
  {
    Vaccine: {  type: String  },
    Age: { type: String },
    Days : { type : Number },
    Prevention: { type: String },
    Comments: {  type: String  }
  }

, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
VaccineSchema.static('defVaccineSchema', function () {
    return {
        Vaccine: null
        }
});
mongoose.model('Vaccine', VaccineSchema);
        
