'use strict';

var formSession = require('../lib/form-session');
var Redirect = require('../lib/respond').Redirect;
var rateLimit = require('../lib/rate-limit');
var view = require('../lib/view').view;
var notifications = require('../models/notifications');
var users = require('../models/users');

var loginForm = view('login', [notifications.counts]);

function login(request, response) {
	return formSession.formData(request).then(function (form) {
		return users.authenticate(form).then(function (result) {
			if (!result.userId) {
				return loginForm.with({ failureType: result.failureType, username: form.username })(request);
			}

			return formSession.createUserSession(result.userId, response).then(function () {
				return new Redirect(form.return_to, Redirect.SEE_OTHER);
			});
		});
	});
}

module.exports.loginForm = loginForm;
module.exports.login = rateLimit.byAddress(30, '10 minutes', login, 'login');
