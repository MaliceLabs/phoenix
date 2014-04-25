'use strict';

var Promise = require('promise');
var formSession = require('../lib/form-session');
var Redirect = require('../lib/respond').Redirect;
var view = require('../lib/view').view;
var notifications = require('../models/notifications');
var users = require('../models/users');
var media = require('../models/media');

function create(request) {
	return request.user.ensure('submit')
		.then(
			function () {
				return formSession.formFiles(request).then(function (form) {
					return new Promise(function (resolve, reject) {
						var fileCount = 0;
						var files = [];

						form.on('file', function (name, file) {
							fileCount++;

							media.createUploadStream()
								.then(function (uploadStream) {
									file.stream.pipe(uploadStream);
									files.push(
										uploadStream.uploaded.then(function (mediaId) {
											return media.associate(request.user, mediaId, file.filename);
										})
									);
								})
								.catch(reject);
						});

						form.on('finish', function () {
							Promise.all(files)
								.then(function (associationIds) {
									resolve(JSON.stringify(associationIds));
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

exports.creationForm = view('submissions/new', [users.ensure('submit'), notifications.counts]);
exports.create = create;
