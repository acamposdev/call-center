module.exports = function() {
    
    var express = require('express');
    var passport = require('passport');
    var router = express.Router();
      
    // Controllers for routes
    const sessionController = require('../controllers/session.controller');
    const loginController = require('../controllers/login.controller');

    // Habilitamos las peticiones desde otros dominios
    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Login Routes: login, logout and home (dashboard)
    router.get('/', loginController.login);
    router.get('/dashboard', sessionController.auth, loginController.home);
    router.get('/logout', sessionController.destroy);
    router.post('/login', passport.authenticate('local', { 
            successRedirect: '/dashboard',
            failureRedirect: '/',
            failureFlash: true
        })
    );
    
    

    // Devolvemos la referencia al enrutador
    return router;
};
    