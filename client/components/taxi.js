angular
    .module('myApp')
    .component('taxiCard', {
        templateUrl: '/templates/taxi.html',
        bindings: { 
            taxi: '=' ,
        },
        controllerAs: 'taxiCard',
        controller: function(taxiesService) {
            this.cancelTaxi = (taxi, id) => {
                taxiesService.cancelTaxi(taxi, id);
            }

            this.disableTaxi = (taxi, id) => {
                taxiesService.disableTaxi(taxi, id);
            }
        }
    })