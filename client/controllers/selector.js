angular
    .module('myApp')
    .controller('SelectedTextController', function($scope) {
      $scope.items = ['Oseba', 'Podjetje'];
      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          return $scope.selectedItem;
        } else {
          return 'Oseba ali podjetje?'
        }
      };
    });