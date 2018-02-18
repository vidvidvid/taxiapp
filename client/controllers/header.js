angular
    .module('myApp')
    .controller('HeaderController', ['$scope', '$http', '$location', '$routeParams', '$route', 'dataFactory', '$interval', function($scope, $http, $location, $routeParams, $route, dataFactory, $interval){
        console.log('HeaderController loaded')
        var cancel = {name: 'Preklic', price: 500}
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];
        
        var purchase = {name: 'Nakup', price: -100}
        calculatePrice = (seconds) => {
            if(seconds>300) return 300*5 + (seconds-300)*7.5;
            return seconds*5;
        }

        $scope.getTaxies = () => {
            dataFactory.getTaxies().then(function(response){
                $scope.taxies = response.data; 
                getSumOfAll();
                
            });
        }

        $scope.addTaxi = () => {
            var taxi = {photo_url: '', number: 0, history: []};
            var photo, number;
            dataFactory.getPhoto().then(function(response){
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function(response){
                    number = response.data.length+1;
                    taxi.name = "Taxi nr. "+ number;
                    dataFactory.addTaxi(taxi).then(function(response){ 
                        $route.reload();
                    });
                });
            });            
        }

        $scope.buyTaxi = () => {
            var taxi = {photo_url: '', number: 0, history: [purchase]};
            var photo, number;
            dataFactory.getPhoto().then(function(response){
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function(response){
                    number = response.data.length+1;
                    taxi.name = "Taxi nr. "+ number;
                    dataFactory.addTaxi(taxi).then(function(response){ 
                        $route.reload();
                    });
                });
                
            });            
        }

        $scope.getTotal = (taxi) =>  {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ 
                var rent = taxi.history[i];
                if(rent.price) total += rent.price;
            }
            return total;
        }

        getTotalAll = (taxies) => {
            var total = 0;
            for(var i = 0; i < taxies.length; i++){
                for(var j = 0; j < taxies[i].history.length; j++){
                    if(taxies[i].history[j].price) total += taxies[i].history[j].price;
                }
            }
            return total;
        }

        timeSpent = (taxi) => {
            return Math.floor((Date.now()-taxi.history[0].date)/1000)
        }

        var sumRented = 0;
        var sumAll, curProf;

        var getSumOfAll = () => {
            dataFactory.getTaxies().then(function(response){  //tu moram nardit se, da bo preverjal, kako dolgo so ze rentani
                taxies = response.data; 
                curProf=0;
                $scope.gains = getTotalAll(taxies);
            });
            console.log('Getting sum of all taxies');
        }

        $interval(getSumOfAll, 2000);
    }]);

    