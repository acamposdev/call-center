const logger = require('../config/logger');


/**
 * @class LoginController
 * Controller for login request. Contiene el  enrutamiento al login y a la home
 */
function LoginController() {

    /**
     * GET / Method for show login page
     * @param {*} req 
     * @param {*} res 
     */
    function login(req, res) {
        logger.log('debug', '(LoginController) login ');
        res.render('index', {
            error: req.flash('loginMessage')
        });
    }

    /**
     * GET /dashboard Method for show home page after login 
     * @param {*} req 
     * @param {*} res 
     */
    function home(req, res) {
        logger.log('debug', '(LoginController) dashboard ');
        res.render('dashboard');
    }

    return {
        login,
        home
    }
}

module.exports = new LoginController();