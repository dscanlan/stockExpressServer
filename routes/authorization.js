const passport = require('passport');
const authentication = require('../controllers/authorization');
const passportService = require('../services/passport');

//requireAuth middleware to check that the API is receiving a valid token.
const requireAuth = passport.authenticate('jwt', {session: false});

//requireSignIn is used for login screen
const requireSignIn = passport.authenticate('local', {session: false});

const authRoutes = (app) => {
    app.post('/signup', authentication.signUp);
    app.post('/signin', requireSignIn ,authentication.signIn);
};

module.exports = authRoutes;
