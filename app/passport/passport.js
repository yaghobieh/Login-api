var FacebookStrategy = require('passport-facebook').Strategy; //Use Facebook strategy
var TwitterStrategy  = require('passport-twitter').Strategy; //Use Twitter strategy
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy; //Use google+ strategy
var User             = require('../models/user'); //User schema builder
var session          = require('express-session'); //Express Sessions
var jwt              = require('jsonwebtoken'); // Import JWT Package (Token)
var secret           = 'harrypotter'; // Create custom secret for use in JWT

module.exports = function(app, passport) {

    //initialize Passport && session
    app.use(passport.initialize());
    app.use(passport.session());

    //cookie.secure
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } //Not make use cookie
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Use facebook stratgy
    passport.use(new FacebookStrategy({
        //Facebook details
            clientID: '161758281045245',
            clientSecret: '881044482aad86d276ed283073523e98',
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email'] //What return from Facebook
        },

        function(accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile._json.email  }).select(' username email password ').exec(function(err, user){
                if (err) done(err);
                //Check if the facebook account is auth by facebook
                if(user && user != null){
                    done(null, user);
                } else {    
                    done(err);
                }
            });
        }
    ));

    // Use twitter Strategy
    passport.use(new TwitterStrategy({
        consumerKey: 'Bi9TwJSrgr70ldxdoLr6VqsRr',
        consumerSecret: 'YuSal80xhIsQZb4VSYHR2xQUjtV7FstpCrshSK4w10AzjPv3Th',
        callbackURL: "http://localhost:3000/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
        function (token, tokenSecret, profile, done) {
            User.findOne({ email: profile.emails[0].value }).select(' username email password ').exec(function (err, user) {
                if (err) done(err);
                //Check if the facebook account is auth by facebook
                if (user && user != null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
        }
    ));

    // Use google plus Strategy
    passport.use(new GoogleStrategy({
        clientID: '849545611661-cnd8v986ggc2mpf7uj7te7cuu0tbmeh7.apps.googleusercontent.com',
        clientSecret: 'PV4QcMjlFfHXKWg7Xc9j0M06',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile.emails[0].value }).select(' username email password ').exec(function (err, user) {
                if (err) done(err);
                //Check if the facebook account is auth by facebook
                if (user && user != null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
        }
    ));

    // Google + route
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }),function (req, res) {
        res.redirect('/google/' +token);
    });

    // Twitter route
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror'}), function(req, res){
        res.redirect('/twitter/' +token);
    });

    // Facebook route
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res){
        //If no error
        res.redirect('/facebook/' +token);
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );

    return passport;
}