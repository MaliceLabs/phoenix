'use strict';

var view = require('../lib/view').view;
var notifications = require('../models/notifications');

module.exports.home = view('home', [notifications.counts]);
