'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visits = new Schema({
  date: Date,
	user_id: String
});

var Venue = new Schema({
	id: String,
	name: String,
	address: String,
	checkins: Number,
	tip_text: String,
  tip_author: String,
  url: String,
  photo: String,
	visits: [Visits]
});

module.exports = mongoose.model('Venue', Venue);
