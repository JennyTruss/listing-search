/*-------------------------------------------------------------------------------
 * DetailController
 *
 * Purpose : Business logic for displaying listing details
 *
 * Dependencies
 * -- ListingsService.js
 *-------------------------------------------------------------------------------*/

app.controller('DetailController', [
  '$scope',
  '$stateParams',
  '$state',
  'eBayAPI',
  'HomeService',
  function ($scope, $stateParams, $state, eBayAPI, HomeService) {
    eBayAPI.getItemDetails($stateParams.id).then(function (data) {
      $scope.detail = data[0];
      $scope.largeImage = $scope.detail.PictureURL[0];

      eBayAPI.getSellerInfo($scope.detail.Seller.UserID).then(function (data) {
        $scope.seller = data;
      });
    });

    $scope.showImage = function (picUrl) {
      $scope.largeImage = picUrl;
    };

    $scope.sentData = HomeService.getData();

    $scope.goBack = function () {
      var toSend = {
        referringUrl : $scope.sentData.referringUrl,
        data : $scope.sentData.searchData
      };
      HomeService.goToNext(toSend);
      $state.go(toSend.referringUrl);
    };
  }
]);
