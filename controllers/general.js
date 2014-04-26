'use strict';

var view = require('../lib/view').view;
var notifications = require('../models/notifications');

module.exports.home = view('home', [notifications.counts]);
module.exports.terms = view('support/terms-of-service', [notifications.counts]);
module.exports.submissionAgreement = view('support/submission-agreement', [notifications.counts]);
module.exports.aup = view('support/acceptable-upload-policy', [notifications.counts]);
