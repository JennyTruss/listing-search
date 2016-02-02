/*-------------------------------------------------------------------------------
 * HomeController
 *
 * Purpose : Business logic for displaying home page and search form
 *
 * Dependencies
 * -- HomeService.js
 *-------------------------------------------------------------------------------*/

app.controller('HomeController', [
  '$scope',
  '$timeout',
  '$window',
  'HomeService',
  function ($scope, $timeout, $window, HomeService) {
    $scope.listLimit = Math.floor($window.innerWidth / 196);
    $scope.requestAmount = Math.floor($scope.listLimit/3);
    $scope.topListings = HomeService.getRecentListings($scope.requestAmount, 1);
    $scope.btmListings = HomeService.getRecentListings($scope.requestAmount, 2);

    var w = angular.element($window);

    w.bind('resize', function () {
      $timeout(function() {
        $scope.listLimit = Math.floor($window.innerWidth / 196);
        $scope.requestAmount = Math.floor($scope.listLimit/3);
        $scope.topListings = HomeService.getRecentListings($scope.requestAmount, 1);
        $scope.btmListings = HomeService.getRecentListings($scope.requestAmount, 2);
      },0);
    });

    $scope.topCategory = 0;
    $scope.makeCategory = 0;
    $scope.modelCategory = 0;
    $scope.topCategories = HomeService.getTopCategories();
    $scope.makeSelect = 'Select Make to Search';
    $scope.makeCategories = [{id:0, name:'Select a Category'}];
    $scope.modelSelect = 'Select Model to Search';
    $scope.modelCategories = [{id:0, name:'Select a Make Above'}];
    //
    $scope.selectCategory = function (id, type) {
      // change the appropriate element based on the selection type
      switch(type) {
        case 'top':
          $timeout(function () {
            $scope.makeSelect = 'Select Make to Search';
            $scope.modelSelect = 'Select Model to Search';
            $scope.makeCategory = 0;
            $scope.modelCategory = 0;
            $scope.modelCategories = [{id:0, name:'Select a Make Above'}];
            $scope.topCategory = $scope.topCategories[id].id;
            $scope.topSelect = $scope.topCategories[id].name;
            $scope.makeCategories = HomeService.getSubCategories($scope.topCategory);
          }, 0);
          break;
        case 'make':
          $timeout(function () {
            $scope.modelSelect = 'Select Model to Search';
            $scope.modelCategory = 0;
            $scope.modelCategories = [{id:0, name:'Select a Make Above'}];
            $scope.makeCategory = $scope.makeCategories[id].id;
            $scope.makeSelect = $scope.makeCategories[id].name;
            $scope.modelCategories = HomeService.getSubCategories($scope.makeCategory);
            if ( !$scope.modelCategories.length ) {
              $scope.modelCategories = [{id:0, name:'No Models to Choose From'}];
            }
          }, 0);
          break;
        case 'model':
          $scope.modelCategory = $scope.modelCategories[id].id;
          $scope.modelSelect = $scope.modelCategories[id].name;
          break;
      }
    };

    $scope.toggled = function(open) {
    }
  }
]);
