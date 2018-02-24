angular
    .module('myApp')
    .service('taxiesService', ['dataFactory', function (dataFactory, ) {
        var taxi = {};
        var cancel = {};
        taxiesService = {}
        taxiesService.taxi = {};
        taxiesService.taxi.history = [];

        taxiesService.disableTaxi = (taxi, id) => {
            console.log('disable taxi')
            console.log(taxi);
            console.log(id);
            taxi.drivable = false;
            dataFactory.updateTaxi(id, taxi).then(function (response) {});
        };

        taxiesService.cancelTaxi = (taxi, id) => {
            cancel = {
                date: Date.now(),
                name: 'Preklic',
                price: 500
            }
            console.log('cancelling..')
            taxi.available = true;
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function (response) {});
        }

        return taxiesService;
    }]);