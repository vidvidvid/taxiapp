angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('TaxiesController loaded')
        $scope.getTaxies = function(){
            $http.get('/api/taxies').then(function(response){ //make a get req from this address
                $scope.taxies = response.data; 
            });
        }

        $scope.getTaxi = function(){
            var id = $routeParams.id;
            $http.get('/api/taxies/'+id).then(function(response){ 
                $scope.taxi = response.data; //to moram uporabit, da dobim taxi
            });
        }

        $scope.addTaxi = function(){
            console.log($scope.taxi);
            $http.post('/api/taxies/', $scope.taxi).then(function(response){ 
                window.location.href='#!/taxies'; 
            });
        }

        $scope.removeTaxi = function(id){
            $http.delete('/api/taxies/'+id).then(function(response){ 
                window.location.href='#!'; 
            });
        }
    }]);
