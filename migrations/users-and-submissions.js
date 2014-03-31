'use strict';

var Promise = require('promise');

module.exports.base = null;

module.exports.up = function (query) {
	return Promise.from()
		.then(query(
			"CREATE TYPE rating AS ENUM('general', 'mature', 'adult')"
		))
		.then(query(
			"CREATE TABLE users(\
				id SERIAL PRIMARY KEY,\
				username VARCHAR NOT NULL UNIQUE,\
				password_hash BYTEA NOT NULL,\
				password_hash_rounds INTEGER NOT NULL DEFAULT 0,\
				registered TIMESTAMP WITH TIME ZONE NOT NULL,\
				full_name VARCHAR NOT NULL DEFAULT '',\
				artist_type VARCHAR NOT NULL DEFAULT '',\
				current_mood VARCHAR NOT NULL DEFAULT '',\
				profile_text TEXT NOT NULL DEFAULT '',\
				views INTEGER NOT NULL DEFAULT 0\
			)"
		))
		.then(query(
			"CREATE TABLE submissions (\
				id SERIAL PRIMARY KEY,\
				owner INTEGER NOT NULL REFERENCES users (id),\
				title VARCHAR NOT NULL,\
				description TEXT NOT NULL,\
				rating rating NOT NULL,\
				posted TIMESTAMP WITH TIME ZONE NOT NULL,\
				views INTEGER NOT NULL DEFAULT 0\
			)"
		));
};

module.exports.down = function (query) {
	return Promise.from()
		.then(query("DROP TABLE submissions"))
		.then(query("DROP TABLE users"))
		.then(query("DROP TYPE rating"));
};
