'use strict';

var path = process.cwd();
var BarSquare = require(path + '/app/controllers/barSquare.server.js');

module.exports = function (app) {

  var barSquare = new BarSquare();

  app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

  app.route('/api/search/:location')
    .get(barSquare.getSearch);

}
