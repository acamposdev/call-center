const logger = require('../config/logger');

// Middleware que comprueba que haya session
exports.loginRequired = function(req, res, next) {

    if (req.isAuthenticated()) {
      req.user.password = '';
      req.session.user = req.user;
    }

    logger.log('debug', '(SesssionController) Comprobando autenticacion para el usuario ');

    if (req.session.user) {
        logger.log('debug', '(SesssionController) Autenticacion para el usuario ' + req.session.user.username + ' (' + req.session.user.id + ') OK');
        next();
    } else {
        logger.log('debug', '(SesssionController) Autenticacion para el usuario FAIL');
        res.redirect('/');
    }
};

// GET '/' muestra la pantalla de login
exports.login = function(req, res) {
  if (req.session.user) {
    logger.log('debug', '(SesssionController) Mostrando Home al usuario ');
    res.redirect('/home');
  } else {
    logger.log('debug', '(SesssionController) Mostrando login');
    res.render('login', {
        errors: {},
        message: ''
      }
    );
  }
};

// GET '/home' muestra la home
exports.home = function(req, res) {
  res.render('home', {
      errors: {}
    }
  );
};

// DELETE /logout   -- Destruir sesion
exports.destroy = function(req, res) {
    logger.log('debug', '(SesssionController) Logout para el usuario ');
    req.logout();
    delete req.session.user;
    res.redirect('/'); // redirect a path anterior a login
};
