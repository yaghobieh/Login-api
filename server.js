\//install--> nodeMon - Nodemon is a utility that will monitor for any changes in your
//source and automatically restart your server
var express    = require('express');
var app        = express();
var port       = process.env.PORT || 3000;
var morgan     = require('morgan'); //HTTP request logger middleware for node.js
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');
var passport   = require('passport');
var social     = require('./app/passport/passport')(app, passport);

app.use(morgan('dev')); //Morgan is used for logging request details
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname+ '/public')); //Root of location
app.use('/api', appRoutes); //For adding api before intrestings route

mongoose.connect('mongodb://localhost:27017/login', function(err){
  if (err){
    console.log('Some problem with the connection ' +err);
  }else{
    console.log('The Mongoose connection is ready');
  }
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(port, function() {
  console.log('Server is runing on port ' + port);
});
