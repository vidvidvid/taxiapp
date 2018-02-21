angular
    .module('myApp')
    .service('taxiesService', ['dataFactory', function (dataFactory, ) {
        var taxi = {};
        taxiesService = {}

        var cancel = {name: 'Preklic', price: 500}
        taxiesService.taxies = [];
        taxiesService.taxi = {};
        taxiesService.taxi.history = [];

        taxiesService.getTaxies = () => {
            //console.log('X')
            dataFactory.getTaxies().then(function(response){ //make a get req from this address
                taxiesService.taxies = response.data; 
            });
        }

        taxiesService.getTaxi = () => {
            var id = $routeParams.id;
            dataFactory.getTaxi(id).then(function(response){ 
                taxiesService.taxi = response.data; //to moram uporabit, da dobim taxi
            });
        }

        taxiesService.removeTaxi = (id) => {
            dataFactory.removeTaxi(id).then(function(response){ 
                //window.location.href='#!'; 
            });
        }

        taxiesService.getTotal = (taxi) => {
            var total = 0;
            for(var i = 0; i < taxi.history.length; i++){ // deluje tudi z $scope.taxi.history.length
                var rent = taxi.history[i];
                if(rent.price) total += rent.price;
            }
            return total;
        }
        
        taxiesService.cancelTaxi = (taxi, id) => {
            console.log('cancelling..')
            taxi.available = true;
            taxi.history.unshift(cancel);
            dataFactory.updateTaxi(id, taxi).then(function(response){ 
            });
        }




        return taxiesService;
    }]);