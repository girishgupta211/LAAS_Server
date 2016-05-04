'use strict';
const mongoose = require('mongoose');
let co = require('co'), wbshared = require('wb-shared'), log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), User = mongoose.model('User'), constants = wbshared.utils.constants, config = wbshared.config, koajwt = require('koa-jwt');
exports.initPub = function (app) {
    app.get('/verification/hello', printWashbay);
    app.post('/verification/signup', signUp);
    app.post('/verification/signin', signin);
};
exports.initSecured = function (app) {
    app.get('/verification/hellos', printWashbayS);
};
function* signin(next) {
    try {
        let signInBody = this.request.fields;
        log.info('Sign In request recieved');
        let userSearch = yield User.passwordChecker(signInBody.username, signInBody.password);
        if (userSearch.error) {
            throw new Error(userSearch.error);
        }
        else {
            this.response.set('Access-Control-Expose-Headers', 'authorization');
            this.response.set('authorization', koajwt.sign({ _id: userSearch.user }, config.systemConfig.app.privateKey));
            this.body = "SignIn Successfull";
            this.status = 200;
        }
    }
    catch (error) {
        log.error('Exception caught in signIn : ', error);
        this.body = "Error in processing SignIn Request";
        this.status = 404;
    }
}
function* signUp(next) {
    try {
        let signUpBody = this.request.fields;
        log.info('Sign Up request recieved ');
        if (signUpBody.dob) {
            signUpBody.dob = new Date(signUpBody.dob);
        }
        if (signUpBody.gender) {
            signUpBody.gender = signUpBody.gender.toUpperCase();
        }
        signUpBody.utype = constants.EUSER;
        let userSave = yield User(signUpBody).save();
        this.response.set('Access-Control-Expose-Headers', 'authorization');
        this.response.set('authorization', koajwt.sign({ _id: userSave._id }, config.systemConfig.app.privateKey));
        this.body = "SignUp Successfull";
        this.status = 200;
    }
    catch (error) {
        log.error('Exception caught in signUp : ', error);
        this.body = "Error in processing SignUp Request";
        this.status = 404;
    }
}
function* printWashbay(next) {
    try {
        log.debug("Inside Print Washbay");
        this.body = "Hello Washbay";
        this.status = 200;
    }
    catch (err) {
        this.body = "Error in processing Hello Washbay";
        this.status = 404;
        log.debug('Error : ', err);
    }
}
function* printWashbayS(next) {
    try {
        log.debug('Inside Secured Washbay Printer');
        this.body = "Secured Hello Washbay";
        this.status = 200;
    }
    catch (err) {
        this.body = "Error in processing Secure Hello Washbay";
        this.status = 404;
        log.debug('Error : ', err);
    }
}
