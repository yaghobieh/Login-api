var mongoose = require('mongoose');
var Schema   = mongoose.Schema; //Create new mongoose shcema
var bcrypt   = require('bcrypt-nodejs'); //Make hash manipulation
var titlize = require('mongoose-title-case');  //A mongoose.js plugin for titlizing & trimming schemas.
var validate = require('mongoose-validator'); //Mongoose Validator simply returns Mongoose style validation objects that utilises validator.js for the data validation.

var nameValidator = [
  // Regular Expressions
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
    message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// Email Validator
var emailValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
    message: 'Name must be at least 3 characters, max 40, no special characters or numbers, must have space in between name.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 40],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// Username Validator
var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username must contain letters and numbers only'
  })
];

// Password Validator
var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
  }),
  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// Build User Schema
var UserSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator },
  username: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
  password: { type: String, required: true, validate: passwordValidator, select: false },
  email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
});

//Before saving user
UserSchema.pre('save', function(next){
  var user = this; //Get a THIS element

  bcrypt.hash(user.password, null, null, function(err, hash){
    if (err) return next(err);
    user.password = hash; //Make Hash to our password
    next(); //Let to the function SAVA to run
  });
});

UserSchema.plugin(titlize, {
  paths: [ 'name' ]

});

UserSchema.methods.comparePass = function(password){
  //Make compare between to password and return true/ false
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);


