(function() {
    'use strict'

    let CallStatisticsComponent = angular.module('CallStatisticsComponent', ['chart.js']);

    CallStatisticsComponent.controller('CallStatisticsController', CallStatisticsController);


    /**
     * Controller para manejar el componente de estadisticas de agent por estado
     * @param {*}  
     * @param {*} socket 
     */
    function CallStatisticsController($scope, socket) {
        let vm = this;
        vm.message = 'CallStatisticsComponent works fine!!'
        vm.statistics = {}

        $scope.data = []
        Chart.defaults.global.elements.rectangle.borderWidth = 1;
        Chart.defaults.bar.beginAtZero = true;

        $scope.options = {
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
        
        $scope.datasetOverride = [
            {
                backgroundColor: 'rgba(180,220,230,.7)'
            },
            {
                backgroundColor: 'rgba(240,240,240,.9)'
            }
        ];

        socket.on('call center status', (function(msg) {
            vm.statistics = msg.statistics;

            let agents = [];
            let accepted = [];
            let rejected = [];

            msg.agents.forEach(function(element) {
                agents.push(element.name + ' (' + element.ext + ')');   
                accepted.push(element.statistics.by.calls.accepted);   
                rejected.push(element.statistics.by.calls.rejected);   
            }, this);
            $scope.labels = agents;
            $scope.series = ['ACCEPTED', 'REJECTED'];
            $scope.data = [
                rejected,
                accepted
            ];            

        }));




        return vm;
    }
})();