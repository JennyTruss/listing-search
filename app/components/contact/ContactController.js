/*-------------------------------------------------------------------------------
 * ContactController
 *
 * Purpose : Business logic for displaying contact forms
 *
 * Dependencies
 * -- ContactService.js
 *-------------------------------------------------------------------------------*/

app.controller('ContactController', [
  '$scope',
  '$uibModalInstance',
  'userID',
  function ($scope, $uibModalInstance, userID) {
    $scope.showForm = true;
    $scope.userID = userID;
    $scope.disableSubmit = true;

    $scope.user = {
      email : '',
      name : '',
      message : ''
    };

    $scope.sendMessage = function () {
      $scope.showForm = false;
    };

    $scope.closeForm = function () {
      $uibModalInstance.dismiss('cancel');
    };

    console.log($scope);
  }
]);
