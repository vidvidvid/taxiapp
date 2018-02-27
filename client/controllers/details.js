angular
    .module('myApp')
    .controller('DetailsController', ['$scope', '$routeParams', 'dataFactory', '$route', function ($scope, $routeParams, dataFactory, $route) {
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];
        taxi = {}
        taxi.history = [];

        $scope.getTaxi = () => {
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function (response) {
                $scope.taxi = response.data;
            });
        }

        $scope.disableTaxi = (taxi, id) => {
            taxi.drivable = false;
            dataFactory.updateTaxi(id, taxi).then(function (response) {
                $scope.taxi = response.data;
                $route.reload();
            })
        }

        $scope.getTotal = (taxi) => {
            var total = 0;
            for (var i = 0; i < taxi.history.length; i++) {
                var rent = taxi.history[i];
                if (rent.price) total += rent.price;
            }
            return total;
        }

    }])