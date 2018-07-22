let callCenter = angular.module('CallCenter', ['toaster']);

callCenter.controller('CallCenterController', ['$anchorScroll', '$location', '$scope', 'socket', 'toaster', CallCenterController]);
callCenter.directive('callCenter', CallCenterDirective);
callCenter.directive('animateOnChange', StateChangeAnimation);
callCenter.filter('CallCenterFilter', ['$animate', '$timeout', CallCenterFilter]);

/**
 * Animacion al detectar cambio de estado de un elemento
 * @param {*}  
 * @param {*}  
 */
function StateChangeAnimation($animate,$timeout) {
    return function(scope, elem, attr) {
        scope.$watch(attr.animateOnChange, function(nv,ov) {
            
          if (nv != ov) {
            var c = 'pulse';
            $animate.addClass(elem,c).then(function() {
              $timeout(function() {$animate.removeClass(elem,c)}, 2000);
            });
          }
        })  
    }  
  }

/**
 * Directive to render HTML component
 */
function CallCenterDirective() {
    return {
        controller: 'CallCenterController as vm',
        templateUrl: './js/app/call-center/call.center.html'
    }
}

/**
 * Implementacion del filtro de agentes para la vista
 */
function CallCenterFilter() {
    return function(items, criteria) {
        let filtered = [];

        // Si el criterio de busqueda esta vacio devuelvo todo los agentes
        if (criteria == undefined || criteria.length < 3) {
            return items;
        }

        items.forEach((agent) => {
            
            if (agent.status.toLowerCase().indexOf(criteria.toLowerCase()) != -1 
                || agent.agent.toLowerCase().indexOf(criteria.toLowerCase()) != -1
                || agent.name.toLowerCase().indexOf(criteria.toLowerCase()) != -1) {
                filtered.push(agent);
            }
        })

        return filtered;
    }
}

/**
 * Controller par el Component Call Center
 * @param {*}  
 * @param {*} socket 
 */
function CallCenterController($anchorScroll, $location, $scope, socket, toaster) {
    let vm = this;
    vm.message = 'CallCenterController works!';
    vm.agents = [];
    $scope.data = [10, 5];
    
    

    socket.on('call center status', (function(msg) {
        if (vm.agents.length === 0) {
            vm.agents = msg.agents;
        } 
        
        msg.agents.forEach(function(newAgent) {
            vm.agents.forEach(function(agent) {
                if (agent.id ===  newAgent.id && agent.status != newAgent.status) {
                    agent.status = newAgent.status;
                    agent.statistics = newAgent.statistics;
                    agent.stateChangeTime = newAgent.stateChangeTime;
                }
            }, this);    
        });

        if (msg.alerts.length > 0) {
            vm.showAlerts(msg.alerts);
        }
    }));

    vm.showAlerts = function(alerts) {
        alerts.forEach((entry) => {
            toaster.pop('warning', "Alerta", entry, 3000);
        })
    }

    vm.toggleAllAgentsView = function() {
        vm.agents.forEach((agent) => {
            vm.toggleView(agent);
        });
    }


    vm.toggleView = function(agent) {
        if (agent.viewMode >= 2) {
            agent.viewMode = 0;    
        } else {
            agent.viewMode++;
        }
    }

    vm.getCssStatus = function(agent) {
        var cssStatus = {
            statusBl: 'bl-green',
            statusBg: 'status-available'
        }

        if (agent.status == 'AVAILABLE') {
            cssStatus.statusBl = 'bl-green';
            cssStatus.statusBg = 'status-available';
        } else if (agent.status == 'TALKING') {
            cssStatus.statusBl = 'bl-violeta';
            cssStatus.statusBg = 'status-talking';
        } else if (agent.status == 'NOT AVAILABLE') {
            cssStatus.statusBl = 'bl-red';
            cssStatus.statusBg = 'status-not-available';
        } else if (agent.status == 'AFTER WORK') {
            cssStatus.statusBl = 'bl-orange';
            cssStatus.statusBg = 'status-after-work';
        }

        return cssStatus;
    }
    
    vm.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll.yOffset = 65;
        $anchorScroll();
     }

    return vm;
}