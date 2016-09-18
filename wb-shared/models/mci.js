'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var MciSchema = new Schema({
    "Regis_no": {
    "type": "string"
    },
    "Name": {
    "type": "string"
    },
    "Qual": {
    "type": "string"
    },
    "DOB": {
    "type": "string"
    },
    "lbl_Info": {
    "type": "string"
    },
    "FatherName": {
    "type": "string"
    },
    "QualYear": {
    "type": "string"
    },
    "Address": {
    "type": "string"
    },
    "Date_Reg": {
     "type": "string"
    },
    "Univ":
    {
    "type": "string"
    },
    "Lbl_Council":   {  "type": "string"  }
}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
MciSchema.static('defMciSchema', function () {
    return {
        Mci_Name: null
        }
});
mongoose.model('Mci', MciSchema);
        
