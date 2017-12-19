const logger = require('../config/logger');

/**
 * @class SessionController
 * Controller para manejar las peticiones relacionadas con el login, autenticacion, logout y home de la aplicacion
 */
function SessionController() {

  /**
   * Middleware que comprueba que haya session
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  function auth(req, res, next) {
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
        res.status(403);
        res.render('index', {
            error: req.flash('loginMessage')
        });
    }
  }

  /**
   * DELETE /logout   -- Destruir sesion
   * @param {*} req 
   * @param {*} res 
   */
  function destroy(req, res) {
    logger.log('debug', '(SesssionController) Logout para el usuario ');
    req.logout();
    delete req.session.user;
    res.redirect('/'); // redirect a path anterior a login
  };

  return {
    auth,
    destroy
  }
}

module.exports = new SessionController();