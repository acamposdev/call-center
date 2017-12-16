var logger = require('../config/logger');

/**
 * [function description]
 * @param  {Object} io [description]
 * @return {Object}    [description]
 */
module.exports = function(io) {

  /**
   * [on description]
   * @param  {Object} 'connection'    [description]
   * @param  {Object} function(socket [description]
   * @return {Object}                 [description]
   */
  io.on('connection', function(socket){
    logger.log('debug', '(socket.controller) Usuario conectado!');

    /**
     * [on description]
     * @param  {Object} 'disconnect' [description]
     * @param  {Object} function(    [description]
     * @return {Object}              [description]
     */
    socket.on('disconnect', function() {
      /** TODO implementar desconexion */
    });
  });
}
