angular
    .module('myApp')
    .controller('RentController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('RentController loaded')
        var vm = this;

        vm.rent = {date: Date.now()};
        vm.rentTaxi = rentTaxi;
        vm.getTotal = getTotal;
        vm.getTotalAll = getTotalAll;

        function rentTaxi (taxi) {
            console.log(taxi);
            taxi.history.push(this.rent);
            var id = $routeParams.id; 
            $http.put('/api/taxies/'+id, taxi).then(function(response){
                console.log(taxi); 
                window.location.href='#!'; 
            });
            this.rent = {};
        }

        function getTotal (taxi) {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ // deluje tudi z $scope.taxi.history.length
                var rent = taxi.history[i];
                if(rent.price) total += rent.price;
            }
            return total;
        }

        function getTotalAll (taxies){
            var total = 0;
            for(var i = 0; i < taxies.length; i++){
                for(var j = 0; j < taxies[i].history.length; j++){
                    if(taxies[i].history[j].price) total += taxies[i].history[j].price;
                }
            }
            return total;
        }

    }]);