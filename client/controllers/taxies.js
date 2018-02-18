angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$http', '$location', '$routeParams', '$route', 'dataFactory', '$interval', function($scope, $http, $location, $routeParams, $route, dataFactory, $interval){
        console.log('TaxiesController loaded')
        var cancel = {name: 'Preklic', price: 500}
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];
        
        var purchase = {name: 'Nakup', price: -100}
        calculatePrice = (seconds) => {
            if(seconds>300) return 300*5 + (seconds-300)*7.5;
            return seconds*5;
        }

        $scope.getTaxies = function(){
            //console.log('X')
            dataFactory.getTaxies().then(function(response){ //make a get req from this address
                $scope.taxies = response.data; 
                getSumOfAll();
                //$interval(getSumOfAll, 2000);
            });
        }

        $scope.getTaxi = function(){
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function(response){ 
                $scope.taxi = response.data; //to moram uporabit, da dobim taxi
            });
        }

        $scope.removeTaxi = function(id){
            dataFactory.removeTaxi(id).then(function(response){ 
                window.location.href='#!'; 
            });
        }

        $scope.updateRent = function(taxi, id, seconds){
            taxi.available = true;
            taxi.history[0].price= calculatePrice(seconds);
            dataFactory.updateTaxi(id, taxi).then(function(response){ 
                window.location.href='#!';
            });
        }

        $scope.cancelTaxi = function(taxi, id){
            taxi.available = true;
            console.log(timeSpent(taxi))
            $scope.updateRent(taxi, id, timeSpent(taxi));
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function(response){ 
                window.location.href='#!';
                //location.reload();
            });
        }

        var sumRented = 0;
        var sumAll, curProf;
        
    }]);

    