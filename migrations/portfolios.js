'use strict';

var Promise = require('promise');

module.exports.base = 'tags';

module.exports.up = function (query) {
	return Promise.resolve()
		.then(query(
			"CREATE TABLE portfolios (\
				id SERIAL PRIMARY KEY,\
				owner INTEGER NOT NULL REFERENCES users (id),\
				name VARCHAR NOT NULL,\
				thumbnail INTEGER REFERENCES media (id)\
			)"
		));
};

module.exports.down = function (query) {
	return Promise.resolve()
		.then(query("DROP TABLE portfolios"));
};
