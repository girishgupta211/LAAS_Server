'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var CallthedoctorSchema = new Schema({
        "details": {
        "id": {
        "type": "number"
        },
        "status": {
        "type": "number"
        },
        "fname": {
        "type": "string"
        },
        "lname": {
        "type": "string"
        },
        "email": {
        "type": "string"
        },
        "email2": {
            "type":
                "string"
        },
        "phone":
        {
            "type":
                "string"
        },
        "mobile":
        {
            "type":
                "string"
        },
        "city":
        {
            "type":
                "number"
        },
        "lat":
        {
            "type":
                "string"
        },
        "lng":
        {
            "type":
                "string"
        },
        "experience":
        {
            "type":
                "string"
        },
        "consultant_fee":
        {
            "type":
                "number"
        },
        "logo":
        {
            "type":
                "string"
        },
        "tags":
        {
            "type":
                "null"
        },
        "locality":
        {
            "type":
                "string"
        },
        "address":
        {
            "type":
                "string"
        },
        "country":
        {
            "type":
                "string"
        },
        "postel":
        {
            "type":
                "string"
        },
        "dob":
        {
            "type":
                "string"
        },
        "anniversary":
        {
            "type":
                "string"
        },
        "blood_group":
        {
            "type":
                "string"
        },
        "sex":
        {
            "type":
                "string"
        },
        "distance":
        {
            "type":
                "date"
        },
        "qualification":
        {
            "type":
                "string"
        },
        "cityname":
        {
            "type":
                "string"
        },
        "image":
        {
            "type":
                "string"
        },
        "sno":
        {
            "type":
                "null"
        },
        "type":
            "object"
        },
            "timing":
            {
                "type":
                    "array"
            },
            "speciality":
            {
                "type":
                    "array"
            },
            "awards":
            {
                "type":
                    "object"
            },
            "qualification":
            {
                "type":
                    "array"
            },
            "experience":
            {
                "type":
                    "object"
            }

}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
CallthedoctorSchema.static('defCallthedoctorSchema', function () {
    return {
        fname: null
        }
});
mongoose.model('Callthedoctor', CallthedoctorSchema);
