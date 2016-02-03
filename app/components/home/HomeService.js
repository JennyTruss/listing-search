/*-------------------------------------------------------------------------------
 * HomeService
 *
 * Purpose : Service to get data and parse for home page and search form. Uses
 * calls retrieved from external APIs.
 *
 * Dependencies
 * -- /app/shared/external/eBayAPI.js (Category information)
 * -- /app/shared/external/ZipCodeAPI.js (Location information)
 *-------------------------------------------------------------------------------*/

app.service('HomeService', [
  'eBayAPI',
  '$rootScope',
  '$timeout',
  function(eBayAPI, $rootScope, $timeout) {
    service = {};
    // show loading animation while the calls are made
    var showLoading = true;
    // IDs for Cars & Trucks, Motorcycles, and RVs
    var topCategoryIDs = [6001, 6024, 50054];

    // Get the top 3 Categories to choose from
    service.getTopCategories = function () {
      // array to hold the final list
      var topCategoryInfo = [];
      // loop through the list of ids
      for ( var i=0; i<topCategoryIDs.length; i++ ) {
        // get the info for each category
        var thisCategory = eBayAPI.getCategoryInfo(topCategoryIDs[i], false);
        // wait for the data to finish fetching and loading
        thisCategory.then( function (data) {
          // create new object and get only the info we need
          var categoryInfo = {
            name : data[0].CategoryName,
            id : data[0].CategoryID
          };
          // create a class name by removing special characters and replacing spaces with dashes
          var className = categoryInfo.name.replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
          categoryInfo.class = className;
          // add the info to the list
          topCategoryInfo.push(categoryInfo);
        });
      }
      // stop show the loading animation
      showLoading = false;
      // list is ready, send it back to be displayed using ng-repeat
      return topCategoryInfo;
    };

    // Get the next level of categories by clicking on a displayed category
    service.getSubCategories = function (parentID) {
      // Do not show these categories, they are not vehicles
      var categoryList = [];
      // get the immediate children of the selected category
      var theChildren = eBayAPI.getCategoryInfo(parentID, true);
      // wait for the data to finish fetching and loading
      theChildren.then( function (data) {
        //console.log(data);
        // loop through the results
        for ( var i=1; i<data.length; i++ ) {
          // object to contain information we want
          var tempObj = {
            id : data[i].CategoryID,
            name : data[i].CategoryName
          };
          // add it to the array
          categoryList.push(tempObj);
        }
      });
      //return the array
      return categoryList;
    };

    // Get selected number of recent listings in each category for top and bottom bars
    service.getRecentListings = function (qty, set) {
      // create an array to hold all listings
      var allListings = [];
      // loop through each of the top categories and get the selected number of listings
      for ( var i=0; i<topCategoryIDs.length; i++ ) {
        var searchData = {
          categoryID : topCategoryIDs[i],
          makeID : 0,
          modelID : 0,
          keywords : '',
          minPrice : 0,
          maxPrice : 0,
          sendCategoryID : topCategoryIDs[i],
          qty : qty,
          set : set,
          sortBy : 'StartTimeNewest'
        };
        // get the listings for the current category
        var categoryListings = eBayAPI.getListings(searchData);
        // wait for the data to finish fetching and loading
        categoryListings.then( function (data) {
          // get the array of listings
          var theListings = data.findItemsAdvancedResponse[0].searchResult[0].item;
          // loop through the listings
          for ( var i=0; i<theListings.length; i++ ) {
            // get the item ID
            var itemID = theListings[i].itemId[0];
            // get the details of the item
            var itemDetails = eBayAPI.getItemDetails(itemID);
            // once the information has been received, capture what we need
            itemDetails.then( function (data) {
              //console.log(data[0]);
              // Grab only what we need
              var itemInfo = {
                id : data[0].ItemID,
                price : data[0].CurrentPrice.Value,
                photo : data[0].PictureURL[0],
                location : data[0].Location
              };
              // parse the item specifics so we can find what we need
              var itemSpecifics = data[0].ItemSpecifics.NameValueList;
              // What we are looking for
              var detailList = ["Year", "Make", "Model"];
              var itemDetails = {};
              // loop through and build the item specifics we need
              for ( var i=0; i<itemSpecifics.length; i++ ) {
                var keyName = itemSpecifics[i].Name;
                // see if the name of the object is one of the items in our list
                if ( detailList.indexOf(keyName) > -1 ) {
                  // remove spaces out of the key name
                  keyName = keyName.replace(/\s/g, '');
                  // we found one! so lets add the name and value to our details
                  itemDetails[keyName] = itemSpecifics[i].Value[0];
                }
              }
              // add the detail to main item object
              itemInfo.details = itemDetails;
              //console.log(itemInfo);
              // add the item to the listings array
              allListings.push(itemInfo);
            });
          }
        });
      }

      return shuffle(allListings);
    };

    var shuffle = function (array) {
      var currentIndex = array.length;
      while (0 !== currentIndex) {
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        var tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
      }
      return array;
    }

    // Service to broadcast the search parameters to the listing page
    service.goToNext = function(data) {
      service.sendData = data;
    };
    service.getData = function () {
      return service.sendData;
    };

    //return service;
    return service;
  }
]);
