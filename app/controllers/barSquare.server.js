'use strict';

var request = require('request');

function BarSquare() {

  var foursquare_client_id = process.env.FOURSQUARE_CLIENT_ID;
  var foursquare_client_secret = process.env.FOURSQUARE_CLIENT_SECRET;
  var foursquare_path = 'https://api.foursquare.com/v2/venues/';
  var self = this;

  this.countLatest = function() {
    Latest.count({}, function( err, count){
      return count;
    });
  };

  this.getSearch = function(req, res) {
    var location = req.params.location
    var category = '4bf58dd8d48988d116941735';
    var version = '20160605';
    var api_url  = foursquare_path + 'search';
        api_url += '?near=' + location;
        api_url += '&categoryId=' + category;
        api_url += '&v=' + version;
        api_url += '&client_id=' + foursquare_client_id;
        api_url += '&client_secret=' + foursquare_client_secret;
    // Call API Foursquare
    console.log(api_url);
    request(api_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var bars = [];
        var data = JSON.parse(body).response.venues;
        /*
        for (var i in data) {
          items.push({ "url": data[i].link,
                       "title": data[i].title,
                       "thumbnail": data[i].image.thumbnailLink,
                       "context": data[i].image.contextLink
          });
        };
        */
        res.json(data);
      };
    });
  };

  this.saveSearch = function(term) {
    var last = { 'term': term, 'when': new Date() };
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Latest.findOneAndUpdate({ 'term': term }, last, options, function(err, result) {
			if (err) { return false; }
    });
  };

  this.getLatest = function(req, res) {
    Latest
      .find({}, { _id: false, __v: false })
      .sort({'when': -1})
      .limit(10)
      .exec(function(err, latest) {
        res.json(latest);
      });
  };

};

module.exports = BarSquare;
