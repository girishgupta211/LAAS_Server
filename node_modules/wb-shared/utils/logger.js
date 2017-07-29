'use strict';
var bunyan = require('bunyan');
var logger = module.exports = {};
logger.init = (config) => {
    logger.root = bunyan.createLogger({
        name: 'root',
        serializers: {
            err: bunyan.stdSerializers.err,
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res
        },
        streams: [
            {
                level: config.systemConfig.log.level,
                stream: process.stdout //type is defaulted to 'stream'
            },
            {
                level: config.systemConfig.log.level,
                path: config.systemConfig.log.path,
                // type is defaulted to 'file'
                type: 'rotating-file',
                period: '1d',
                count: 3,
            }
        ],
        src: true
    });
};
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
