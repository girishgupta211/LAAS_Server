'use strict';
const mongoose = require('mongoose');
let wbshared = require('wb-shared'), jwt = require('koa-jwt'), config = wbshared.config, util = wbshared.utils.util, l = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), logmeta = { module: __filename.substring(__dirname.length + 1, __filename.length - 3) }, User = mongoose.model('User') , fs = require('fs'), csv = require('csv-parser'), _authFile = require('../controller/_auth.js'), Response = mongoose.model('Response');
var sendgrid = require('sendgrid')('medosto', "root1234");
exports.initSecured = function (app) {
    app.get("/v1/user", getUser);
    app.put("/v1/user", updateUser);
    app.put("/v1/user/verify/:otp", verifyEmail);
    app.put("/v1/delete", deleteUser);
    app.post("/v1/signout", signout);
};
exports.initPub = function (app) {
    app.post("/v1/password/forgot", forgotPassword);
    app.post("/v1/reset/:token", resetPass);
    app.get("/v1/:name/verify/:token", verifyUser);
};
function* getUser(next) {
    let user = this.passport.user;
    this.log.info("getting User Details: ", user);
    try {
        this.status = 200;
        this.body = user;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in getting User Detail: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* verifyUser(next) {
    try {
        let name = this.params.name;
        let token = this.params.token;
        let decryptToken = jwt.verify(token, config.app.privateKey, { 'algorithms': ['HS256'] });
        let user = yield User.findOne({ email: decryptToken.email }).exec();
        let tokenNew = jwt.sign({ email: user.email }, config.app.privateKey, { 'algorithms': ['HS256'], 'expiresIn': '1h' });
        this.response.set('Access-Control-Expose-Headers', 'authorization');
        this.response.set('authorization', jwt.sign({ _id: user._id, sTime: Date.now() }, config.app.privateKey));
        this.cookies.set('survey', this.response.authorization);
        this.body = { "url": "", "msg": "Hi " + user.name.first + ",\n\nYour account has been verified" };
        this.status = 200;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in verifying User Detail: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* deleteUser(next) {
    let user = this.passport.user;
    try {
        yield User.findOneAndUpdate({ _id: user._id }, { "isEnabled": false }).exec();
        this.status = 200;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in deleting User: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* updateUser(next) {
    let user = this.passport.user;
    this.log.info("update  user ", user);
    try {
        let userDesc = this.request.body.fields;
        if (userDesc.dob)
            userDesc.dob = new Date(userDesc.dob);
        if (userDesc.gender)
            userDesc.gender = userDesc.gender.toUpperCase();
        if (userDesc.email) {
            userDesc.email = userDesc.email.toLowerCase();
            userDesc["otp"] = guid().substring(0, 6);
            var emailBody = {
                "to": userDesc.email,
                "from": "nitin.jha@geminisolutions.in",
                "subject": "OTP for email verification",
                "text": userDesc["otp"]
            };
            util.sendEmailAsync(emailBody);
            userDesc["emailVerified"] = false;
        }
        if (userDesc.password) {
            let bcrypt = wbshared.lib.bcrypt_thunk;
            var salt = yield bcrypt.genSalt();
            var hash = yield bcrypt.hash(userDesc.password, salt);
            userDesc.password = hash;
            if (userDesc.created) {
                delete userDesc["created"];
            }
            userDesc["modified"] = Date.now();
            this.body = yield User.findOneAndUpdate({ _id: user._id }, userDesc, { new: true }).exec();
            this.status = 200;
            yield next;
        }
    }
    catch (err) {
        this.log.info(logmeta, 'Error in updating User: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}

function* verifyEmail(next) {
    let user = this.passport.user;
    let otp = this.params.otp;
    try {
        let res = yield User.findOne({ email: user.email }).exec();
        this.status = 200;
        if (res.otp == otp) {
            this.body = "User Successfully verified";
        }
        else {
            this.body = "User Verification failed";
        }
    }
    catch (err) {
        this.log.info(logmeta, 'Error in verifying User: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* forgotPassword(next) {
    var token;
    let forgotDesc = this.request.body.fields;
    let email = forgotDesc.email;
    if (email) {
        email = email.toLowerCase();
        try {
            let user = yield User.findOne({ email: email }).exec();
            if (user) {
                token = jwt.sign({ email: user.email }, config.app.privateKey, { 'algorithms': ['HS256'], 'expiresIn': '1h' });
                l.info(token);
            }
            var emailJson = {
                to: email,
                from: 'passwordreset@geminisurvey.com',
                subject: 'Gemini Survey Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    "http://" + this.request.header.host + '/' + user.name.first + '/password/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            var semail = new sendgrid.Email(emailJson);
            sendgrid.send(semail, function (err, json) {
                if (err) {
                    return console.error(err);
                }
                console.log(json);
            });
        }
        catch (err) {
            this.log.info("error in sending mail");
        }
    }
}
function* resetPass(next) {
    let token = this.params.token;
    let userDesc = this.request.body.fields;
    try {
        let uid = yield jwt.verify(token, config.app.privateKey, { 'algorithms': ['HS256'] });
        if (userDesc.password) {
            let bcrypt = wbshared.lib.bcrypt_thunk;
            var salt = yield bcrypt.genSalt();
            var hash = yield bcrypt.hash(userDesc.password, salt);
            userDesc["password"] = hash;
            userDesc["modified"] = new Date();
        }
        let user = yield User.findOneAndUpdate({ email: uid.email }, { password: userDesc.password, modified: userDesc.modified });
        this.redirect('/');
    }
    catch (err) {
        this.log.info(logmeta, 'Error in resetting password: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* signout(next) {
    try {
        let user = this.passport.user;
        let token = (this.request.header.authorization).toString().split('bearer ')[1];
        let authFull = yield jwt.verify(token, config.app.privateKey, { 'algorithms': ['HS256'] });
        let userSurveys = yield Form.find({ userId: authFull._id }).exec();
        for (let index = 0; index < userSurveys.length; index++) {
            yield Response.remove({ surId: userSurveys[index]._id, preview: 1, created: this.passport.sTime }).exec();
        }
        this.response.set('Access-Control-Expose-Headers', 'authorization');
        this.response.set('authorization', null);
        this.cookies.set('survey', this.response.authorization);
        this.status = 200;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in user sign out: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4();
}
