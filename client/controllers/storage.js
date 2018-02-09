angular
    .module('myApp')
    .controller('StorageController', function(
        $scope,
        $localStorage
    ){
        $scope.$storage = $localStorage.$default({
        minus: 100,
        taxiNr: 1
        });
    });