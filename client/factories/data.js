angular
    .module('myApp')
    .factory('dataFactory', ['$http', function ($http) {
        var urlBase = '/api/taxies';
        var dataFactory = {};

        dataFactory.getTaxies = function () {
            return $http.get('/api/taxies');
        }
        dataFactory.getTaxi = function (id) {
            return $http.get('/api/taxies/' + id);
        }
        dataFactory.addTaxi = function (taxi) {
            return $http.post('/api/taxies/', taxi);
        }
        dataFactory.removeTaxi = function (id) {
            return $http.delete('/api/taxies/' + id);
        }
        dataFactory.getPhoto = function () {
            return $http.get('https://api.unsplash.com/photos/random?client_id=7b8105b594859445adc64d0dfe73fc9282dda72dfc283476dd166899a441df10&query=taxi&h=500&w=300');
        }

        dataFactory.updateTaxi = function (id, taxi) {
            return $http.put('/api/taxies/' + id, taxi);
        }
        return dataFactory;
    }])