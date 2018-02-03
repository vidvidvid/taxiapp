var myApp = angular.module('myApp');

myApp.controller('TaxiesController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    console.log('TaxiesController loaded')
    $scope.getTaxies = function(){
        $http.get('/api/taxies').then(function(response){ //make a get req from this address
            $scope.taxies = response.data; // now we can access 'books' inside the view
        });
    }
}]);