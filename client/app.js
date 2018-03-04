angular
    .module('myApp', ['ngRoute', 'ngMaterial'])
    .config(config);

function config($routeProvider) {
    $routeProvider.when('/', {
            controller: 'TaxiesController',
            templateUrl: 'views/taxies.html'
        })
        .when('/taxies/details/:id', {
            controller: 'DetailsController',
            templateUrl: 'views/taxi_details.html'
        })
        .when('/taxies/rent/:id', {
            controller: 'RentController as rentCtrl',
            templateUrl: 'views/rent_taxi.html'
        })
        .otherwise({
            redirectTo: '/'
        });
};