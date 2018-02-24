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


        getTotalAll = (taxies) => {
            var total = 0;
            for(var i = 0; i < taxies.length; i++){
                for(var j = 0; j < taxies[i].history.length; j++){
                    if(taxies[i].history[j].price>0) total += taxies[i].history[j].price;
                }
            }
            return total;
        }

        currentlyRented = (taxies) => {
            var count = 0;
            for(var i = 0; i<taxies.length; i++){
                if(!taxies[i].available) count++;
            }
            return count;
        }

        lastHourSumAll = (taxies) => {
            var sum = 0;
            for(var i = 0; i<taxies.length; i++){
                sum+=lastHourSumOne(taxies[i]);
            }
            return Math.round(sum/60);
        }

        lastHourSumOne = (taxi) => {
            var sum = 0;
            var timeNow = Date.now();
            if(taxi.history.length>0){
                for(var i = 0; i<taxi.history.length; i++){
                    if(Math.floor((Date.now()-taxi.history[i].date)/1000)<=3600 && taxi.history[i].name!=='Nakup') sum+=taxi.history[i].price;
                }
                return sum;
            }
            return 0;
        }

        mostRented = (taxies) => {
            var most = 0;
            var times;
            times = timesRented(taxies[0]);
            for(var i = 1; i<taxies.length; i++){
                if(timesRented(taxies[i])>times){
                    times = timesRented(taxies[i]);
                    most = i;
                }
                
            }
            return taxies[most].name;
        }

        timesRented = (taxi) => {
            var count = 0;
            if(taxi.history.length){
                for(var i = 0; i<taxi.history.length; i++){
                    if(taxi.history[i].name!='Nakup' && taxi.history[i].name!='Preklic') count++;
                }
                return count;
            }
            return 0;
        }

        getSumOfAll = () => {
            dataFactory.getTaxies().then(function(response){
                taxies = response.data;
                $scope.gains = getTotalAll(taxies);
                $scope.currentlyRented = currentlyRented(taxies);
                $scope.lastHourSumAll = lastHourSumAll(taxies);
                $scope.mostRented = mostRented(taxies);
                var taxi = {};
                for(var i = 0; i<taxies.length; i++){
                    if(check(taxies[i])){
                        if(timeSpent(taxies[i])>length(taxies[i])){
                            taxi = taxies[i];
                            taxi.available = true;
                            dataFactory.updateTaxi(taxi._id, taxi).then(function(response){ 
                            });
                        }
                    }
                }
            });
            console.log('Getting sum of all taxies');
        }

        check = (taxi) => {
            return !(taxi.history.length === 0 || taxi.history[0].name === 'Preklici' || taxi.history[0].name === 'Nakup')
        }

        
        length = (taxi) => {
            if(taxi.history[0].length) return taxi.history[0].length;
            return null;
        }

        timeSpent = (taxi) => {
            if(taxi.history[0].date) return Math.floor((Date.now()-taxi.history[0].date)/1000);
        }

        $interval(getSumOfAll, 10000);
    }]);

    