'use strict';
const fs = require('fs');
const mongoose = require('mongoose');
const logmaker = require('./utils/logger');
let inited = false;

exports.init = (config) => {
  if(inited)
    return;
  inited = true;
  exports.config = config;
  exports.initLogger(config);
  exports.initUtils();
  exports.initModels();
};

exports.initUtils = () => {
  exports.utils = {};
  var utilsPath = __dirname + '/utils';
  fs.readdirSync(utilsPath).forEach(function (file){
    if(file.indexOf('js') > 1){
      exports.utils[file.substring(0, file.length - 3)] = require(utilsPath + '/' + file);
    }
  });
};

exports.initLogger = (config) => {
  logmaker.init(config);
  exports.logger = logmaker.root;
};

/*
if same mongoose instance (@<the one declared above>)is used to
register the model (@<the one used inside** the require('@modelpath')>),
then the same mongoose instance can used to access them on
creating a connection pool (@<the one used in the initDatabase
for establishing the connection>).
**The mongoose inside the require would reference the same mongoose instance
  because of nodejs' property of single object multiple reference
*/
exports.initModels = () => {
  exports.models = {};
  var modelPath = __dirname + '/models';
  fs.readdirSync(modelPath).forEach(function (file){
    if(file.indexOf('js') > 1){
      logmaker.root.info('File path : ', file);
      exports.models[file.substring(0, file.length - 3)] = require(modelPath + '/' + file);
    }
  });
}

exports.initDatabase = function * () {
  var database = exports.database = {mongoose : null};
  var config = exports.config;
  var connectUrl = `mongodb://${config.systemConfig.mongo.host}:${config.systemConfig.mongo.port}/${config.systemConfig.mongo.dbname}`;
  var promise = new Promise(
    function(resolve, reject){
      mongoose.connection.on('disconnected',
        function(error){
          logmaker.root.error('Connection to mongodb failed');
          reject(error);
        }
      );
      mongoose.connection.on('connected',
        function(){
          logmaker.root.info('Connection to mongodb successfull');
          database.mongoose = mongoose;
          resolve(true);
        }
      );
    }
  );
  mongoose.connect(connectUrl);
  yield promise;
}
