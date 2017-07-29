'use strict';

var bunyan = require('bunyan');

var logger = module.exports = {};
logger.init = (config) => { /**  init method to initiate the creation of logger */
  logger.root = bunyan.createLogger(
    {
      name: 'root',
      serializers: { /**  serializer converts App Objects passed to it to  readable json format eg :
                           logger.info(object, 'This is a log ref for object');
                        */
        err: bunyan.stdSerializers.err,
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
      },
      streams: [
        {
          level: config.systemConfig.log.level,
          stream: process.stdout   //type is defaulted to 'stream'
        },
        {
          level: config.systemConfig.log.level,  // this is the level of error logs
          path: config.systemConfig.log.path,  //path of log file where logs are going to be written to
          // type is defaulted to 'file'
          type: 'rotating-file',  //this is responsible for creating back copies of log files overwriting default
          period: '1d',  //this is the period of rotation for creating back copies
          count: 3,  //this is the number of back copies to be made
        }
      ],
      src: true
    }
  );
}

/**
Constructor API for reference
var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: <string>,                     // Required
    level: <level name or number>,      // Optional, see "Levels" section
    stream: <node.js stream>,           // Optional, see "Streams" section
    streams: [<bunyan streams>, ...],   // Optional, see "Streams" section
    serializers: <serializers mapping>, // Optional, see "Serializers" section
    src: <boolean>,                     // Optional, see "src" section

    // Any other fields are added to all log records as is.
    foo: 'bar',
    ...
}); */
