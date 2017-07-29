'use strict';
const mongoose = require('mongoose');
//let  bcrypt = require('..').lib.bcrypt_thunk, wbshared = require('..'), l = require('../utils/logger').root.child({
let  bcrypt = require('../lib/bcrypt_thunk'), wbshared = require('..'), l = require('../utils/logger').root.child({
    'module': __filename.substring(__dirname.length + 1, __filename.length - 3)
}), Constants = require('../utils/constants'), createModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin, Schema = mongoose.Schema, co = require('co'), request = require('co-request');
var UserSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            default: ''
        }
    },
    org: {
        name: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        sector: {
            type: String,
            default: ''
        },
        add: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: ''
        }
    },
    gender: {
        type: String,
        required: false,
        enum: Constants.GENDERS
    },
    dob: {
        type: Date
    },
    superUsr: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    usrRole: {
        type: String,
        default: 'noAgent',
        enum: ['Agent', 'noAgent']
    },
    fbid: {
        type: String,
        unique: true,
        sparse: true
    },
    googid: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Schema.Types.Mixed,
        default: {}
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        required: false
    },
    otp: {
        type: String,
        required: false
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    agentState: {
        type: Number,
        default: 1
    },
    rating: {
        type: Number,
        default: 5.0
    },
    roles: {
        type: Array,
        default: ['member']
    },
    type: {
        type: Number,
        default: 0
    },
    cemail: {
        type: String,
        default: "EMAIL"
    },
    cfName: {
        type: String,
        default: "FIRST NAME"
    },
    clName: {
        type: String,
        default: "LAST NAME"
    },
    custNames: {
        custom1: {
            type: String,
            default: "CUSTOM 1"
        },
        custom2: {
            type: String,
            default: "CUSTOM 2"
        },
        custom3: {
            type: String,
            default: "CUSTOM 3"
        },
        custom4: {
            type: String,
            default: "CUSTOM 4"
        },
        custom5: {
            type: String,
            default: "CUSTOM 5"
        },
        custom6: {
            type: String,
            default: "CUSTOM 6"
        }
    }
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            if (ret.modified)
                ret.modified = new Date(ret.modified).getTime();
            if (ret.created)
                ret.created = new Date(ret.created).getTime();
            delete ret.__v;
            delete ret.password;
        }
    }
});

UserSchema.pre('save', function (done) {
    if (!this.isModified('password')) {
        return done();
    }
    co.wrap(function* () {
        try {
            var salt = yield bcrypt.genSalt();
            var hash = yield bcrypt.hash(this.password, salt);
            this.password = hash;
            this.email = this.email.toLowerCase();
            Promise.resolve(true);
        }
        catch (err) {
            Promise.reject(err);
        }
    }).call(this).then(done, function (err) {
        done(err);
    });
});

UserSchema.plugin(createModifiedPlugin);
UserSchema.method("comparePassword", function* (candidatePassword) {
    return yield bcrypt.compare(candidatePassword, this.password);
});
UserSchema.static("findUserQuery", function findUserQuery(userId) {
    if (userId.match('@')) {
        return {
            'email': userId.toLowerCase()
        };
    }
    else if (+userId.slice(-10)) {
        return {
            'phone': userId
        };
    }
    throw new Error('{ "err" : "Please enter a valid email" }');
});
function fbVerifyUrl(appconfig, input_token) {
    let appid = appconfig.fbapp;
    let appkey = appconfig.fbappkey;
    let appverify = appconfig.fbappverify;
    return appverify.replace('{input_token}', input_token)
        .replace('{app_id}', appid)
        .replace('{appkey}', appkey);
}
function googVerifyUrl(appconfig, input_token) {
    let appid = appconfig.googapp;
    let appkey = appconfig.googappkey;
    let appverify = appconfig.googappverify;
    return appverify.replace('{input_token}', input_token)
        .replace('{app_id}', appid)
        .replace('{appkey}', appkey);
}
UserSchema.static("passwordMatches", function* (userId, password, key) {
    l.info('userId is: ', userId);
    let UserM = mongoose.model('User');
    let query;
    if (!key)
        query = UserM.findUserQuery(userId);
    else {
        query = {};
        query[key] = userId;
    }
    let user = yield this.findOne(query).exec();
    if (!user)
        return {
            "err": "User not found",
            user: null
        };
    if (key) {
        if (key === 'fbid') {
            let appverify = fbVerifyUrl(wbshared.config.app, password);
            let res = yield request({
                url: appverify
            });
            l.info("fb verify ", appverify, res.statusCode, res.body);
            if (res.statusCode < 299)
                return {
                    user: user
                };
        }
        else if (key === 'googid') {
            let appverify = googVerifyUrl(wbshared.config.app, password);
            let res = yield request({
                url: appverify
            });
            l.info("goog verify ", appverify, res.statusCode, res.body);
            if (res.statusCode < 299 && res.body.aud === wbshared.config.app.googid)
                return {
                    user: user
                };
        }
    }
    else {
        if (yield user.comparePassword(password)) {
            l.info("password matches");
            return {
                user: user
            };
        }
    }
    l.error("passwords dont match");
    return {
        "err": "Password does not match",
        user: user
    };
});
var seedData = [{
        name: {
            first: 'admin',
            last: 'admin'
        },
        gender: Constants.MALE,
        dob: 0,
        email:  'girishgargdce@gmail.com' ,//wbshared.config.app.su,
        password:  '1123',// wbshared.config.app.pass,
        phone: '+910000000000',
        address: "admin address"
    }];
UserSchema.static("seedData", seedData);
mongoose.model('User', UserSchema);
