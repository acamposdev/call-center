(function() {
    'use strict'

    let statusStatisticsComponent = angular.module('StatusStatisticsComponent', ['chart.js']);

    statusStatisticsComponent.controller('StatusStatisticsController', StatusStatisticsController);


    /**
     * Controller para manejar el componente de estadisticas de agent por estado
     * @param {*}  
     * @param {*} socket 
     */
    function StatusStatisticsController($scope, socket) {
        let vm = this;
        vm.message = 'StatusStatisticsComponent works fine!!'
        vm.statistics = {}

        
        //$scope.colors = ['#5bdf74', '#d94141', '#9242a2', '#dd8b2c']
        
        $scope.data = []
        Chart.defaults.global.elements.arc.borderWidth = 0;
        Chart.defaults.doughnut.cutoutPercentage = 60;
        
        $scope.options = {
            cutoutPercentage: 100,
        }
        

        socket.on('call center status', (function(msg) {
            
            vm.statistics = msg.statistics;

            // DISTRIBUCION DE AGENTES POR ESTADO
            $scope.labels = ['AVAILABLE', 'NOT AVAILABLE', 'TALKING', 'AFTER WORK'];
            $scope.data = [
                vm.statistics.by.status['AVAILABLE'] || 0,
                vm.statistics.by.status['NOT AVAILABLE'] || 0,
                vm.statistics.by.status['TALKING'] || 0,
                vm.statistics.by.status['AFTER WORK'] || 0
            ];
            
        }));

        return vm;
    }
})();