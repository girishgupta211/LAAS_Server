'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), Constants = require('../utils/constants.js');
var UserSchema = new Schema({
    name: {
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            default: ''
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: Constants.GENDERS
    },
    utype: {
        type: Number,
        required: true,
        enum: Constants.UTYPE
    },
    address: {
        addressCurr: {
            type: String
        },
        addressFinal: {
            type: String
        }
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
UserSchema.static("findUserIdType", function (userId) {
    if (userId.match('@')) {
        if (userId.split('@')[1].match('.')) {
            return { 'email': userId.toLowerCase() };
        }
    }
    else if (!isNaN(userId.slice(-10))) {
        return { 'phone': userId };
    }
    throw new Error('{"error" : "Invalid email address or phone number"}');
});
UserSchema.method("passwordComparer", function* (toCheckPassword) {
    return yield bcrypt.compare(toCheckPassword, this.password);
});
UserSchema.static("passwordChecker", function* (uId, password) {
    log.info('passwordChecker Logger - User ID : ', uId);
    let User = mongoose.model('User');
    let userQuery = User.findUserIdType(uId);
    log.info('User ID : ', userQuery);
    var userData = yield User.findOne(userQuery).exec();
    if (!userData) {
        return { "error": "User not found for ID : ", uId };
    }
    else {
        if (yield userData.passwordComparer(password)) {
            log.info('Password Matched : Access Granted');
            return { user: userData._id };
        }
        log.error('Incorrect Password!');
        return { "error": "Incorrect Password provided " };
    }
});
UserSchema.pre('save', function (done) {
    let user = this;
    if (!user.isModified('password')) {
        return done();
    }
    co.wrap(function* () {
        try {
            var saltUser = yield bcrypt.genSalt();
            var hashPassword = yield bcrypt.hash(this.password, saltUser);
            this.password = hashPassword;
            this.email = this.email.toLowerCase();
            Promise.resolve(true);
        }
        catch (error) {
            Promise.reject(error);
        }
    }).call(this).then(done, function (error) {
        done(error);
    });
});
mongoose.model('User', UserSchema);
