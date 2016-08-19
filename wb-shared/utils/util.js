'use strict';
var sendgrid = require('sendgrid')('QuickLoo', "root1234");
let l = require('./logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) });
let querystring = require('querystring'), request = require('co-request'), wbshared = require('..'), co = require('co');
exports.makeMongoUrl = makeMongoUrl;
exports.sendEmailAsync = sendEmailAsync;
function makeMongoUrl(dbhost, db, user, password) {
    let url = 'mongodb://';
    if (user && password)
        url += user + ':' + encodeURIComponent(password) + '@';
    url += `${dbhost}:27017/${db}?authSource=admin`;
    return url;
}
function sendEmailAsync(emailInfo) {
    sendgrid.send(emailInfo, function (err, json) {
        if (err) {
            return console.error(err);
        }
        console.log(json);
    });
}
