angular
    .module('myApp')
    .controller('IntervalController', ['$scope', '$interval', function($scope, $interval){
        $interval(functionName, 1000);
    }])