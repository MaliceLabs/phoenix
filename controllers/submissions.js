'use strict';

var Promise = require('promise');
var querystring = require('querystring');
var formSession = require('../lib/form-session');
var Redirect = require('../lib/respond').Redirect;
var view = require('../lib/view').view;
var notifications = require('../models/notifications');
var users = require('../models/users');
var media = require('../models/media');

var uploadForm = view('submissions/upload', [users.ensure('submit'), media.listForRequester, notifications.counts]);
var createForm = view('submissions/edit', [users.ensure('submit'), notifications.counts]);

function upload(request) {
	return request.user.ensure('submit')
		.then(
			function () {
				return formSession.formFiles(request).then(function (form) {
					return new Promise(function (resolve, reject) {
						var fileCount = 0;
						var files = [];

						form.on('file', function (name, file) {
							media.createUploadStream()
								.then(function (uploadStream) {
									var empty = true;

									file.stream.pipe(uploadStream);

									file.stream.once('data', function () {
										fileCount++;
										empty = false;
									});

									files.push(
										uploadStream.uploaded.then(function (mediaId) {
											return empty ? null : media.associate(request.user, mediaId, file.filename);
										})
									);
								})
								.catch(reject);
						});

						form.on('finish', function () {
							if (!fileCount) {
								uploadForm(request).then(resolve).catch(reject);
								return;
							}

							Promise.all(files)
								.then(function (associatedIds) {
									var redirectTo = '/submissions/new?' + querystring.stringify({ submit: associatedIds.filter(Boolean) });

									resolve(new Redirect(redirectTo, Redirect.SEE_OTHER));
								})
								.catch(reject);
						});
					});
				});
			},
			function () {
				return new Redirect('/login?return_to=/submissions/new');
			}
		);
}

exports.uploadForm = uploadForm;
exports.createForm = createForm;
exports.upload = upload;
