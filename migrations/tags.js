'use strict';

var Promise = require('promise');

module.exports.base = 'media-metadata';

module.exports.up = function (query) {
	return Promise.resolve()
		.then(query(
			"CREATE TABLE tags (\
				id SERIAL PRIMARY KEY,\
				name VARCHAR NOT NULL UNIQUE\
			)"
		))
		.then(query(
			"CREATE TABLE submission_tags (\
				submission INTEGER NOT NULL REFERENCES submissions (id) ON DELETE CASCADE,\
				tag INTEGER NOT NULL REFERENCES tags (id),\
				PRIMARY KEY (submission, tag)\
			)"
		));
};

module.exports.down = function (query) {
	return Promise.resolve()
		.then(query("DROP TABLE submission_tags"))
		.then(query("DROP TABLE tags"));
};
