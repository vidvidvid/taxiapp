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
            var x = 0;
            dataFactory.getTaxies().then(function(response){ //make a get req from this address
                $scope.taxies = response.data; 
                getSumOfAll();
                
            });
        }

        $scope.getTaxi = function(){
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function(response){ 
                $scope.taxi = response.data; //to moram uporabit, da dobim taxi
            });
        }

        $scope.addTaxi = function(){
            var taxi = {photo_url: '', number: 0, history: [purchase]};
            var photo, number;
            $http.get('https://api.unsplash.com/photos/random?client_id=7b8105b594859445adc64d0dfe73fc9282dda72dfc283476dd166899a441df10&query=taxi').then(function(response){ //make a get req from this address
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                $http.get('/api/taxies').then(function(response){ //get the length 
                    number = response.data.length+1; //first starts at 0
                    taxi.name = "Taxi nr. "+ number;
                    $http.post('/api/taxies/', taxi).then(function(response){ 
                        $route.reload();
                    });
                });
                
            });            
        }

        $scope.removeTaxi = function(id){
            dataFactory.removeTaxi(id).then(function(response){ 
                window.location.href='#!'; 
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

        //za tistega, ki je zaseden
        $scope.getCurrentProfit = function(taxi){
            return calculatePrice(timeSpent(taxi));
        }

        $scope.updateRent = function(taxi, id, seconds){
            taxi.available = true;
            taxi.history[0].price= calculatePrice(seconds);
            $http.put('/api/taxies/'+id, taxi).then(function(response){ 
                window.location.href='#!';
            });
        }

        $scope.cancelTaxi = function(taxi, id){
            taxi.available = true;
            console.log(timeSpent(taxi))
            $scope.updateRent(taxi, id, timeSpent(taxi));
            taxi.history.unshift(cancel);
            $http.put('/api/taxies/'+id, taxi).then(function(response){ 
                window.location.href='#!';
            });
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


                       
            //show current gains
            $scope.gains = curProf+sumAll;
     
        }

        $interval(getSumOfAll, 3000);
    }]);

    