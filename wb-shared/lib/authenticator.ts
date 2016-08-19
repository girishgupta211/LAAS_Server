/// <reference path="../../geminisurvey.d.ts"/>

'use strict';
import mongoose = require('mongoose');
import ds = require("geminisurvey");

let util = require('util'),
  co = require('co'),
  l = require('../utils/logger').root.child({ module: __filename.substring(__dirname.length + 1, __filename.length - 3) });

exports.localUser = function(userId, password, done) {
  var User = <ds.MUserM>mongoose.model('User');
  l.info("auth %s, %s", userId, password);

  co(function* () {
    try {
      return yield User.passwordMatches(userId, password);
    } catch (ex) {
      return null;
    }
  }).then(function(user) {
    done(null, user);
  });
};
