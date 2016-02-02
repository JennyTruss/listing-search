var app = angular.module('ListingSearch', ['ui.router', 'ui.bootstrap', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // enable html5 mode
  $locationProvider.html5Mode(true);
  // Any page not indicated with a route will go to the home page
  $urlRouterProvider.otherwise('/');
  // location of all views
  var viewsRoot = 'app/components/';
  // path routing to views
  $stateProvider
  // home page
  .state('home', {
    url : '/',
    templateUrl : viewsRoot + 'home/HomeView.htm',
    controller : 'HomeController'
  })
  // listings page
  .state('listings', {
    url : '/listings',
    templateUrl : viewsRoot + 'listings/ListingsView.htm',
    controller : 'ListingsController'
  })
  // listing detail page
  .state('listing-detail', {
    url : '/listing/{id:int}', // index of the listing in provided search
    templateUrl : viewsRoot + 'listings/DetailView.htm',
    controller : 'DetailController'
  })
  // photo gallery page
  .state('gallery', {
    url : '/gallery',
    templateUrl : viewsRoot + 'photo-gallery/GalleryView.htm',
    controller : 'PhotoGallery'
  })
  // photo page
  .state('photo', {
    url : '/photo/{id:int}', // index of the photo in the listing photo array
    templateUrl : viewsRoot + 'photo-gallery/PhotoView.htm',
    controller : 'PhotoGallery'
  })
  // error page
  .state('error', {
    url : '/error/{statusCode:int}',
    templateUrl : viewsRoot + 'error/ErrorView.htm',
    controller : 'ErrorController'
  });

  /*
  uiGmapGoogleMapApiProvider.configure({
    key : 'AIzaSyDMYM-Ss53SzB7_O80J5hQ8v4hibTX50wQ',
    v : '3.20',
    libraries : 'places'
  });
  */
});
