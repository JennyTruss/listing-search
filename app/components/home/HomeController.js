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
  '$state',
  'HomeService',
  function ($scope, $timeout, $window, $state, HomeService) {
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

    $scope.topCategories = HomeService.getTopCategories();
    $scope.makeCategories = [{id:0, name:'Select a Category'}];
    $scope.modelCategories = [{id:0, name:'Select a Make'}];

    $scope.searchData = {
      category : {
        id : 0,
        title : ''
      },
      make : {
        id : 0,
        title : 'Select Make to Search',
      },
      model : {
        id : 0,
        title : 'Select Model to Search'
      },
      keywords : '',
      minPrice : '',
      maxPrice : ''
    };
    //
    $scope.selectCategory = function (id, type) {
      // change the appropriate element based on the selection type
      switch(type) {
        case 'top':
          $timeout(function () {
            $scope.searchData.category.id = $scope.topCategories[id].id;
            $scope.searchData.category.title = $scope.topCategories[id].name;
            $scope.searchData.model.id = 0;
            $scope.searchData.make.title = 'Select Make to Search';
            $scope.searchData.model.id = 0;
            $scope.searchData.model.title = 'Select Model to Search';
            $scope.modelCategories = [{id:0, name:'Select a Make'}];
            $scope.makeCategories = HomeService.getSubCategories($scope.searchData.category.id);
          }, 0);
          break;
        case 'make':
          $timeout(function () {
            $scope.searchData.make.id = $scope.makeCategories[id].id;
            $scope.searchData.make.title = $scope.makeCategories[id].name;
            $scope.searchData.model.id = 0;
            $scope.searchData.model.title = 'Select Model to Search';
            $scope.modelCategories = [{id:0, name:'Select a Make'}];
            $scope.modelCategories = HomeService.getSubCategories($scope.searchData.make.id);
          }, 0);
          break;
        case 'model':
          $scope.searchData.model.id = $scope.modelCategories[id].id;
          $scope.searchData.model.title = $scope.modelCategories[id].name;
          break;
      }
    };

    $scope.currentState = 'home';

    $scope.searchListings = function () {
      var toSend = {
        referringUrl : $scope.currentState,
        searchData : $scope.searchData
      };
      HomeService.goToNext(toSend);
      $state.go('listings');
    };
  }
]);
