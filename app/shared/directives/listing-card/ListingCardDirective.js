app.directive('listingCard', [
  '$state',
  '$uibModal',
  '$log',
  'HomeService',
  function ($state, $uibModal, $log, HomeService) {
    return {
      restrict : 'E',
      scope : {
        info : '=',
        class : '@class'
      },
      templateUrl : 'app/shared/directives/listing-card/ListingCardView.htm',
      link : function(scope, element, attrs) {
        scope.showListing = function(itemID) {
          var toSend = {
            referringUrl : scope.$parent.currentState,
            sendData : scope.$parent.searchData
          };
          console.log(toSend);
          HomeService.goToNext(toSend);
          $state.go('listing-detail', {id : itemID});
        };
      }
    }
  }
]);
