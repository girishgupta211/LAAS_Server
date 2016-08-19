'use strict';
const mongodb = require('mongodb');
var self = exports;
var wbshared = require('wb-shared'), fs = require('co-fs'), imgutil = wbshared.utils.imgutil;
exports.initSecured = function (app) {
    app.get('/v1/image/user', getImage);
    app.get('/v1/image/user/:id', getImage);
    app.post('/v1/image/user', addImage);
    app.put('/v1/image/user', updateImage);
    app.delete('/v1/image/user', deleteImage);
};
exports.addImage = addImage;
exports.getImage = getImage;
function* getImage(next) {
    try {
        var user = this.passport.user;
        var id = this.params.id || user._id.toHexString();
        var type = this.query.type || 'thumbnail';
        var db = yield imgutil.getDB();
        let present = true;
        try {
            present = yield new Promise((resolve, reject) => {
                mongodb.GridStore.exist(db, `${id}/${type}`, (err, res) => {
                    if (err)
                        reject(err);
                    resolve(res);
                });
            });
        }
        catch (err) {
            this.log.info("image not found");
        }
        if (!present) {
            this.status = 404;
            this.body = '';
            yield next;
            return;
        }
        let image = yield new Promise((resolve, reject) => {
            mongodb.GridStore.read(db, `${id}/${type}`, (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
        this.status = 200;
        this.body = image;
        yield next;
    }
    catch (err) {
        this.log.error({ err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* addImage(next) {
    try {
        let files = this.request.body.files;
        if (files.profile) {
            let imgpath = files.profile.path;
            this.log.info('User: request: ', this.passport.user, this.request.body);
            let id = this.passport.user._id.toHexString();
            yield addUpdateImage('POST', imgpath, id, 'thumbnail', { w: wbshared.config.app.thumbnail, h: wbshared.config.app.thumbnail });
            this.body = yield addUpdateImage('POST', imgpath, id, 'profile');
            this.log.info('Successfully Saved profile', this.body);
            this.status = 201;
            yield next;
        }
    }
    catch (err) {
        this.log.error({ err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* addUpdateImage(op, currimg, id, type, reso) {
    if (op === 'PUT') {
        yield imgutil.deleteImage({ user: id, type: type });
    }
    var cimgbuf = yield fs.readFile(currimg);
    if (reso)
        cimgbuf = yield imgutil.resizeImg(cimgbuf, reso);
    return yield imgutil.saveToGrid(cimgbuf, `${id}/${type}`, { metadata: { user: id, type: type } });
}
function* updateImage(next) {
    try {
        let files = this.request.body.files;
        if (files.profile) {
            let imgpath = files.profile.path;
            let id = this.passport.user._id.toHexString();
            yield addUpdateImage('PUT', imgpath, id, 'thumbnail', { w: wbshared.config.app.thumbnail, h: wbshared.config.app.thumbnail });
            this.body = yield addUpdateImage('PUT', imgpath, id, 'profile');
            if (!this.passport.user.image.profile) {
                this.passport.user.image.profile = true;
                yield this.passport.user.save();
            }
            this.status = 201;
            yield next;
        }
    }
    catch (err) {
        this.log.error({ err: err });
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
}
function* deleteImage(next) {
    var id = this.passport.user._id.toHexString();
    this.passport.user.image.profile = false;
    yield this.passport.user.save();
    yield imgutil.deleteImage({ user: id, type: 'thumbnail' });
    this.body = yield imgutil.deleteImage({ user: id, type: 'profile' });
    this.status = 200;
    yield next;
}
