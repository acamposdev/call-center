var _ = require('underscore');
var prettyjson = require('prettyjson');
const log = require('single-line-log').stdout;
const chance = require('chance').Chance();
const moment = require('moment');
const constants = require('../../config/constants');
let models = require('../../model/status');


callCenter = {
    agents: [],
    statistics: {
        by: {
            status: {

            },
            calls: {
                accepted: 0,
                rejected: 0
            }
        }
    },
    alerts: []
}

/**
 * @class Engine
 * Motor de eventos orientado al contexto de un Call Center. 
 * El motor simula el trafico de un call center y puede ser configurado en número de Agentes, ademas emite el estado del call center por sockets utilizando socket.io
 * El simulador se ejecuta recursivamente hasta que se pare el servidor web. Puede tambien ser ejecuado en formato stand alone.
 * 
 *
 * @param {JSON} options Opciones de configuracion del motor
 * @param {Number} options.agent Numero de agentes
 * @param {Boolean} options.logger Boulean para definir si el motor mostrara por consola el estado del call center
 * @param {socket.io} socket Se le pasa el socket por el que se notificaran los cambios al los clintes web conectados
 */
function Engine(options, socket) {
    var io = socket || null;
    var agentsNumber = options.agents || 10; // 10 por defecto
    var logger = options.logger || false; // false por defecto
    this.lastDaySendData = new Date().getDate();

    /**
     * Inicializa el estado del call center, numero de agentes e informacion (mock) relacionada con estos
     */
    this.init = function() {

        for (var x = 1; x <= agentsNumber; x++) {
            var tmpName = chance.name({ nationality: 'en' });

            callCenter.agents.push({
                id: chance.guid(),
                ext: 1000 + x,
                agent: '1000' + x,
                name: tmpName.split(' ')[0][0] + '. ' + tmpName.split(' ')[1],
                status: models.STATUS[_.random(0, models.STATUS.length - 1)],
                stateChangeTime: moment().format(constants.HOUR_FORMAT),
                teams: [
                    'Team 1',
                    'Team 2'
                ],
                skills: [
                    'Sk 1001',
                    'Sk 1002'
                ],
                statistics: {
                    by: {
                        calls: {
                            accepted: 0,
                            rejected: 0
                        }
                    }
                },
                viewMode: 0
            });
        }
    }

    /**
     * Metodo que inicia la ejecucion del motor.
     */
    this.run = function() {
        let timing = _.random(0.2, 1.5) * 1000;
        callCenter.timing = timing;

        // Reseteo de estadsticas cada dia
        if (this.lastDaySendData != new Date().getDate()) {
            callCenter.statistics.by.calls.accepted = 0;
            callCenter.statistics.by.calls.rejected = 0;

            _.forEach(callCenter.agents, (entry) => {
                entry.statistics.by.calls.accepted = 0;
                entry.statistics.by.calls.rejected = 0;
                this.lastDaySendData = new Date().getDate();
            });
        }

        setTimeout((() => {
            let samples = _.random(0, agentsNumber);
            let agentsSample = _.sample(callCenter.agents, _.random(0, samples / 2));
            callCenter.alerts = [];

            _.map(agentsSample, (entry) => {
                entry.status = _.sample(models.STATUS);
                entry.stateChangeTime = moment().format(constants.HOUR_FORMAT);

                // Sim accepted and rejected calls
                // by agent and all agents
                if ('TALKING' === entry.status) {
                    entry.statistics.by.calls.accepted++;
                    callCenter.statistics.by.calls.accepted++;
                } else if ('NOT AVAILABLE' === entry.status) {
                    entry.statistics.by.calls.rejected++;
                    callCenter.statistics.by.calls.rejected++;
                }
            });

            callCenter.statistics.by.status = _.countBy(callCenter.agents, 'status');

            let rule = eval('callCenter.statistics.by.status["AVAILABLE"] == undefined');
            if (rule) {
                callCenter.alerts.push('No hay agentes disponibles!');
            }

            if (logger) {
                log(prettyjson.render(callCenter, { noColor: false }));
            }

            if (io != null) {
                io.emit('call center status', callCenter);
            }

            this.run();
        }).bind(this), timing);
    }

}

module.exports = Engine;