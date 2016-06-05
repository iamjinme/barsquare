'use strict';

var request = require('request');

function BarSquare() {

  var foursquare_client_id = process.env.FOURSQUARE_CLIENT_ID;
  var foursquare_client_secret = process.env.FOURSQUARE_CLIENT_SECRET;
  var foursquare_path = 'https://api.foursquare.com/v2/venues/';
  var foursquare_version = '20160605';
  var foursquare_size_photo = '300x200'
  var self = this;

  this.countLatest = function() {
    Latest.count({}, function( err, count){
      return count;
    });
  };

  var getRandom = function(max) {
    return Math.floor(Math.random() * max);
  }

  var getInfo = function(bars, i, callback) {
    var api_url  = foursquare_path + bars[i].id;
        api_url += '?v=' + foursquare_version;
        api_url += '&client_id=' + foursquare_client_id;
        api_url += '&client_secret=' + foursquare_client_secret;
    request(api_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).response.venue;
        bars[i].url = data.shortUrl;
        if(data.tips.count) {
          bars[i].tip = data.tips.groups[0].items[getRandom(data.tips.groups[0].items.length)].text;
        }
        if(data.photos.count) {
          var photo = data.photos.groups[0].items[getRandom(data.photos.groups[0].items.length)];
          bars[i].photo = photo.prefix + foursquare_size_photo + photo.suffix;
        }
        i++;
        if (i < bars.length) {
          getInfo(bars, i, callback);
        } else {
          callback(bars);
        }
      } else {
        console.log(error);
        callback([]);
      };
    });
  }

  this.getSearch = function(req, res) {
    var location = req.params.location
    var category = '4bf58dd8d48988d116941735';
    var api_url  = foursquare_path + 'search';
        api_url += '?near=' + location;
        api_url += '&categoryId=' + category;
        api_url += '&v=' + foursquare_version;
        api_url += '&client_id=' + foursquare_client_id;
        api_url += '&client_secret=' + foursquare_client_secret;
    // Call API Foursquare
    request(api_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var bars = [];
        var data = JSON.parse(body).response.venues;
        for (var i in data) {
          bars.push({ "id": data[i].id,
                       "name": data[i].name,
                       "address": data[i].location.address,
                       "checkins": data[i].stats.checkinsCount,
                       "tip": "No tips found",
                       "photo": data[i].categories[0].icon.prefix + foursquare_size_photo + data[i].categories[0].icon.suffix
          });
        };
        bars = bars.filter(function(value, index) {
          return index < 5;
        })
        getInfo(bars, 0, function(bars){
          res.json(bars);
        });
      } else {
        res.json({'error': true, 'message': "Couldn't geocode param near"})
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
