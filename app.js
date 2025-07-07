const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const helmet = require("helmet");
const cors = require('cors');
const { accessLogger } = require("./middleware/accessLogger");
const {logger} = require("./modules/logger");
const routerLoader = require("./middleware/routerLoader");
const { rateLimit } = require('express-rate-limit');
const { slowDown } = require('express-slow-down');
const compression = require("compression");
const responseHandler = require("./middleware/responseHandler");
const speedLimiter = slowDown({ windowMs: 15 * 60 * 1000, delayAfter: 50, delayMs: () => 2000 });
const rateLimiter = rateLimit({ windowMs: 15 * 60 * 1000 /* 15 minutes */, limit: 100 });
require('dotenv').config();

const app = express();

// 0. Compression
app.use(compression());

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
// TODO: or custom auth
// app.use(authentication);
// app.use(authorization);

// 4. Logger
app.use(accessLogger);

// 5. Limiter
app.use(speedLimiter);
app.use(rateLimiter);

// 6. Response Handler
app.use(responseHandler());

// 7. Static
app.use(express.static(path.join(__dirname, 'view')));

// 8. Controller
routerLoader(path.join(__dirname, 'controller'))(app);

// TODO: - https: nginx
//       - passport
//       - cache

// 9. 404 Error
app.use((req, res, next) => {
    logger.error(`404 Not Found: ${req.originalUrl}`);
    res.error('404 Not Found', 404);
});

// 10. Error
app.use((err, req, res, next) => {
    logger.error(err?.stack);
    res.error(err?.message || 'Internal Server Error', err?.statusCode || 500);
});

module.exports = app;
