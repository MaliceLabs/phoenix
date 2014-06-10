'use strict';

var Promise = require('promise');

exports.base = 'portfolios';

exports.up = function (query) {
	return Promise.resolve()
		.then(query(
			"CREATE TABLE submission_media (\
				submission INTEGER NOT NULL REFERENCES submissions (id),\
				media INTEGER NOT NULL REFERENCES media (id)\
			)"
		));
};

exports.down = function (query) {
	return Promise.resolve()
		.then(query("DROP TABLE submission_media"));
};
