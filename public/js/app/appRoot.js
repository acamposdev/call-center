'use strict'
    let root = angular.module('AppRoot', ['CallCenter', 'StatusStatisticsComponent', 'CallStatisticsComponent']);

    root.factory('socket', ['$rootScope', function ($rootScope) {
        var socket = io.connect();
      
        return {
            on: function (eventName, callback) {
                function wrapper() {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                }
                socket.on(eventName, wrapper);
                return function () {
                    socket.removeListener(eventName, wrapper);
                };
            },
      
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if(callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
      }]);


    root.controller('RootController', ['$scope', ($scope) => {
        let vm = this;
        vm.message = 'Angular works!';
        console.log(toaster);

        return vm;
    }]);
