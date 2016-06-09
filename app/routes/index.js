'use strict';

var path = process.cwd();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var BarSquare = require(path + '/app/controllers/barSquare.server.js');

module.exports = function (app, passport) {

  var barSquare = new BarSquare();

  app.route('/')
		.get(function (req, res) {
      res.render('index', { title: 'BarSquare :: Back End Basejump FreeCodeCamp', user: req.user});
		});

  app.get('/login/twitter',
    passport.authenticate('twitter'));

  app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout',
    function(req, res) {
      req.session.destroy();
      res.redirect('/');
    });

  app.route('/api/search/latest')
    .get(barSquare.getLatest);

  app.route('/api/search/:location')
    .get(barSquare.getSearch);

  app.post('/api/checkin',
    ensureLoggedIn('/'),
    barSquare.checkIn);

  app.route('/api/islogged')
    .get(function(req, res) {
      if (typeof req.user !== 'undefined') {
        res.json({islogged: true, id: req.user._id});
      } else {
        res.json({islogged: false});
      }
    });

}
