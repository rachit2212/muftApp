const winston = require('winston')
	, path = require('path')
	, config = require('./../configs/config')
	;

require('winston-daily-rotate-file');

const rotateTransport = new (winston.transports.DailyRotateFile)({
	filename: path.resolve('logs/muft.log')
	, datePattern: 'YYYY-MM-DD'
	, format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.simple()
	)
	, prepend: true
	, maxFiles: config.LOGGING.LOG_DAYS || '7d'
});

const consoleTransport = new (winston.transports.Console)({
	colorize: true
	, format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.colorize(),
		winston.format.simple()
	)
});

const transports = [];

if (process.env.NODE_ENV !== 'production') {
	transports.push(consoleTransport);
}
transports.push(rotateTransport);

var logger = winston.createLogger({
	level: (config.LOGGING && config.LOGGING.LEVEL) || 'error'
	, transports: transports
});

module.exports = logger;