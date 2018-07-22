(function() {
    'use strict'

    let CallStatisticsComponent = angular.module('CallStatisticsComponent', ['chart.js']);

    CallStatisticsComponent.controller('CallStatisticsController', CallStatisticsController);
    CallStatisticsComponent.directive('callStatistics', CallStatisticsDirective);

    /**
     * Directive to render HTML component
     */
    function CallStatisticsDirective() {
        return {
            controller: 'CallStatisticsController as callStatisticsController',
            templateUrl: './js/app/call-statistics/call.statistics.html'
        }
    }

    /**
     * Controller para manejar el componente de estadisticas de agent por estado
     * @param {*}  
     * @param {*} socket 
     */
    function CallStatisticsController($scope, socket) {
        let callStatisticsController = this;
        callStatisticsController.message = 'CallStatisticsComponent works fine!!'
        callStatisticsController.statistics = {}

        callStatisticsController.data = []
        Chart.defaults.global.elements.rectangle.borderWidth = 1;
        Chart.defaults.bar.beginAtZero = true;

        callStatisticsController.options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,

                    },
                    gridLines: {
                        display: false
                    },
                    stacked: true
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    display: false,
                    stacked: true
                }]

            }
        }
        
        callStatisticsController.datasetOverride = [
            {
                backgroundColor: 'rgba(180,220,230,.7)'
            },
            {
                backgroundColor: 'rgba(240,240,240,.9)'
            }
        ];

        socket.on('call center status', (function(msg) {
            callStatisticsController.statistics = msg.statistics;

            let agents = [];
            let accepted = [];
            let rejected = [];

            msg.agents.forEach(function(element) {
                agents.push(element.name + ' (' + element.ext + ')');   
                accepted.push(element.statistics.by.calls.accepted);   
                rejected.push(element.statistics.by.calls.rejected);   
            }, this);
            callStatisticsController.labels = agents;
            callStatisticsController.series = ['ACCEPTED', 'REJECTED'];
            callStatisticsController.data = [
                rejected,
                accepted
            ];            

        }));




        return callStatisticsController;
    }
})();