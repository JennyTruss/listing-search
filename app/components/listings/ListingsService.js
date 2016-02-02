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
  'ZipCodeAPI',
  function(eBayAPI, ZipCodeAPI) {

  }
]);
