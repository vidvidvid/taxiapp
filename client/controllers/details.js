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
            taxiesHighchart();
        }

        $scope.disableTaxi = (taxi, id) => {
            taxi.drivable = false;
            dataFactory.updateTaxi(id, taxi).then(function (response) {
                dataFactory.getTaxi(id).then(function (response) {
                    $scope.taxi = response.data;
                });
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

        getRentsArrayColumn = () => {
            var id = $routeParams.id;
            return new Promise(function (resolve, reject) {
                dataFactory.getTaxi(id).then(function (response) {
                    var rents = new Array(24);
                    rents.fill(0);
                    taxi = response.data;
                    var count, date, rentStart, rentEnd, point, date, length, name, nameNext, rentLength;
                    var timeNow = Math.floor(Date.now() / 3600000);
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
                            pointStart: d.setHours(1,0),
                            pointInterval: 360 * 1000 //  min
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

    }])