'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');

var KidSchema = new Schema(
{
    "Name": {
        "type": "string"
    },
    "DOB": {
        "type": "string"
    },
    "BithTime": {
        "type": "string"
    },
    "Gastation": {
        "type": "string"
    },
    "ModeOfDelivery": {
        "type": "string"
    },
    "MotherHeight": {
        "type": "string"
    },
    "FatherHeight":
    {
        "type": "string"
    },
    "MPH":
    {
        "type":
            "string"
    },
    "Gender":
    {
        "type":
            "string"
    },
    "BirthWeight":
    {
        "type":
            "string"
    },
    "BirthLength":
    {
        "type":
            "string"
    },
    "HeadCircumference":
    {
        "type":
            "string"
    },
    "FatherMob":
    {
        "type":
            "string"
    },
    "MotherMob":
    {
        "type":
            "string"
    },
    "FatherEmail":
    {
        "type":
            "string"
    },
    "MotherEmail":
    {
        "type":
            "string"
    },
    "RegistrationNo":
    {
        "type":
            "string"
    },
    "PhotosPath":
    {
        "type":
            "string"
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
        Name: null
        }
});
mongoose.model('Kid', KidSchema);
        
