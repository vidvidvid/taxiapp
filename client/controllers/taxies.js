angular
    .module('myApp')
    .controller('TaxiesController', ['$scope', '$route', 'dataFactory', '$interval', function ($scope, $route, dataFactory, $interval) {
        console.log('TaxiesController loaded')
        var cancel = {
            name: 'Preklic',
            price: 500
        }
        $scope.taxies = [];
        $scope.taxi = {};
        $scope.taxi.history = [];
        taxi = {}
        taxi.history = [];

        $scope.getTaxies = () => {
            dataFactory.getTaxies().then(function (response) {
                $scope.taxies = response.data;
            });
            taxiesHighchart();
        }

        $scope.removeTaxi = (id) => {
            dataFactory.removeTaxi(id).then(function (response) {});
        }

        $scope.getTotal = (taxi) => {
            var total = 0;
            for (var i = 0; i < taxi.history.length; i++) {
                var rent = taxi.history[i];
                if (rent.price) total += rent.price;
            }
            return total;
        }

        $scope.disableTaxi = (taxi, id) => {
            taxi.drivable = false;
            dataFactory.updateTaxi(id, taxi).then(function (response) {
                $scope.taxi = response.data;
                $route.reload();
            })
        }

        $scope.cancelTaxi = (taxi, id) => {
            console.log('cancelling..')
            taxi.available = true;
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function (response) {});
        }

        currentlyRented = (taxies) => {
            var count = 0;
            for (var i = 0; i < taxies.length; i++) {
                if (!taxies[i].available) count++;
            }
            return count;
        }

        lastHourSumAll = (taxies) => {
            var sum = 0;
            for (var i = 0; i < taxies.length; i++) {
                sum += lastHourSumOne(taxies[i]);
            }
            return Math.round(sum / 60);
        }

        lastHourSumOne = (taxi) => {
            var sum = 0;
            var timeNow = Date.now();
            if (taxi.history.length > 0) {
                for (var i = 0; i < taxi.history.length; i++) {
                    if (Math.floor((Date.now() - taxi.history[i].date) / 1000) <= 3600 && taxi.history[i].name !== 'Nakup') sum += taxi.history[i].price;
                }
                return sum;
            }
            return 0;
        }

        mostRented = (taxies) => {
            var most = 0;
            var times;
            times = timesRented(taxies[0]);
            for (var i = 1; i < taxies.length; i++) {
                if (timesRented(taxies[i]) > times) {
                    times = timesRented(taxies[i]);
                    most = i;
                }

            }
            return taxies[most].name;
        }

        timesRented = (taxi) => {
            var count = 0;
            if (taxi.history.length) {
                for (var i = 0; i < taxi.history.length; i++) {
                    if (taxi.history[i].name != 'Nakup' && taxi.history[i].name != 'Preklic') count++;
                }
                return count;
            }
            return 0;
        }

        var updateTaxies = () => {
            console.log('Updating taxies')
            dataFactory.getTaxies().then(function (response) {
                $scope.taxies = response.data;
                $scope.currentlyRented = currentlyRented(taxies);
                $scope.lastHourSumAll = lastHourSumAll(taxies);
                if (taxies.length) $scope.mostRented = mostRented(taxies);
            });
        }

        $scope.refreshData = () => {
            dataFactory.getTaxies().then(function (response) {
                console.log('osvezi');
                taxiesHighchart();
            });
        }

        getRentsArray = () => {
            return new Promise(function (resolve, reject) {
                dataFactory.getTaxies().then(function (response) {
                    var rents = new Array(18);
                    rents.fill(0);
                    taxies = response.data;
                    var count, date, rentStart, point;
                    var timeNow = Math.floor(Date.now() / 60000);
                    var timeStart = timeNow - 180;

                    //fill the rents array with data
                    for (var i = 0; i < taxies.length; i++) {
                        for (var j = 0; j < taxies[i].history.length; j++) {
                            rentStart = Math.floor(taxies[i].history[j].date / 60000);
                            if (rentStart <= timeStart) break;
                            if (taxies[i].history[j].name != 'Nakup' && taxies[i].history[j].name != 'Preklic') {
                                point = Math.floor((timeNow - rentStart) / 10);
                                rents[point]++;
                            }
                        }
                    }
                    rents.reverse();
                    resolve(rents);
                })
            })
        }

        taxiesHighchart = () => {
            getRentsArray().then(function (array) {
                var d = new Date();
                Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Najem taksijev skozi čas'
                    },

                    plotOptions: {
                        series: {
                            pointStart: d.setHours(d.getHours() - 2),
                            pointInterval: 60 * 10000 // 10 min
                        }
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Število najemov'
                        }
                    },
                    series: [{
                        data: array
                    }]
                });
            })
        }

        $interval(updateTaxies, 2000);
    }]);