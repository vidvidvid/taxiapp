var myApp = angular.module('myApp');

myApp.controller('RentsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    console.log('RentsController loaded')
    $scope.getRents = function(){
        $http.get('/api/rents').then(function(response){ //make a get req from this address
            $scope.rents = response.data; 
        });
    }

    $scope.getRent = function(){
        var id = $routeParams.id;
        $http.get('/api/rents/'+id).then(function(response){ 
            $scope.rent = response.data; 
        });
    }

    $scope.addRent = function(){
        $http.post('/api/rents/', $scope.rent).then(function(response){ 
            window.location.href='#!'; 
        });
    }
}]);