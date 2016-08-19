'use strict';
var mongodb = require('mongodb');
var util = require('util'), wbshared = require('..'), sizeOf = require('image-size'), gm = require('gm'), l = require('./logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), utils = require('../utils/util');
var logmeta = {};
exports.getDB = getDB;
exports.cropImgCmd = cropImgCmd;
exports.resizeImg = resizeImg;
exports.cropImage = cropImage;
exports.saveToGrid = saveToGrid;
exports.remFromGrid = remFromGrid;
exports.deleteImage = deleteImage;
exports.deleteAllFiles = deleteAllFiles;
function* cropImage(imgpath, tosize) {
    var imgsize = yield new Promise((resolve, reject) => {
        gm(imgpath).size((err, val) => {
            if (err)
                reject(err);
            resolve(val);
        });
    });
    var cropcmd = cropImgCmd({ w: imgsize.width, h: imgsize.height }, tosize);
    return yield new Promise((resolve, reject) => {
        gm(imgpath)
            .crop(cropcmd.w, cropcmd.h, cropcmd.x, cropcmd.y)
            .toBuffer((err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
function* resizeImg(imgpath, tosize) {
    var dimensions = sizeOf(imgpath);
    l.info('Image original size, width: %d, height: %d', dimensions.width, dimensions.height, logmeta);
    var frameAspectR = dimensions.width / dimensions.height;
    var desiredAspectR = tosize.w / tosize.h;
    l.info('Frame Aspect: %d, Desired Aspect: %d', frameAspectR, desiredAspectR, logmeta);
    if (frameAspectR < desiredAspectR) {
        l.info('Width: %d, Height: %d', desiredAspectR * tosize.h, tosize.h, logmeta);
        return yield new Promise((resolve, reject) => {
            gm(imgpath)
                .geometry(tosize.h, tosize.h, '^', '>')
                .gravity('Center')
                .toBuffer((err, res) => {
                var dim = sizeOf(res);
                l.info('Resulting Dimensions: W: %d, H: %d', dim.width, dim.height, logmeta);
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    else {
        l.info('Width: %d, Height: %d', tosize.w, tosize.w / desiredAspectR, logmeta);
        return yield new Promise((resolve, reject) => {
            gm(imgpath)
                .geometry(tosize.w, tosize.w, '^', '>')
                .gravity('Center')
                .toBuffer((err, res) => {
                var dim = sizeOf(res);
                l.info('Resulting Dimensions: W: %d, H: %d', dim.width, dim.height, logmeta);
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
}
function* deleteImage(metadata) {
    var db = yield getDB();
    l.info('delete image');
    var files = db.collection(`${mongodb.GridStore.DEFAULT_ROOT_COLLECTION}.files`);
    var docs = yield new Promise((resolve, reject) => {
        files.find({ metadata: metadata }).toArray((err, docs) => {
            if (err)
                reject(err);
            resolve(docs);
        });
    });
    yield docs.map(val => remFromGrid(val._id));
}
function* deleteAllFiles() {
    var db = yield getDB();
    l.info('Delete all files from grid store...');
    var coll = db.collection(`${mongodb.GridStore.DEFAULT_ROOT_COLLECTION}.files`);
    var files = yield new Promise((resolve, reject) => {
        coll.find({}).toArray((err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
    yield files.map(file => remFromGrid(file._id));
}
function* remFromGrid(filename) {
    var db = yield getDB();
    l.info('removing from grid %s', filename, logmeta);
    try {
        yield new Promise((resolve, reject) => {
            mongodb.GridStore.unlink(db, filename, (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    catch (err) {
        l.error("err in removing %s, %j", filename, err, logmeta);
    }
}
function* saveToGrid(frmFile, filename, opts) {
    var db = yield getDB();
    var objId = new mongodb.ObjectID();
    l.info('Details of save to grid params', objId, filename, opts);
    var gfile = new mongodb.GridStore(db, objId, filename, 'w', opts);
    return yield new Promise((r, j) => {
        gfile.open((e, gs) => {
            if (e) {
                l.debug('open error', e);
                j(e);
            }
            gs.write(frmFile, (e, gs) => {
                if (e) {
                    l.error('Write Error ', e);
                    j(e);
                }
                gs.close((e, res) => {
                    if (e) {
                        l.debug('Save error:', e);
                        j(e);
                    }
                    l.debug('Save status', res);
                    r(res);
                });
            });
        });
    });
}
var db;
function* getDB() {
    if (db)
        return Promise.resolve(db);
    let dburl = utils.makeMongoUrl(wbshared.config.mongo.host, wbshared.config.mongo.dbname);
    return yield new Promise((r, j) => {
        mongodb.MongoClient.connect(dburl, (err, res) => {
            if (err)
                j(err);
            db = res;
            initGridStore(db)
                .then(() => { r(db); })
                .catch((err) => {
                l.error('err while creating gridstore file unique index', logmeta);
                r(db);
            });
        });
    });
}
function initGridStore(db) {
    var gs = new mongodb.GridStore(db, null, 'w');
    var filesc = gs.collection();
    return new Promise((resolve, reject) => {
        filesc.createIndex({ filename: 1 }, { unique: true }, (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
function cropImgCmd(fsize, tsize) {
    var toaspect = tsize.h / tsize.w;
    var w, h;
    w = fsize.w > tsize.w ? tsize.w : fsize.w;
    h = toaspect * w;
    if (h > fsize.h) {
        h = fsize.h;
        w = h / toaspect;
    }
    var x = fsize.w / 2 - w / 2, y = fsize.h / 2 - h / 2;
    let rval = { w: w, h: h, x: x, y: y };
    l.info("CrOPPPPPPPPPPPING ", fsize, tsize, rval);
    return rval;
}
