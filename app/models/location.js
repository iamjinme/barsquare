'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
  name: String,
  when: Date
});

module.exports = mongoose.model('Location', Location);
