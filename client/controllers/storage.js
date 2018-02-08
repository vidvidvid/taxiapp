angular
    .module('myApp')
    .controller('StorageController', function(
        $scope,
        $localStorage
    ){
        $scope.$storage = $localStorage.$default({
        y: 10,
        taxiNr: 1
        });
    });