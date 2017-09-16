var app = angular.module('appRoutes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      })


      .when('/about', {
        templateUrl: 'app/views/pages/about.html'
      })

      .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'reg', //Nick name
        authenticated: false
      })

      .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
      })
      
      .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
      })

      .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
      })

      .when('/facebook/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook',
        authenticated: false
      })

      .when('/twitter/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
      })

      .when('/google/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'googleCtrl',
        controllerAs: 'google',
        authenticated: false
      })

      .when('/twittererror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
      })

      .when('/googleerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'googleCtrl',
        controllerAs: 'google',
        authenticated: false
      })

      .when('/error', {
        templateUrl: 'app/views/pages/error.html'
      })

      .otherwise({ redirectTo: '/' });

      $locationProvider.html5Mode({ //No base
        enabled: true,
        requireBase: false
      });
  });

app.run(['$rootScope', 'Auth', '$location', '$timeout', function ($rootScope, Auth, $location, $timeout) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if(next.$$route.authenticated == true){
      //If the user isn't lodded don't let him go into This route
      if ( !Auth.isloggedIn() ){
        event.preventDefault();
        $location.path('/error');
        $timeout(function () {
          $location.path('/');
        }, 2000);
      }
    } else if (next.$$route.authenticated == false){
      if (Auth.isloggedIn()) {
        event.preventDefault();
        $location.path('/profile');
      }
    }
  })
}]);