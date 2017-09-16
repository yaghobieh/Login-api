angular.module('mainController', ['authService', 'userService'])
    .controller('mainCtrl', function(Auth, User, $timeout, $location, $rootScope, $window){
        var thisChange = this;

        thisChange.loadMe = false;

        //Any time new route change, make this
        $rootScope.$on('$routeChangeStart', function(){
            if( Auth.isloggedIn() ){
                console.log('Success: The user is logged in!');
                Auth.getUser().then(function(data){
                    thisChange.isLoggedIn = true;
                    thisChange.username = data.data.username;
                    thisChange.useremail = data.data.email;
                    thisChange.name = data.data.name;
                    thisChange.loadMe = true;
                });
            }else{
                thisChange.isLoggedIn = false;
                thisChange.username = '';
                thisChange.loadMe = true;
            }
            if($location.hash() == '_=_') $location.hash(null);
        })

        this.facebook = function() {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
        }

        this.twitter = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
        }

        this.google = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
        }
        
        this.login = function(loginData){
            
            thisChange.loading = true;
            Auth.login(thisChange.loginData).then(function(loginData){
                
                if(loginData.data.success){
                    thisChange.loading = false;
                    thisChange.msgAlert = loginData.data.message;
                    thisChange.alertClass = "alert alert-success";
                    $timeout(function() {
                        $location.path('/about');
                        thisChange.loginData = '';
                        thisChange.success = false;
                    }, 2000);
                }else{
                    thisChange.loading = false;
                    thisChange.msgAlert = loginData.data.message;
                    thisChange.alertClass = "alert alert-danger";
                }
            });
        }  

        this.logout = function () {
            Auth.logout();
            //Over to logout direction
            $location.path('/logout');
            //After 2 sec to home page
            $timeout(function(){ 
                $location.path('/');
            }, 2000);
        } 
    });
    