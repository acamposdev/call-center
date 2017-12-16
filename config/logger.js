var winston = require('winston');
var moment = require('moment');
var config = require('../config/config');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: config.app.logger.file.level,
            filename: './logs/' + METADATA.name + '.log',
            handleExceptions: true,
            json: false,
            maxsize: 1242880, //5MB
            maxFiles: 5,
            colorize: true,
            timestamp: function() {
                return Date.now();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '] ['+ options.level.toUpperCase() + '] '+ (options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            }
        }),
        new winston.transports.Console({
            level: config.app.logger.console.level,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(JSON.stringify(message));
    }
};
