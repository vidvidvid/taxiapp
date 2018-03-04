angular
    .module('myApp')
    .controller('HeaderController', ['$scope', '$route', 'dataFactory', '$interval', function ($scope, $route, dataFactory, $interval) {
        console.log('HeaderController loaded')
        var cancel = {
            name: 'Preklic',
            price: 500
        }
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];

        var purchase = {
            name: 'Nakup',
            price: -100
        }
        calculatePrice = (seconds) => {
            if (seconds > 300) return 300 * 5 + (seconds - 300) * 7.5;
            return seconds * 5;
        }

        $scope.getTaxies = () => {
            dataFactory.getTaxies().then(function (response) {
                $scope.taxies = response.data;
                updateViewData();
            });
        }

        $scope.addTaxi = () => {
            var taxi = {
                photo_url: '',
                number: 0,
                history: []
            };
            var photo, number;
            dataFactory.getPhoto().then(function (response) {
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function (response) {
                    number = response.data.length + 1;
                    taxi.name = "Taxi nr. " + number;
                    dataFactory.addTaxi(taxi).then(function (response) {});
                });
            });
        }

        $scope.buyTaxi = () => {
            var taxi = {
                photo_url: '',
                number: 0,
                history: [purchase]
            };
            var photo, number;
            dataFactory.getPhoto().then(function (response) {
                photo = response.data;
                taxi.photo_url = photo.urls.small;
                dataFactory.getTaxies().then(function (response) {
                    number = response.data.length + 1;
                    taxi.name = "Taxi nr. " + number;
                    dataFactory.addTaxi(taxi).then(function (response) {});
                });

            });
        }


        getTotalAll = (taxies) => {
            var total = 0;
            for (var i = 0; i < taxies.length; i++) {
                for (var j = 0; j < taxies[i].history.length; j++) {
                    total += taxies[i].history[j].price;
                }
            }
            return total;
        }

        updateViewData = () => {
            dataFactory.getTaxies().then(function (response) {
                taxies = response.data;
                $scope.gains = getTotalAll(taxies);
                var taxi = {};
                for (var i = 0; i < taxies.length; i++) {
                    if (checkValidity(taxies[i])) {
                        if (timeSpent(taxies[i]) > length(taxies[i])) {
                            taxi = taxies[i];
                            taxi.available = true;
                            dataFactory.updateTaxi(taxi._id, taxi).then(function (response) {});
                        }
                    }
                }
            });
            console.log('Getting sum of all taxies');
        }

        checkValidity = (taxi) => {
            return !(taxi.history.length === 0 || taxi.history[0].name === 'Preklici' || taxi.history[0].name === 'Nakup')
        }


        length = (taxi) => {
            if (taxi.history[0].length) return taxi.history[0].length;
            return null;
        }

        timeSpent = (taxi) => {
            if (taxi.history[0].date) return Math.floor((Date.now() - taxi.history[0].date) / 1000);
        }

        $interval(updateViewData, 10000);
    }]);