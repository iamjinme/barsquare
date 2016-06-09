var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Strategy = require('passport-twitter').Strategy;

var User = require('./app/models/users.js');

require('dotenv').load();

// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.APP_URL + '/login/twitter/return'
  },
  function(token, tokenSecret, profile, cb) {
    var user = {
      'twitter': {
        'id': profile._json.id,
        'name': profile._json.name,
        'username': profile._json.screen_name,
        'location': profile._json.location
      }
    }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    User.findOneAndUpdate({ 'twitter.id': profile._json.id }, user, options, function(err, result) {
      return cb(null, result);
    });
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

var mongo_uri = process.env.MONGO_URI || 'mongodb://localhost/test';
mongoose.connect(mongo_uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  // app.use(require('morgan')('combined'));
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('body-parser').json());
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
  app.use('/views', express.static(process.cwd() + '/app/views'));

  routes(app, passport);

  var port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
  });

});
