/*-------------------------------------------------------------------------------
 * ListingsService
 *
 * Purpose : Service to get listing data and details from eBay API to display.
 * Also uses the Zip Code API for location information and distances.
 *
 * Dependencies
 * -- /app/shared/external/eBayAPI.js (Listing information)
 * -- /app/shared/external/ZipCodeAPI.js (Location information)
 *-------------------------------------------------------------------------------*/

app.service('ListingsService', [
  'eBayAPI',
  function(eBayAPI) {
    var service = {};

    service.getListings = function (searchData, qty, set, sortBy) {
      var allListings = [];
      var sendData = {
        categoryID : searchData.category.id,
        makeID : searchData.make.id,
        modelID : searchData.model.id,
        keywords : searchData.keywords,
        minPrice : searchData.minPrice,
        maxPrice : searchData.maxPrice,
        sendCategoryID : searchData.category.id,
        qty : qty,
        set : set,
        sortBy : sortBy
      };

      if ( sendData.modelID ) {
        sendData.sendCategoryID = sendData.modelID;
      }
      else if ( sendData.makeID ) {
        sendData.sendCategoryID = sendData.makeID;
      }

      var theListings = eBayAPI.getListings(sendData);
      theListings.then(function (data) {
        // get the array of listings
        var listingsIDs = data.findItemsAdvancedResponse[0].searchResult[0].item;
        // loop through the listings
        for ( var i=0; i<listingsIDs.length; i++ ) {
          // get the item ID
          var itemID = listingsIDs[i].itemId[0];
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
      return allListings;
    };

    return service;
  }
]);
