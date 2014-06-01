'use strict';

var view = require('../lib/view').view;
var notifications = require('../models/notifications');

exports.home = view('home', [notifications.counts]);
exports.terms = view('support/terms-of-service', [notifications.counts]);
exports.submissionAgreement = view('support/submission-agreement', [notifications.counts]);
exports.aup = view('support/acceptable-upload-policy', [notifications.counts]);
