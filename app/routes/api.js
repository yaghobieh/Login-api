var User   = require('../models/user');
var jwt    = require('jsonwebtoken'); // Import JWT Package (Token)
var secret = 'harrypotter'; // Create custom secret for use in JWT

module.exports = function (router) {

  // USER RESGISTRATION ROUTES
  router.post('/users', function(req, res) {
    var user = new User(); //Create new user
    //Set value for the new user with POST method
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;

    var CRITERIA = req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '' ;

    if( CRITERIA ){
      res.json({success: false, message: 'ensure username, password or email provided'});
    } else {
      user.save(function(err){
        if (err) {
          if( err.errors.name.message ){
            res.json({ success: false, message: err.errors.name.message });
          } else if ( err.errors.email ){
            res.json({ success: false, message: err.errors.email.message });
          } else if (err.errors.username ){
            res.json({ success: false, message: err.errors.username.message });
          } if ( err.errors.password ){
            res.json({ success: false, message: err.errors.password.message })
          }
        }else{
          res.json({ success: true, message: 'User authenticated!'});
        }
      });
    }
  });

  // USER LOGIN ROUTES
  router.post('/authenticate', function(req, res){
    User.findOne({ username: req.body.username }).select('username email password').exec(function(err, user){
      if (err) throw err;

      if(!user){
        res.json({ success: false, message: 'No user found' });
      } else if(user) {
        if (req.body.password){
          var validPassword = user.comparePass(req.body.password);
        } else {
          res.send('No password! try again');
        }
        
        //Check password validation
        if(!validPassword){
          res.json({ success: false, message: 'check your password' });
        }else{
          //If Validation is true -> create TOKEN for 24H
          var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); //Make token alive for 24 hours
          res.json({ success: true, message: 'user authenticated!', token: token });
        }
      }
    })
  });

   // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
  router.use(function(req, res, next) {
      var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

      // Check if token is valid and not expired  
      if (token) {
          // Function to verify token
          jwt.verify(token, secret, function(err, decoded) {
              if (err) {
                  res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
              } else {
                  req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                  next(); // Required to leave middleware
              }
          });
      } else {
          res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
      }
  });

  router.post('/me', function(req, res) {
     res.send(req.decoded); // Return the token acquired from middleware
  });

  return router;
}
