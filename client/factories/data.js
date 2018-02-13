angular
    .module('myApp')
    .factory('dataFactory', ['$http', function($http){
        var urlBase = '/api/taxies';
        var dataFactory = {};

        dataFactory.getTaxies = function(){
            return $http.get('/api/taxies');
        }
        dataFactory.getTaxi = function(id){
            return $http.get('/api/taxies/'+id);
        }
        dataFactory.addTaxi = function(scope){
            return $http.post('/api/taxies/', scope.taxi);
        }
        dataFactory.removeTaxi = function(id){
            return $http.delete('/api/taxies/'+id);
        }

        return dataFactory;
    }])