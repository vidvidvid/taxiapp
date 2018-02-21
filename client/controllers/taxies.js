angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$location', '$routeParams', '$route', 'dataFactory', '$interval', function($scope, $location, $routeParams, $route, dataFactory, $interval){
        console.log('TaxiesController loaded')
        var cancel = {name: 'Preklic', price: 500}
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];

        $scope.getTaxies = () => {
            //console.log('X')
            dataFactory.getTaxies().then(function(response){ //make a get req from this address
                $scope.taxies = response.data; 
            });
        }

        $scope.getTaxi = () => {
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function(response){ 
                $scope.taxi = response.data; //to moram uporabit, da dobim taxi
            });
        }

        $scope.removeTaxi = (id) => {
            dataFactory.removeTaxi(id).then(function(response){ 
                //window.location.href='#!'; 
            });
        }

        $scope.getTotal = (taxi) => {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ // deluje tudi z $scope.taxi.history.length
                var rent = taxi.history[i];
                if(rent.price) total += rent.price;
            }
            return total;
        }
        
        $scope.cancelTaxi = (taxi, id) => {
            console.log('cancelling..')
            taxi.available = true;
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function(response){ 
            });
        } 
    }]);