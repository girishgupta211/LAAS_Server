'use strict'
import mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), Constants = require('../utils/constants.js');

var UserSchema = new Schema(
  {
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
  },
  {
    toJSON: {
      transform: function(docM, retJ, option) { //docM : mongoose object(BSON), retJ : JSON object
        delete retJ.__v;
        if (retJ.created)
          retJ.created = new Date(retJ.created).getTime();
        if (retJ.modified)
          retJ.modified = new Date(retJ.modified).getTime();

        return retJ;
      }
    }
  }
);

UserSchema.static("findUserIdType", function(userId) {
  if (userId.match('@')) {//static methods are binded on the model not like methods
    if (userId.split('@')[1].match('.')) {//scans regex *@*.*
      return { 'email': userId.toLowerCase() };
    }
  }
  else if (!isNaN(userId.slice(-10))) {//checks for number with a character
    return { 'phone': userId };
  }
  throw new Error('{"error" : "Invalid email address or phone number"}')
});

UserSchema.method("passwordComparer", function* (toCheckPassword) {
  return yield bcrypt.compare(toCheckPassword, this.password);
  //this here represent the document returned by mongo in the password checker
  //function on this.find(query).exec();
});

UserSchema.static("passwordChecker", function* (uId, password) {
  log.info('passwordChecker Logger - User ID : ', uId);

  let User = mongoose.model('User');
  let userQuery = User.findUserIdType(uId);

  log.info('User ID : ', userQuery);

  var userData = yield User.findOne(userQuery).exec();

  if (!userData) {//if no user is registered with given ID
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

UserSchema.pre('save', function(done) {//done ~ next
  let user = this;//isModified is mongoose function to check wether the document have been edited or not
  //this refers to the document currently in process for updation, isModified @argument : <path>
  if (!user.isModified('password')) {
    return done();
  }
  /*using co wrap to use the generator function asynchronously as a promise intead
   of using nested callbacks of bcrypt for salting and hashing*/
  co.wrap(
    function* () {
      try {
        var saltUser = yield bcrypt.genSalt(); //args include rounds currently defaulted to 10
        var hashPassword = yield bcrypt.hash(this.password, saltUser); //hashing the function
        this.password = hashPassword;
        this.email = this.email.toLowerCase();
        Promise.resolve(true);
      }
      catch (error) {
        Promise.reject(error);
      }
    }
  ).call(this).then(done, function(error) {//call calls the co function which returns a promise
    done(error);
  });
});

mongoose.model('User', UserSchema);
