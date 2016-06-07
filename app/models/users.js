'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	twitter: {
		id: Number,
		name: String,
		username: String,
    location: String
	},
  polls: Array
});

module.exports = mongoose.model('User', User);
