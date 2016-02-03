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
  '$uibModal',
  'eBayAPI',
  'HomeService',
  function ($scope, $stateParams, $state, $uibModal, eBayAPI, HomeService) {
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
      if ( $scope.sentData === undefined ) {
        $state.go('home');
      }
      else {
        var toSend = {
          referringUrl : $scope.sentData.referringUrl,
          searchData : $scope.sentData.searchData
        };
        HomeService.goToNext(toSend);
        $state.go(toSend.referringUrl);
      }
    };

    $scope.contact = function(userID) {
      $scope.userID = userID;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/components/contact/ContactView.htm',
        controller: 'ContactController',
        size: '',
        resolve: {
          userID: function () {
            return $scope.userID;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };
  }
]);
