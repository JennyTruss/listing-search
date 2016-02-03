/*-------------------------------------------------------------------------------
 * ListingsController
 *
 * Purpose : Business logic for displaying listings
 *
 * Dependencies
 * -- ListingsService.js
 *-------------------------------------------------------------------------------*/

app.controller('ListingsController', [
  '$scope',
  '$timeout',
  '$state',
  'ListingsService',
  'HomeService',
  function ($scope, $timeout, $state, ListingsService, HomeService) {
    $scope.searchResults = 0;
    $scope.showResults = false;
    $scope.showLoading = true;
    if ($scope.searchData === undefined) {
      var sentData = HomeService.getData();
      $scope.searchData = sentData.searchData;
      console.log($scope.searchData);
      if ( sentData.searchData === undefined ) {
        $scope.searchData = {
          category : {
            id : 6000,
            title : 'All'
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
      }
    }
    $scope.listings = ListingsService.getListings($scope.searchData, 20, 1, 'StartTimeNewest');
    $timeout(function () {
      $scope.showLoading = false;
      if ($scope.listings === undefined) {
        $scope.showResults = false;
      }
      else {
        $scope.searchResults = $scope.listings.length;
        $scope.showResults = true;
      }
    },0);

    $scope.topCategories = HomeService.getTopCategories();
    $scope.makeCategories = [{id:0, name:'Select a Category'}];
    $scope.modelCategories = [{id:0, name:'Select a Make'}];
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

    $scope.currentState = 'listings';

    $scope.searchListings = function () {
      var toSend = {
        referringUrl : $scope.currentState,
        searchData : $scope.searchData
      }
      HomeService.goToNext(toSend);
      $state.go('listings');
    };
  }
]);
