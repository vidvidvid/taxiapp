angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$http', '$location', '$routeParams', '$route', function($scope, $http, $location, $routeParams, $route){
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
            var taxi = {photo_url: '', number: 0};
            var photo, number;
            $http.get('https://api.unsplash.com/photos/random?client_id=7b8105b594859445adc64d0dfe73fc9282dda72dfc283476dd166899a441df10&query=taxi').then(function(response){ //make a get req from this address
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                $http.get('/api/taxies').then(function(response){ //get the length 
                    number = response.data.length;
                    taxi.name = "Taxi nr. "+ number;
                    $http.post('/api/taxies/', taxi).then(function(response){ 
                        $route.reload();
                    });
                });
                
            });            
        }

        $scope.removeTaxi = function(id){
            $http.delete('/api/taxies/'+id).then(function(response){ 
                window.location.href='#!'; 
            });
        }
    }]);