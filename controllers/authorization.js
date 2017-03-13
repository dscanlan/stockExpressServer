//authentication api controller for public login and sign up. 

const jwt = require('jwt-simple'), //jwt for token generation
config = require('../config'), //app config file for the secret.
User = require('../models/users'); //users model to interact with mongodb

//token generator 
function tokenForUser(user){
    const timeStamp = new Date().getTime();
    //jwt creates token with the user._id and the config.secret.
    return jwt.encode({sub: user._id, iat: timeStamp}, config.secret);
}

//as routes are using middleware they will receieve the authenticated user document in REQ.
const usersController = {
    signIn: (req, res) => {
        if(!req.user){ //req.user is null.
            return res.status(422).send('incorrect username and password')
        }
        //user is signed in. send them a token to store.
        res.send({token: tokenForUser(req.user)});
    },
    //endpoint used for registration.
    signUp: (req, res) => {
        //get variables from the body.
        const email = req.body.email;
        const password = req.body.password;

        //check that we have values for both
        if(!email || !password){
            //return error if not.
            return res.status(422).send('Please provide a username and password');
        }

        //check that we do not already have this user.
        User.findOne({email}, (err, user) => {
            //error handler. something has gone wrong reading from DB.
            if(err){
                return next(err);
            }

            //user already exists. return error
            if(user){
                return res.status(422).send('Username is already in use');
            }

            //create a new user.
            const newUser = new User ({
                email,
                password
            });
            //must call save from the user model.
            newUser.save((err) =>{
                //handler error
                if(err){
                    return next(err);
                }
                //everything ok. send token.
                res.json({token: tokenForUser(newUser)});
            });
        })
    }
}

module.exports = usersController;
