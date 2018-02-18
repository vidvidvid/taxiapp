angular
    .module('myApp')
    .controller('RentController', ['$scope', '$http', '$location', '$routeParams', '$route', function($scope, $http, $location, $routeParams, $route){
        console.log('RentController loaded')
        var vm = this;
        
        vm.rent = {date: Date.now()};
        vm.rentTaxi = rentTaxi;
        vm.infoPrice = infoPrice;

        function rentTaxi (taxi) {
            var rent = vm.rent;
            rent.price = infoPrice(rent.length);
            console.log(rent);
            taxi.history.unshift(rent);
            var id = $routeParams.id;
            $http.put('/api/taxies/'+id, taxi).then(function(response){
                window.location.href='#!'; 
                //location.reload();
            });
        }

        function infoPrice (seconds){
            if(seconds>300) return 300*5 + (seconds-300)*7.5;
            return seconds*5;
        }


    }]);