'use strict';
const mongoose = require('mongoose');
let util = require('util'), co = require('co'), l = require('../utils/logger').root.child({ module: __filename.substring(__dirname.length + 1, __filename.length - 3) });
exports.localUser = function (userId, password, done) {
    var User = mongoose.model('User');
    l.info("auth %s, %s", userId, password);
    co(function* () {
        try {
            return yield User.passwordMatches(userId, password);
        }
        catch (ex) {
            return null;
        }
    }).then(function (user) {
        done(null, user);
    });
};
