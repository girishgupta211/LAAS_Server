'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var DoctorSchema = new Schema({

        "id": {
        "type": "number"
        },
        "name": {
        "type": "string"
        },
        "gender": {
        "type": "string"
        },
        "practicing_start_year": {
        "type": "number"
        },
        "experience_years": {
        "type": "number"
        },
        "new_slug": {
            "type": "string"
        },
        "summary": {
            "type": "string"
        },
        "published": {
            "type": "boolean"
        },
        "is_ready": {
            "type":
                "boolean"
        },
        "user":
        {
            "id":
            {
                "type":
                    "number"
            },
            "account_id":
            {
                "type":
                    "null"
            },
            "type":
                "object"
        },
        "awards":
        {
            "type":
                "array"
        },
        "memberships":
        {
            "type":
                "array"
        },
        "organizations":
        {
            "type":
                "array"
        },
        "photos":
        {
            "type":
                "array"
        },
        "qualifications":
        {
            "type":
                "array"
        },
        "registrations":
        {
            "type":
                "array"
        },
        "services":
        {
            "type":
                "array"
        },
        "specializations":
        {
            "type":
                "array"
        },
        "verification":
        {
            "id":
            {
                "type":
                    "number"
            },
            "verification_status":
            {
                "type":
                    "string"
            },
            "created_at":
            {
                "type":
                    "date"
            },
            "modified_at":
            {
                "type":
                    "date"
            },
            "type":
                "object"
        },
        "relations":
        {
            "type":
                "array"
        },
        "form_of_medicines":
        {
            "form_of_medicines":
            {
                "type":
                    "array"
            },
            "labels":
            {
                "doctor_label":
                {
                    "type":
                        "null"
                },
                "speciality_label":
                {
                    "type":
                        "null"
                },
                "type":
                    "object"
            },
            "type":
                "object"
        },
        "recommendation":
        {
            "recommendation":
            {
                "type":
                    "number"
            },
            "response_count":
            {
                "type":
                    "number"
            },
            "recommendation_percent":
            {
                "type":
                    "number"
            },
            "type":
                "object"
        },
        "review_count":
        {
            "type":
                "number"
        },
        "specializations_to_show_beneath_name":
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
DoctorSchema.static('defDoctorSchema', function () {
    return {
        Doctor_Name: null
        }
});
mongoose.model('Doctor', DoctorSchema);
        
