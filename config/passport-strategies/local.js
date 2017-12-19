
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

module.exports = function() {
    

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        /** TODO: Implementar deserializacion de BBDD */
        cb(null, {
            id: 1,
            username: 'admin'
        });
    });

    // Configure the local strategy for use by Passport.
    //
    // The local strategy require a `verify` function which receives the credentials
    // (`username` and `password`) submitted by the user.  The function must verify
    // that the password is correct and then invoke `cb` with a user object, which
    // will be set at `req.user` in route handlers after authentication.
    passport.use(new Strategy({
            passReqToCallback : true
        },
        function(req, username, password, cb) {
            var user;

            /** TODO Implementar logado contra BBDD */
            if (username === 'admin' && password === 'admin') {
                user = {
                    id: 1,
                    username: 'admin'
                    // No seteamos la password para que no sea accesible nunca desde la vista 
                }
                return cb(null, user);
            } else {
                err = {
                    msg: 'Invalid user or password.'
                }
                return cb(null, false, req.flash('loginMessage', err.msg));
            }
        }
    ));

}