angular
    .module('myApp')
    .controller('RentController', ['$scope', '$location', '$routeParams', 'dataFactory', function ($scope, $http, $location, $routeParams, dataFactory) {
        console.log('RentController loaded')
        var vm = this;

        vm.rent = {};
        vm.rentTaxi = rentTaxi;
        vm.infoPrice = infoPrice;

        $scope.getTaxi = () => {
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function (response) {
                $scope.taxi = response.data;
            });
        }

        function rentTaxi(taxi) {
            var rent = vm.rent;
            rent.date = Date.now();
            rent.price = infoPrice(rent.length);
            taxi.available = false;
            taxi.history.unshift(rent);
            var id = $routeParams.id;
            dataFactory.updateTaxi(id, taxi).then(function (response) {
                window.location.href = '#!';
            });
        }

        function infoPrice(seconds) {
            if (seconds > 300) return 300 * 5 + (seconds - 300) * 7.5;
            return seconds * 5;
        }


    }]);