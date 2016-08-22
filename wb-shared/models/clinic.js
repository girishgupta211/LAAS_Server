'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var ClinicSchema = new Schema({
        
        "DoctorId": {
        "type": "number"
        },
        "Salutation": {
        "type": "string"
        },
        "FirstName": {
        "type": "string"
        },
        "MiddleName": {
        "type": "string"
        },
        "LastName": {
        "type": "string"
        },
        "ContactNumber": {
        "type": "string"
        },
        "AlternativeNumber": {
            "Email": {
                "type": "array"
            },
            "ContactNo": {
                "type":
                    "array"
            },
            "type":
                "object"
        },
        "EmailId":
        {
            "type": "string"
        },
        "Gender":
        {
            "type": "string"
        },
        "PracticeStartYear":
        {
            "type":
                "number"
        },
        "Specialization":
        {
            "type":
                "string"
        },
        "Website":
        {
            "type":
                "string"
        },
        "Description":
        {
            "type":
                "string"
        },
        "Publications":
        {
            "type":
                "array"
        },
        "DateOfBirth":
        {
            "type":
                "date"
        },
        "Awards":
        {
            "type":
                "array"
        },
        "ImagePath":
        {
            "type":
                "string"
        },
        "Treatment":
        {
            "type":
                "array"
        },
        "Language":
        {
            "type":
                "array"
        },
        "Education":
        {
            "type":
                "array"
        },
        "Experience":
        {
            "type":
                "array"
        },
        "Practice":
        {
            "type":
                "array"
        }
}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
ClinicSchema.static('defClinicSchema', function () {
    return {
        FirstName: null
        }
});
mongoose.model('Clinic', ClinicSchema);
        
