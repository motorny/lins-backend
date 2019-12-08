const {createLogger, format, transports} = require('winston');

let level = 'info';

if (process.env.NODE_ENV !== 'production') {
    level = 'debug';
}

const formatter = format.combine(
    //format.label({ label: '[my-label]' }),
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),

    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);


const logger = createLogger({
    level: level,
    defaultMeta: {service: 'user-service'},
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                formatter
            ),
        }),
        new transports.File({filename: 'lins-backend.err', level: 'error', format: formatter})
    ],
    exitOnError: false,
});


// stream for morgan (requests) logging
logger.stream = {
    write: function (message, encoding) {
        logger.info(message.trim());
    },
};

export default logger;