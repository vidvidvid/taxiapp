angular
    .module('myApp')
    .controller('Ctrl', function(
        $scope,
        $localStorage
    ){
        $scope.$storage = $localStorage.$default({
        y: 10
        });
    });