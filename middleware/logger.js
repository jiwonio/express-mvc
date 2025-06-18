// middleware/logger.js
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const morgan = require('morgan');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
    ),
    transports: [
        // console logging (for PM2)
        new winston.transports.Console(),

        // normal log setting
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            filename: '%DATE%.log',
            maxFiles: '14d',      // 14 days
            zippedArchive: true   // older files are compressed
        }),

        // error log setting
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            filename: '%DATE%.error.log',
            maxFiles: '14d',
            zippedArchive: true
        })
    ]
});

// morgan ip token
morgan.token('real-ip', (req) => {
    return req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress;
});

// morgan session token
morgan.token('user-id', (req) => {
    return req.session?.user_id || '-';
});

const morganMiddleware = morgan(':real-ip [:user-id] :method :url :status :response-time ms', {
    stream: { write: message => logger.info(message.trim()) }
});

module.exports = { logger, morganMiddleware };