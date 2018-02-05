var myApp = angular.module('myApp');

myApp.controller('TaxiesController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    console.log('TaxiesController loaded')
    $scope.getTaxies = function(){
        $http.get('/api/taxies').then(function(response){ //make a get req from this address
            $scope.taxies = response.data; 
        });
    }

    $scope.getTaxi = function(){
        var id = $routeParams.id;
        $http.get('/api/taxies/'+id).then(function(response){ 
            $scope.taxi = response.data; //to moram uporabit, da dobim taxi
        });
    }

    $scope.addTaxi = function(){
        console.log($scope.taxi);
        $http.post('/api/taxies/', $scope.taxi).then(function(response){ 
            window.location.href='#!/taxies'; 
        });
    }

    $scope.removeTaxi = function(id){
        $http.delete('/api/taxies/'+id).then(function(response){ 
            window.location.href='#!'; 
        });
    }

    
}]);

myApp.controller('RentController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    console.log('RentController loaded')
    this.rent = {date: Date.now()};

    this.rentTaxi = function(taxi) {
        console.log(taxi);
        taxi.history.push(this.rent);
        var id = $routeParams.id; 
        $http.put('/api/taxies/'+id, taxi).then(function(response){
            console.log(taxi); 
            window.location.href='#!'; 
        });
        this.rent = {};
    }

    this.getTotal = function(taxi) {
        var total = 0;
        for(var i = 0; i < taxi.history.length; i++){ // deluje tudi z $scope.taxi.history.length
            var rent = taxi.history[i];
            if(rent.price) total += rent.price;
        }
        return total;
    }

    this.getTotalAll = function(taxies){
        var total = 0;
        for(var i = 0; i < taxies.length; i++){
            for(var j = 0; j < taxies[i].history.length; j++){
                if(taxies[i].history[j].price) total += taxies[i].history[j].price;
            }
        }
        return total;
    }

}]);