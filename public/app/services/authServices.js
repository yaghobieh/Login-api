angular.module('authService', [])
.factory('Auth', function($http, AuthToken){
    var authFactory = {};

    // Set token into localStorage
    authFactory.login = function(loginData) {
        return $http.post('/api/authenticate', loginData).then(function(data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    // Check if login
    authFactory.isloggedIn = function () {
        if ( AuthToken.getToken() ){
            return true;
        }else{
            return false;
        }
    };

    authFactory.facebook = function (token){
        AuthToken.setToken(token);
    }

    authFactory.twitter = function (token) {
        AuthToken.setToken(token);
    }

    authFactory.google = function (token) {
        AuthToken.setToken(token);
    }

    authFactory.getUser = function() {
        // Check first if user has a token
        if (AuthToken.getToken()) {
            return $http.post('/api/me'); // Return user's data
        } else {
            $q.reject({ message: 'User has no token' }); // Reject if no token exists
        }
    }

    authFactory.logout = function () {
        //Remove the Toekn
        AuthToken.setToken();
    }

    return authFactory;
})

.factory('AuthToken', function($window){
    var authTokenFactory = {}; // Create factory object

    authTokenFactory.setToken = function(token) {
        //If token is send
        if( token ){
            $window.localStorage.setItem('token', token);
        } else {
           $window.localStorage.removeItem('token'); 
        }
    };

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory; // Return factory object
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory  = {};

    // Function to check for token in local storage and attach to header if so
    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken(); // Check if a token is in local storage
        if (token) config.headers['x-access-token'] = token; //If exists, attach to headers

        return config; // Return config object for use in app.js (config file)
    };

    return authInterceptorsFactory ;
});

