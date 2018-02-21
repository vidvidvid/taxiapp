angular
    .module('myApp')
    .service('taxiesService', ['dataFactory', function (dataFactory, ) {
        var taxi = {};
        var cancel = {name: 'Preklic', price: 500}
        taxiesService = {}
        taxiesService.taxi = {};
        taxiesService.taxi.history = [];
        
        taxiesService.cancelTaxi = (taxi, id) => {
            console.log('cancelling..')
            taxi.available = true;
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function(response){ 
            });
        }

        return taxiesService;
    }]);