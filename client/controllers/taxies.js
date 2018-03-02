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
            //console.log('Updating taxies')
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

        // frekvenca najemov
        /*getRentsArrayLine = () => {
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
        }*/

        // najem taksijev skozi cas
        getRentsArrayColumn = () => {
            return new Promise(function (resolve, reject) {
                dataFactory.getTaxies().then(function (response) {
                    var rents = new Array(180);
                    rents.fill(0);
                    taxies = response.data;
                    var count, date, rentStart, rentEnd, point, date, length, name, nameNext, rentLength;
                    var timeNow = Math.floor(Date.now() / 60000);
                    console.log('timeNow: ', timeNow);
                    var timeStart = timeNow - 180;

                    //fill the rents array with data
                    for (var i = 0; i < taxies.length; i++) {
                        for (var j = 0; j < taxies[i].history.length; j++) {
                            nameNext = ''
                            date = taxies[i].history[j].date;
                            length = taxies[i].history[j].length;
                            name = taxies[i].history[j].name;

                            // ce je nakup, ne rabimo nadaljevat kode
                            if (name === 'Nakup') break;

                            //iskanje Preklicev
                            if (j > 0) nameNext = taxies[i].history[j - 1].name;

                            //zacetek najema v 10 minutah
                            rentStart = Math.floor(date / 60000);

                            //konec najema
                            if (nameNext === 'Preklic') rentEnd = Math.floor(taxies[i].history[j - 1].date / 60000)
                            else rentEnd = Math.floor((date / 1000 + length) / 60);
                            if (rentEnd > timeNow) rentEnd = timeNow;

                            //rent se je koncal pred vec kot 3 urami
                            if (rentStart < timeStart && rentEnd < timeStart) {
                                break;
                            }

                            //rent se je zacel pred vec kot 3 urami in koncal pred manj kot 3 urami
                            else if (rentStart <= timeStart && rentEnd >= timeStart) {
                                rentLength = rentEnd - timeStart;
                                for (var x = 0; x <= rentLength; x++) {
                                    rents[x]++;
                                }
                                break;
                            }

                            //rent se je zacel pred manj kot 3 urami in se je koncal pred manj kot 3 urami ali se traja
                            else if (name != 'Nakup' && name != 'Preklic') {
                                rentLength = rentEnd - rentStart;
                                var from = rents.length - 1 - (timeNow - rentStart);
                                for (var k = 0; k <= rentLength; k++) {
                                    rents[from + k]++;
                                }
                            }
                        }
                    }
                    resolve(rents);
                })
            })
        }

        taxiesHighchart = () => {
            getRentsArrayColumn().then(function (array) {
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
                            pointInterval: 60 * 1000 // 10 min
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: 'Čas'
                        }
                    },
                    yAxis: {
                        tickInterval: 1,
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