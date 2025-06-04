// middleware/authentication.js
// TODO: check login
const { logger } = require("./logger");

const authentication = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    // public path
    const public_paths = [
        '/login',
        '/api/auth/login',
        '/api/auth/logout',
        '/stylesheets/',
        '/fonts/',
        '/images/',
        '/javascripts/'
    ];

    // url
    const urlWithoutQuery = req.path.split('?')[0];

    // already login
    if (urlWithoutQuery === '/login' && req.session && req.session.user_id) {
        return res.redirect(`/`);
    }

    // pass
    if (public_paths.some(path => urlWithoutQuery.startsWith(path))) {
        return next();
    }

    // check session
    if (!req.session || !req.session.user_id) {
        logger.warn('No authentication information.');

        // response text
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({
                success: false,
                message: 'No authentication information.'
            });
        }

        // redirect
        return res.redirect(`/login?error=empty_user`);
    }

    next();
};

module.exports = { authentication };