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

        $scope.getTaxies = function(){
            //console.log('X')
            dataFactory.getTaxies().then(function(response){ //make a get req from this address
                $scope.taxies = response.data; 
                getSumOfAll();
                
            });
        }

        $scope.addTaxi = function(){
            var taxi = {photo_url: '', number: 0, history: []};
            var photo, number;
            dataFactory.getPhoto().then(function(response){ //make a get req from this address
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function(response){ //get the length 
                    number = response.data.length+1; //first starts at 0
                    taxi.name = "Taxi nr. "+ number;
                    dataFactory.addTaxi(taxi).then(function(response){ 
                        $route.reload();
                    });
                });
            });            
        }

        $scope.buyTaxi = function(){
            var taxi = {photo_url: '', number: 0, history: [purchase]};
            var photo, number;
            dataFactory.getPhoto().then(function(response){ //make a get req from this address
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function(response){ //get the length 
                    number = response.data.length+1; //first starts at 0
                    taxi.name = "Taxi nr. "+ number;
                    dataFactory.addTaxi(taxi).then(function(response){ 
                        $route.reload();
                    });
                });
                
            });            
        }

        $scope.getTotal = function(taxi) {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ // deluje tudi z $scope.taxi.history.length
                var rent = taxi.history[i];
                if(rent.price) total += rent.price;
            }
            return total;
        }

        $scope.getTotalAll = function(taxies){
            var total = 0;
            //console.log(taxies.length)
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

        var getSumOfAll = function(){
            curProf=0;
            //get sum of all taxies
            sumAll = $scope.getTotalAll($scope.taxies);
            //get the current earnings of the active taxies
            for(var i = 0; i<$scope.taxies.length; i++){
                if(!$scope.taxies[i].available && timeSpent($scope.taxies[i])>=$scope.taxies[i].history[0].length){
                    $scope.updateRent($scope.taxies[i], $scope.taxies[i]._id, $scope.taxies[i].history[0].length);
                }
                if(!$scope.taxies[i].available){
                    curProf += $scope.getCurrentProfit($scope.taxies[i]);
                }
            }

            console.log($scope.taxies[0].history[0])
                       
            //show current gains
            $scope.gains = curProf+sumAll;
        }

        $interval(getSumOfAll, 2000);
    }]);

    