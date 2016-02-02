/*-------------------------------------------------------------------------------
 * ZipCodeAPI
 *
 * Purpose : Service to get city and state information by zip code and a list
 * of zip codes by city. Also gets the distance between zip codes and zip codes
 * within a particular radius.
 *
 * Reference
 * -- https://www.zipcodeapi.com/API
 *-------------------------------------------------------------------------------*/

app.factory('ZipCodeAPI', [
  '$http',
  '$q',
  function ($http, $q) {
    var service = {};
    var clientKey = 'js-RqYmPVoDCyr78a3UpSQOkAD6MpAczBqr1oNRjcuWLW3T77Ow0FllgZs3o2fYDFpF';
    var apiBaseUrl = 'https://www.zipcodeapi.com/rest/';

    // build url to call api
    var getApiUrl = function (params) {
      apiType = params.type + '.json/';
      return apiBaseUrl + clientKey + '/' + apiType + params.lookUp;
    };

    // Look up city and state based on a zip code
    service.getCityInfo = function (uZipCode) {
      var apiParams = {
        type : 'info',
        lookUp : uZipCode + '/degrees'
      };
      var apiUrl = getApiUrl(apiParams);
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: apiUrl
      })
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function () {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    // Get all zip codes for a city
    service.getZipCodesByCity = function (uCity, uState) {
      var apiParams = {
        type : 'city-zips',
        lookUp : uCity + '/' + uState
      };
      var apiUrl = getApiUrl(apiParams);
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: apiUrl
      })
      .success(function (data) {
        deferred.resolve(data.zip_codes);
      })
      .error(function () {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    // Find all zip codes within a selected radius from entered zip code
    service.getZipCodesByRadius = function (uZipCode, uRadius, uUnits) {
      var apiParams = {
        type : 'radius',
        lookUp : uZipCode + '/' + uRadius + '/' + uUnits
      };
      var apiUrl = getApiUrl(apiParams);
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: apiUrl
      })
      .success(function (data) {
        deferred.resolve(data.zip_codes);
      })
      .error(function () {
        deferred.reject('Error');
      });

      return deferred.promise;
    };

    return service;
  }
]);
