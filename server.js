var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose');

require('dotenv').load();

var app = express();

var mongo_uri = process.env.MONGO_URI || 'mongodb://localhost/test';
mongoose.connect(mongo_uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
  app.use('/views', express.static(process.cwd() + '/app/views'));

  routes(app);

  var port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
  });

});
