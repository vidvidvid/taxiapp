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
                    taxi = response.data;
                    var final = [];
                    var history = taxi.history.filter(function (obj) {
                        return (obj.name !== 'Nakup' && obj.name !== 'Preklic');
                    });
                    if (history.length) {
                        var oneDay = 24 * 60 * 60 * 1000;
                        var first = new Date(history[0].date).setHours(0, 0, 0, 0) + oneDay;
                        var last = new Date(history.slice(-1)[0].date).setHours(0, 0, 0, 0) + oneDay;

                        var rents = new Array((first - last) / oneDay + 1);
                        rents.fill(0);
                        console.log('rents: ', rents);

                        var current;
                        for (var i = 0; i < history.length; i++) {
                            current = new Date(history[i].date).setHours(0, 0, 0, 0) + oneDay;
                            console.log('current: ', current);
                            rents[(current - last) / oneDay]++;
                        }


                        for (var i = 0; i < rents.length; i++) {
                            final.push([last + i * oneDay, rents[i]]);
                        }
                    }
                    /* //calculate the current day
                    var rents = new Array(24);
                    rents.fill(0);
                    var timeNow = Math.floor(Date.now() / 360000);
                    var d = new Date();
                    var today = d.getDate();
                    for(var i = 0; i<taxi.history.length; i++){
                        if(new Date(taxi.history[i].date).getDate() != today) break;
                        if(taxi.history[i].name != 'Preklic' && taxi.history[i].name != 'Nakup') rents[new Date(taxi.history[i].date).getHours()]++;
                    }*/
                    resolve(final);
                })
            })
        }

        taxiesHighchart = () => {
            getRentsArrayColumn().then(function (array) {
                Highcharts.stockChart('container', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Najem taksija skozi čas'
                    },

                    rangeSelector: {
                        enabled: false,
                    },

                    navigator: {
                        margin: 60
                    },

                    series: [{
                        name: 'Število najetij',
                        data: array,
                        color: '#39796b',
                    }]
                });
            })
        }

    }])