'use strict';

var Promise = require('promise');
var db = require('../lib/db');

function mostCommonTagsFor(user) {
	return db.query(
		'SELECT COUNT(submissions.id) AS count, tags.name FROM tags ' +
		'INNER JOIN submission_tags ON tags.id = submission_tags.tag ' +
		'INNER JOIN submissions ON submission_tags.submission = submissions.id ' +
		'WHERE submissions.owner = $1 ' +
		'GROUP BY tags.id ' +
		'ORDER BY count DESC LIMIT 20', [user.id]).then(function (result) {
			return result.rows;
		});
}

function mostCommonTagsForRequester(request) {
	if (!request.user.id) {
		return Promise.resolve(null);
	}

	return mostCommonTagsFor(request.user).then(function (tags) {
		return { commonTags: tags };
	});
}

exports.mostCommonTagsFor = mostCommonTagsFor;
exports.mostCommonTagsForRequester = mostCommonTagsForRequester;
