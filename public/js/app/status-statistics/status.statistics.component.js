(function() {
    'use strict'

    let statusStatisticsComponent = angular.module('StatusStatisticsComponent', ['chart.js']);

    statusStatisticsComponent.controller('StatusStatisticsController', StatusStatisticsController);
    statusStatisticsComponent.directive('statusStatistics', StatusStatististicsDirective);

    /**
     * Directive to render statistiscs component
     */
    function StatusStatististicsDirective() {
        return {
            controller: 'StatusStatisticsController as statusController',
            templateUrl: './js/app/status-statistics/status.statistics.html'
        }
    }

    /**
     * Controller para manejar el componente de estadisticas de agent por estado
     * @param {*}  
     * @param {*} socket 
     */
    function StatusStatisticsController($scope, socket) {
        let statusController = this;
        statusController.message = 'StatusStatisticsComponent works fine!!'
        statusController.statistics = {
            by: {
                status: {
                    
                }
            }
        }
        

        
        //$scope.colors = ['#5bdf74', '#d94141', '#9242a2', '#dd8b2c']
        
        statusController.data = []
        Chart.defaults.global.elements.arc.borderWidth = 0;
        Chart.defaults.doughnut.cutoutPercentage = 60;
        
        statusController.options = {
            cutoutPercentage: 100,
        }
        

        socket.on('call center status', (function(msg) {
            
            statusController.statistics = msg.statistics;


            // DISTRIBUCION DE AGENTES POR ESTADO
            statusController.labels = ['AVAILABLE', 'NOT AVAILABLE', 'TALKING', 'AFTER WORK'];

            statusController.data = [
                (statusController.statistics.by.status['AVAILABLE'] === undefined)? statusController.statistics.by.status['AVAILABLE'] = 0 : statusController.statistics.by.status['AVAILABLE'],
                (statusController.statistics.by.status['NOT AVAILABLE'] === undefined)? statusController.statistics.by.status['NOT AVAILABLE'] = 0 : statusController.statistics.by.status['NOT AVAILABLE'],
                (statusController.statistics.by.status['TALKING'] === undefined)? statusController.statistics.by.status['TALKING'] = 0 : statusController.statistics.by.status['TALKING'],
                (statusController.statistics.by.status['AFTER WORK'] === undefined)? statusController.statistics.by.status['AFTER WORK'] = 0 : statusController.statistics.by.status['AFTER WORK']
            ];
            
        }));

        return statusController;
    }
})();