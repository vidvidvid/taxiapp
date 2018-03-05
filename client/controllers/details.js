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
                    var rents = new Array(24);
                    rents.fill(0);
                    var timeNow = Math.floor(Date.now() / 360000);
                    var d = new Date();
                    var today = d.getDate();
                    for(var i = 0; i<taxi.history.length; i++){
                        if(new Date(taxi.history[i].date).getDate() != today) break;
                        if(taxi.history[i].name != 'Preklic' && taxi.history[i].name != 'Nakup') rents[new Date(taxi.history[i].date).getHours()]++;
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
                    legend: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            pointStart: d.setHours(1,0),
                            pointInterval: 3600 * 1000 //  min
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
                        data: array,
                        color: '#39796b'
                    }]
                });
            })
        }

    }])