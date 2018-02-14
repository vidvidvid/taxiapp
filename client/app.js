angular
    .module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages'])
    .config(config);

function config($routeProvider){
    $routeProvider.when('/', {
        controller: 'TaxiesController',
        templateUrl: 'views/taxies.html'
    })
    .when('/taxies', {
        controller: 'TaxiesController',
        templateUrl: 'views/taxies.html'
    })
    .when('/taxies/details/:id', {
        controller: 'TaxiesController',
        templateUrl: 'views/taxi_details.html'
    })
    .when('/taxies/add', {
        controller: 'TaxiesController',
        templateUrl: 'views/add_taxi.html'
    })
    .when('/taxies/rent/:id', {
        controller: 'TaxiesController',
        templateUrl: 'views/rent_taxi.html'
    })
    .otherwise({
        redirectTo: '/'
    });
};