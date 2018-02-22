angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$location', '$routeParams', '$route', 'dataFactory', '$interval', function($scope, $location, $routeParams, $route, dataFactory, $interval){
        console.log('TaxiesController loaded')
        var cancel = {name: 'Preklic', price: 500}
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];
        taxi = {}
        taxi.history = [];

        $scope.getTaxies = () => {
            dataFactory.getTaxies().then(function(response){
                $scope.taxies = response.data; 
            });
        }

        $scope.getTaxi = () => {
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function(response){ 
                $scope.taxi = response.data;
            });
        }

        $scope.removeTaxi = (id) => {
            dataFactory.removeTaxi(id).then(function(response){ 
            });
        }

        $scope.getTotal = (taxi) => {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ 
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

        var getTaxiesUpdated = () => {
            console.log('Checking rent length')
            dataFactory.getTaxies().then(function(response){ 
                $scope.taxies = response.data;
            });
        }
        $interval(getTaxiesUpdated, 2000);
    }]);