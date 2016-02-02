app.directive('listingCard', [
  '$state',
  function ($state) {
    return {
      restrict : 'E',
      scope : {
        info : '='
      },
      templateUrl : 'app/shared/directives/listing-card/ListingCardView.htm',
      link : function(scope, element, attrs) {
        scope.showListing = function(itemID) {
          $state.go('listing-detail', {id : itemID});
        };
      }
    }
  }
]);
