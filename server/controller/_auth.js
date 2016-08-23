'use strict';
var mongoose = require('mongoose');
let wbshared = require('wb-shared'), kjwt = require('koa-jwt'), config = wbshared.config, User = mongoose.model('User'), util = wbshared.utils.util, constants = wbshared.utils.constants, jwt = require('koa-jwt'), l = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), logmeta = { module: __filename.substring(__dirname.length + 1, __filename.length - 3) };
var imgfile = require('../controller/img');
let co = require('co'), request = require('co-request') ; //, request2 = require('request');
var fs = require('fs'), Response = mongoose.model('Response');
var json2csv = require('json2csv'), excelbuilder = require('msexcel-builder');
var fs = require('fs');
var PythonShell = require('python-shell');
var officegen = require('officegen');
var path = require('path');
var pptx = officegen('pptx');
var pdf = require('html-pdf');
exports.initPub = function (app) {
    app.get("/v1/pin/:id", getPin);
    app.put("/v1/pin", verifyPin);
    app.post("/v1/user", signup);
    app.post("/v1/signin", signin);
    app.post("/v1/signin/mqtt", msignin);
};
exports.initSecured = function (app) {
    app.get("/v1/auth", auth);
};
function* auth(next) {
    this.log.debug("get auth ", this.passport.user);
    this.response.status = 200;
    this.response.body = this.passport.user;
    yield next;
}
let validType = new RegExp(/^(signup|signin|password|phone)$/);
function* getPin(next) {
    let id = this.params.id;
    let type = this.query.type;
    try {
        if (!type || !validType.test(type))
            this.throw("{ 'err' : 'Pin generation type incorrect/unspecified' }", 400);
        let token = util.pickInt(9999);
        token = util.pad(token, 4);
        if (type === 'signup') {
            let user = yield User.findOne(User.findUserQuery(id)).exec();
            if (user) {
                this.status = 400;
                this.body = { err: "Phone number is already registered." };
                return yield next;
            }
        }
        let res;
        res = yield Signup.findOneAndUpdate({ _id: id }, { token: token }, { upsert: true }).exec();
        this.log.debug("updated db ", res);
        if (util.isPhone(id)) {
            try {
                res = yield util.sendSms(id, token, type);
                this.log.debug("send sms res ", res.statusCode, res.body);
            }
            catch (err) {
                this.log.error(logmeta, "Error in sms sending: ", err);
                this.status = err.status || 500;
                this.body = { err: "Operation unavailable. Retry after some time." };
                this.app.emit('error', err, this);
                return yield next;
            }
        }
        this.status = 200;
        this.response.body = res;
        yield next;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in signing in: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* verifyPin(next) {
    try {
        let id = this.query.id;
        let resp = yield wbshared.utils.util.verifyPin(this.query.id, this.query.pin);
        this.status = resp ? 200 : 403;
        this.body = '';
        yield next;
    }
    catch (err) {
        this.log.info(logmeta, 'Error in signing in: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* msignin(next) {
    let body = this.request.body.fields;
    body.username = body.username.toLowerCase();
    this.log.info("mqtt signin ", body);
    let match = false;
    let uid = yield kjwt.verify(body.password, config.app.privateKey, { 'algorithms': ['HS256'] });
    let user = yield User.findById(uid._id).exec();
    match = user.phone === body.username || user.email === body.username;
    if (match) {
        this.status = 200;
        this.body = '';
    }
    else {
        this.status = 401;
        this.body = { 'err': 'Invalid token' };
    }
    yield next;
}
var requestPipToFile = function (url, filepath) {
    return new Promise(function (resolve, reject) {
        try {
            var stream = fs.createWriteStream(filepath);
            stream.on('finish', function () {
                return resolve(true);
            });
          //  return request2(url).pipe(stream);
        }
        catch (e) {
            return reject(e);
        }
    });
};
function picDownloadUrl(id, type) {
    let url;
    if (type === 'fb') {
        url = config.app.fbImageUrl;
        return url.replace('id', id);
    }
    else {
        url = config.app.googImageUrl;
        return url.replace('id', id)
            .replace('{key}', config.app.googApiKey);
    }
}
function* fbImage(id) {
    var imgpath = config.app.uploadDir + "/DSIMG_User_" + id;
    let url = picDownloadUrl(id, 'fb');
    var fbRes = yield request({ url: url, method: 'GET' });
    if (fbRes.statusCode < 299) {
        var fbData = JSON.parse(fbRes.body);
        l.info("fbImage data \n", fbData);
        if (!fbData.data.is_silhouette) {
            var value = (yield requestPipToFile(fbData.data.url, imgpath));
            return imgpath;
        }
    }
    return;
}
function* gImage(id) {
    let url = picDownloadUrl(id, 'goog');
    var googRes = yield request({ url: url, method: 'GET' });
    if (googRes.statusCode < 299) {
        var googBody = JSON.parse(googRes.body);
        l.info("googleImage data \n", googBody);
        if (!googBody.image.isDefault) {
            var imgpath = config.app.uploadDir + "/DSIMG_User_" + id;
            var value = (yield requestPipToFile(googBody.image.url, imgpath));
            return imgpath;
        }
    }
    return;
}
function* signin(next) {
    let user;
    try {
        this.log.info("Auth key and login details", this.request.body, logmeta);
        let body = this.request.body.fields;
        if (body.userId)
            body.userId = body.userId.toLowerCase();
        let res;
        if (body.userId && (body.fbid || body.googid)) {
            let resp = yield wbshared.utils.util.verifyPin(body.userId, body.password);
            if (!resp) {
                res = { err: "OTP invalid", user: {} };
            }
            let updt = body.fbid ? { fbid: body.fbid } : { googid: body.googid };
            let user = yield User.findOneAndUpdate({ phone: body.userId }, updt).exec();
            res = user ? { user: user } : { err: "user not found" };
            if (user) {
                this.passport = {};
                this.passport.user = user;
                yield imgfile.getImage.call(this, function* next() { });
                if (this.response.status > 299) {
                    let imgpath;
                    if (body.fbid)
                        imgpath = yield fbImage(body.fbid);
                    else
                        imgpath = yield gImage(body.googid);
                    if (imgpath) {
                        this.request.body.files = { profile: { path: imgpath } };
                        yield imgfile.addImage.call(this, function* next() { });
                    }
                }
            }
            if (!user && body.signup) {
                body.signup.phone = body.userId;
                this.query.pin = body.password;
                body.signup.password = wbshared.utils.util.pad(wbshared.utils.util.pickInt(9999), 4);
                if (body.googid)
                    body.signup.googid = body.googid;
                if (body.fbid)
                    body.signup.fbid = body.fbid;
                this.request.body.fields = body.signup;
                yield signup.call(this, function* next() { });
                if (this.response.status < 299) {
                    let imgpath;
                    res = { user: this.response.body };
                    this.passport = {};
                    this.passport.user = res.user;
                    if (body.fbid) {
                        imgpath = yield fbImage(body.fbid);
                    }
                    else if (body.googid) {
                        imgpath = yield gImage(body.googid);
                    }
                    if (imgpath) {
                        this.request.body.files = { profile: { path: imgpath } };
                        yield imgfile.addImage.call(this, function* next() { });
                    }
                }
                else {
                    res = { err: this.response.body };
                }
            }
        }
        else {
            let key, userid = body.userId;
            if (body.fbid) {
                key = 'fbid';
                userid = body.fbid;
            }
            else if (body.googid) {
                key = 'googid';
                userid = body.googid;
            }
            res = yield User.passwordMatches(userid, body.password, key);
        }
        if (!res.user) {
            this.status = 402;
            this.body = { err: "user not found" };
        }
        else if (res.err) {
            this.status = 401;
            this.body = { err: "Pins dont match" };
        }
        else {
            this.response.set('Access-Control-Expose-Headers', 'authorization');
            this.response.set('authorization', jwt.sign({ _id: res.user.id, sTime: Date.now() }, config.app.privateKey));
            this.cookies.set('survey', this.response.authorization, { signed: true });
            this.status = 200;
            this.body = res.user;
        }
    }
    catch (err) {
        this.log.info(logmeta, 'Error in signing in: ', { err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
    return yield next;
}
exports.signup = signup;
function* signup(next) {
    try {
        let userDesc = this.request.body.fields;
        this.log.info(logmeta, 'Sign up Request ', userDesc);
        if (userDesc.dob)
            userDesc.dob = new Date(userDesc.dob);
        if (userDesc.gender)
            userDesc.gender = userDesc.gender.toUpperCase();
        userDesc.roles = ['member'];
        let first = userDesc.name.first;
        let last = userDesc.name.last;
        let createdUser = yield new User(userDesc).save();
        try {
            userDesc["VerifyURL"] = "http://" + this.request.header.host + '/' + first + '/verify/' + jwt.sign({ email:
            createdUser.email, sTime: Date.now() }, config.systemConfig.app.privateKey);
            var emailBody = {
                "to": userDesc["email"],
                //"from": wbshared.config.email.account,
                "from":  "info@quickloo.com", 
                "subject": "QuickLoo Email verification",
                "text": userDesc["VerifyURL"]
            };
            util.sendEmailAsync(emailBody);
        }
        catch (err) {
            this.log.error(logmeta, 'Error in otp processing: ', { err: err });
        }
        this.status = 201;
        this.body = createdUser;
    }
    catch (err) {
        this.log.error(logmeta, 'Error: ', { err: err });
        this.status = err.status || 500;
        this.body = { err: err.message };
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
function* signout(next) {
    try {
        let user = this.passport.user;
        this.log.info(logmeta, "sign out request from user", user);
        if (userstate.type === 'D' && userstate.ride.length &&
            userstate.ride[0].dstate <= constants.DSTATE.started) {
            this.state = 401;
            this.response.body = { err: 'Driver cannot signout in middle of ride.' };
            return yield next;
        }
        this.status = 200;
        this.response.body = '';
    }
    catch (err) {
        this.log.error(logmeta, 'Error in signing out: ', { err: err });
        this.status = err.status || 500;
        this.body = { err: err.message };
        this.app.emit('error', err, this);
    }
}
