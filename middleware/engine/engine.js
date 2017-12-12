var _ = require('underscore');
var prettyjson = require('prettyjson');
const log = require('single-line-log').stdout;
const chance = require('chance').Chance();
const moment = require('moment');
const constants = require('../../config/constants');


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
    }
        
}

function Engine() {
    var io;

    return {
        init: function(socket) {
            io = socket;

            for (var x = 1; x <= config.AGENTS_NUMBER; x++) {
                callCenter.agents.push( { 
                    id: x,
                    ext: 1000 + x,
                    agent: '1000' + x,
                    name: chance.name({ nationality: 'en' }),
                    status: config.STATUS[_.random(0, config.STATUS.length - 1)],
                    stateChangeTime: moment().format(constants.DATE_FORMAT),
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
        },

        run: function() {
            
            let timing = _.random(0.2, 1.5) * 1000;
            callCenter.timing = timing;
            setTimeout((() => {
            
                let samples = _.random(0, config.AGENTS_NUMBER);
                let agentsSample = _.sample(callCenter.agents, _.random(0, samples / 2));
                
                _.map(agentsSample, (entry) => {
                    let randomStatus = _.random(0, config.STATUS.length - 1);
                    entry.status = config.STATUS[randomStatus];
                    entry.stateChangeTime = moment().format(constants.DATE_FORMAT);
                
                    // Sim accepted and rejected calls
                    // by agent and all agents
                    if ('TALKING' === config.STATUS[randomStatus]) {
                        entry.statistics.by.calls.accepted++;
                        callCenter.statistics.by.calls.accepted++;
                    } else if ('NOT AVAILABLE' === config.STATUS[randomStatus]) {
                        entry.statistics.by.calls.rejected++;
                        callCenter.statistics.by.calls.rejected++;
                    }
                });

                callCenter.statistics.by.status = _.countBy(callCenter.agents, 'status');
        
                //log(prettyjson.render(callCenter, { noColor: false }));
                
                io.emit('call center status', callCenter);
                this.run();
            }).bind(this), timing);
        },
    }
}

module.exports = new Engine();