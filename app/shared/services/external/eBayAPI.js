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
  /*
      apiResults.then(function(data) {
        // categories not to add
        var excludeList = [7251,6472,177131];
        var returnResults = [];
        var parentCategory = data;

        if ( getChildren ) {
          angular.forEach(parentCategory, function (obj) {
            if ( obj.CategoryID != categoryID && excludeList.indexOf(obj.CategoryID) < 0 ) {
              if ( returnResults.length ) {
                returnResults.push(obj);
              }
              else {
                returnResults = [obj];
              }
            }
          });

          return returnResults;
        }
        else {
          return parentCategory[0];
        }

      });
      */
    };

    // Get list of items to based on category
    service.getListings = function (categoryID, qty, pageNumber, sortBy, keywords) {
      var apiUrl = 'http://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.12.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&callback=JSON_CALLBACK&SECURITY-APPNAME=' + appID + '&OPERATION-NAME=findItemsAdvanced&itemFilter(0).name=ExcludeCategory&itemFilter(0).value(0)=7251&itemFilter(0).value(1)=6472&itemFilter(0).value(2)=177131&itemFilter(1).name=HideDuplicateItems&itemFilter(1).value=true&itemFilter(2).name=ListingType&itemFilter(2).value=FixedPrice&itemFilter.paramName=ListingStatus&itemFilter.paramValue=Active&categoryId=' + categoryID + '&paginationInput.entriesPerPage=' + qty + '&paginationInput.pageNumber=' + pageNumber + '&sortOrder=' + sortBy;
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
/*
      apiResults.then(function (data) {
        var searchResult = data.findItemsAdvancedResponse[0].searchResult[0].item;
        var itemIds ='';
        if ( searchResult.length ) {
          for ( var i=0; i<searchResult.length; i++ ) {
            if ( itemIds.length ) {
              itemIds += ',' + searchResult[i].itemId[0];
            }
            else {
              itemIds = searchResult[i].itemId[0];
            }
          }
        }
        console.log(itemIds);
        console.log(service.getItemDetails(itemIds));
        return service.getItemDetails(itemIds);
      });
      */
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
/*
        var returnResults = [];
      apiResults.then(function(data) {
        var thisItem = data;

        if ( angular.isArray(thisItem) ) {
          for ( var i=0; i<thisItem.length; i++ ) {
            returnResults.push( thisItem[i] );
          }
        }
        console.log(returnResults);
        return returnResults;
      });
      */
    };

    return service;
  }
]);
