'use strict';
const fs = require('fs');
const mongoose = require('mongoose');
let cors = require('koa-cors'), 
    compress = require('koa-compress'), 
    router = require('koa-router'), 
    wbshared = require('wb-shared'), 
    logger = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    parse = require('koa-better-body'), 
    config = wbshared.config, 
    koajwt = require('koa-jwt'), 
    User = mongoose.model('User'), 
    constants = wbshared.utils.constants;
    
module.exports = function (app) {
    app.use(cors({
        maxAge: 3600,
        credentials: true,
        headers: 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE'
    }));
    app.use(function* (next) {
        this.req.connection.setTimeout(0);
        this.req.connection.setNoDelay(true);
        yield next;
    });
    app.use(compress());
    let pubRouter = router();
    let secRouter = router();
    let adminRouter = router();
    fs.readdirSync('./server/controller').forEach(function (file) {
        if (!file.endsWith('.js'))
            return;
        let controller = require('../controller/' + file);
        if (controller.initAdmin)
            controller.initAdmin(adminRouter);
        if (controller.initPub)
            controller.initPub(pubRouter);
        if (controller.initSecured)
            controller.initSecured(secRouter);
    });
    app.use(parse({
        multipart: true,
        formidable: {
            uploadDir: config.appConfig.app.uploads
        }
    }));
    app.use(function* (next) {
        this.log = logger;
        logger.debug('Request : ', this.request);
        try {
            yield next;
        }
        catch (err) {
            logger.error('Error : ', err);
            this.status = err.status || 500;
            this.body = { err: err.message };
            this.app.emit('error', err, this);
        }
    });
    app.use(pubRouter.routes());
    app.use(function* (next) {
        if (pubRouter.match(this.path, this.method).pathAndMethod.length) {
            return;
        }
        yield next;
    });
    app.use(koajwt({ secret: config.systemConfig.app.privateKey, key: "wbuser" }));
    app.use(function* (next) {
        let wbuser = yield User.findById(this.state.wbuser._id).exec();
        this.document = {};
        this.document.wbuser = wbuser;
        yield next;
    });
    app.use(function* (next) {
        logger.debug({ request: this.request, body: this.request.body });
        yield next;
        logger.debug({ response: this.response, body: this.response.body });
    });
    app.use(secRouter.routes());
    app.use(function* (next) {
        if (secRouter.match(this.path, this.method).pathAndMethod.length) {
            return;
        }
        yield next;
    });
    app.use(function* (next) {
        if (this.document.wbuser.utype == constants.AUSER) {
            yield next;
        }
        else {
            return;
        }
    });
    app.use(adminRouter.routes());
    app.use(function* (next) {
        if (adminRouter.match(this.path, this.method).pathAndMethod.length) {
            return;
        }
    });
};
