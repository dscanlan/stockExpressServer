const passport = require('passport'),
User = require('../models/users'),
config=require('../config'),
//token based Strategy
JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt,
//login strategy
LocalStrategy = require('passport-local');

//local option is looking for usernameField.
const localOptions = {
    usernameField: 'email'
}

//strategy used by login.
const localLogin = new LocalStrategy(localOptions, (email, password, done) =>{
    //get the user document form the email.
    User.findOne({email}, (err, user) =>{
        //handle error and return with done.
        if(err){
            return done(err);
        }
        //if user is not found send null error and false for user document.
        if(!user){
            return done (null, false);
        }
        //compare the user document password with what has been sent to service.
        user.comparePassword(password, (err, isMatch) => {
            //handle error and return
            if(err){
                return done(err);
            }
            //if does not match
            if(!isMatch){
                return done (null, false);
            }

            //everything is ok.
            done(null, user);
        });
    })
});

//token options.
const jwtOptions = {
    //get the token from the header of request.
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    //set the secret from config.
    secretOrKey: config.secret
}

//strategy used by token
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) =>{
    //payload.sub is deveried from the token and passed back
    User.findById(payload.sub, (err, user) => {
        //hand error and return
        if(err){
            return done(err);
        }
        //user does not exist.
        if(!user){
            return done (null, false);
        }

        //everything ok.
        done(null, user);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);