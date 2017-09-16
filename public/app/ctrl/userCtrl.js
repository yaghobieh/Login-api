angular.module('userController', ['userService'])
    .controller('regCtrl', function($http, $location, $timeout, User){
        
        var thisChange = this;

        this.regNewUser = function(regData){
            
            thisChange.loading = true;
            User.create(thisChange.regData).then(function(data){
                
                if(data.data.success){
                    thisChange.loading = false;
                    thisChange.msgAlert = data.data.message;
                    thisChange.alertClass = "alert alert-success";
                    $timeout(function() {
                        $location.path('/');
                    }, 2000);
                }else{
                    thisChange.loading = false;
                    thisChange.msgAlert = data.data.message;
                    thisChange.alertClass = "alert alert-danger";
                }
            });
        }
    })

    .controller('facebookCtrl', function($routeParams, $location, $window, Auth){
        var thisChange = this;

        if( $window.location.pathname == '/facebookerror'){
            // error veriabel
            thisChange.msgAlert = 'Facebook E-mail not found in Database';
            thisChange.alertClass = "alert alert-danger";
        } else {
           //$routeparams- return the URL as a object
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })

    .controller('twitterCtrl', function ($routeParams, $location, $window, Auth) {
        var thisChange = this;

        if ($window.location.pathname == '/twittererror') {
            // error veriabel
            thisChange.msgAlert = 'Twitter E-mail not found in Database';
            thisChange.alertClass = "alert alert-danger";
        } else {
            //$routeparams- return the URL as a object
            Auth.twitter($routeParams.token);
            $location.path('/');
        }
    })

    .controller('googleCtrl', function ($routeParams, $location, $window, Auth) {
        var thisChange = this;

        if ($window.location.pathname == '/googleerror') {
            // error veriabel
            thisChange.msgAlert = 'Google E-mail not found in Database';
            thisChange.alertClass = "alert alert-danger";
        } else {
            //$routeparams- return the URL as a object
            Auth.google($routeParams.token);
            $location.path('/');
        }
    })