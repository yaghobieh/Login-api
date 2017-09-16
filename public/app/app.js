angular.module('userApp', ['appRoutes', 'userController', 'userService', 'ngAnimate', 'mainController', 'authService'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });
