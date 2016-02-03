/*-------------------------------------------------------------------------------
 * eBayAPI
 *
 * Purpose : Service to get listing information via the eBay API.
 *
 * Reference
 * -- http://developer.ebay.com/Devzone/finding/CallRef/index.html (Item Search)
 * -- http://developer.ebay.com/DevZone/Shopping/docs/CallRef/index.html (Details)
 *-------------------------------------------------------------------------------*/

app.factory('eBayAPI', [
  '$http',
  '$q',
  function ($http, $q) {
    var service = {};
    var appID = 'Jennifer-cebe-491a-aed2-0362e7c44fbc';

    service.getCategoryInfo = function(categoryID, getChildren) {
      var apiUrl = 'http://open.api.ebay.com/shopping?responseencoding=JSON&callbackname=JSON_CALLBACK&version=525&callname=GetCategoryInfo&appid=' + appID + '&CategoryID=' + categoryID;
      if (getChildren ) {
        apiUrl += '&IncludeSelector=ChildCategories';
      }
      var deferred = $q.defer();

      $http({
        method : 'JSONP',
        url : apiUrl,
        responseType : 'json'
      })
      .success(function (data) {
        deferred.resolve(data.CategoryArray.Category);
      })
      .error(function (err) {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    // Get list of items to based on category
    service.getListings = function (searchData) {
      var apiUrl = 'http://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.12.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&callback=JSON_CALLBACK&SECURITY-APPNAME=' + appID + '&OPERATION-NAME=findItemsAdvanced&categoryId=' + searchData.sendCategoryID + '&paginationInput.entriesPerPage=' + searchData.qty + '&paginationInput.pageNumber=' + searchData.set + '&sortOrder=' + searchData.sortBy + '&itemFilter(0).name=ExcludeCategory&itemFilter(0).value(0)=7251&itemFilter(0).value(1)=6472&itemFilter(0).value(2)=177131&itemFilter(1).name=HideDuplicateItems&itemFilter(1).value=true&itemFilter(2).name=ListingType&itemFilter(2).value=FixedPrice&itemFilter(0).paramName=ListingStatus&itemFilter(0).paramValue=Active';

      var itemFilter = 3;
      if ( searchData.minPrice > 0 ) {
        apiUrl += '&itemFilter(' + itemFilter + ').name=MinPrice&itemFilter(' + itemFilter + ').value=' + searchData.minPrice;
        itemFilter++;
      }
      if ( searchData.maxPrice > 0 ) {
        apiUrl += '&itemFilter(' + itemFilter + ').name=Max_Price&itemFilter(' + itemFilter + ').value=' + searchData.maxPrice;
        itemFilter++;
      }
      if ( searchData.keywords != undefined ) {
        apiUrl += '&keywords=' + searchData.keywords;
      }

      var deferred = $q.defer();

      $http({
        method : 'JSONP',
        url : apiUrl,
        params : {
          format : 'jsonp',
          json_callback : 'JSON_CALLBACK'
        }
      })
      .success(function (data) {
        deferred.resolve(data);
        //console.log(data);
      })
      .error(function (err) {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    // Get details for a specific item
    service.getItemDetails = function (idList) {
      var apiUrl = 'http://open.api.ebay.com/shopping?responseencoding=JSON&callbackname=JSON_CALLBACK&version=525&callname=GetMultipleItems&appid=' + appID + '&itemID=' + idList + '&IncludeSelector=Details,Description,TextDescription,ItemSpecifics,Variations';
      var deferred = $q.defer();

      $http({
        method : 'JSONP',
        url : apiUrl,
        responseType : 'json'
      })
      .success(function (data) {
        deferred.resolve(data.Item);
      })
      .error(function (err) {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    // Seller info
    service.getSellerInfo = function (userID) {
      var apiUrl = 'http://open.api.ebay.com/shopping?responseencoding=JSON&callbackname=JSON_CALLBACK&version=525&callname=GetUserProfile&appid=' + appID + '&UserID=' + userID + '&IncludeSelector=Details';

      var deferred = $q.defer();

      $http({
        method : 'JSONP',
        url : apiUrl,
        responseType : 'json'
      })
      .success(function (data) {
        deferred.resolve(data.User);
      })
      .error(function (err) {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    return service;
  }
]);
