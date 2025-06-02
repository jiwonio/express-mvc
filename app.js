const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const helmet = require("helmet");
const cors = require('cors');
const { morganMiddleware: morgan, logger } = require("./modules/logger");
const { rateLimit } = require('express-rate-limit');
const { slowDown } = require('express-slow-down');
const fs = require('fs');
const speedLimiter = slowDown({ windowMs: 15 * 60 * 1000, delayAfter: 50, delayMs: () => 2000 });
const rateLimiter = rateLimit({ windowMs: 15 * 60 * 1000 /* 15 minutes */, limit: 100 });
require('dotenv').config();

const app = express();

// 1. Security
app.use(helmet());
app.use(cors());

// 2. Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 3. Session
app.use(session({
    store: new FileStore({
        retries: 0,
        ttl: 12 * 60 * 60, // 12 hours
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000 * 12, // 12 hours
    }
}));

// TODO: Passport
// app.use(passport.initialize());
// app.use(passport.session());

// 4. Logger
app.use(morgan);

// 5. Limiter
app.use(speedLimiter);
app.use(rateLimiter);

// 6. Static
app.use(express.static(path.join(__dirname, 'view')));

// 7. Controller
const controllerPath = path.join(__dirname, 'controller');
fs.readdirSync(controllerPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const route = file === 'index.js' ? '/' : `/${path.basename(file, '.js')}`;
        app.use(route, require(path.join(controllerPath, file)));
    });

// TODO: -. https or nginx
//       -. transaction
//       -. passport
//       -. cache

// 8. 404 Error
app.use((req, res, next) => {
    logger.error(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: '404 Not Found'
    });
});

// 9. Error
app.use((err, req, res, next) => {
    logger.error(err?.stack);
    res.status(err?.statusCode || 500).json({
        success: false,
        message: err?.message || 'Internal Server Error'
    });
});

module.exports = app;
