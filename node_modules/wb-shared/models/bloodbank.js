'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var BloodbankSchema = new Schema({

        "id": {
        "type": "number"
        },
        "state": {
        "type": "string"
        },
        "city": {
        "type": "string"
        },
        "district": {
        "type": "string"
        },
        "h_name": {
        "type": "string"
        },
        "address": {
        "type": "string"
        },
        "pincode": {
            "type": "number"
        },
        "contact": {
            "type": "string"
        },
        "helpline": {
            "type":
                "string"
        },
        "fax":
        {
            "type":
                "string"
        },
        "category":
        {
            "type":
                "string"
        },
        "website":
        {
            "type":
                "string"
        },
        "email":
        {
            "type":
                "string"
        },
        "blood_component":
        {
            "type":
                "string"
        },
        "blood_group":
        {
            "type":
                "string"
        },
        "service_time":
        {
            "type":
                "string"
        },
        "latitude":
        {
            "type":
                "string"
        },
        "longitude":
        {
            "type":
                "string"
        }

}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
BloodbankSchema.static('defBloodbankSchema', function () {
    return {
        Bloodbank_Name: null
        }
});
mongoose.model('Bloodbank', BloodbankSchema);
        
