'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visits = new Schema({
  date: Date,
	user_id: String
});

var Venue = new Schema({
	name: String,
	address: String,
	checkins: Number,
	tip: {
    text: String,
    author: String
  },
  url: String,
  photo: String,
	visits: [Visits]
});

module.exports = mongoose.model('Venue', Venue);
