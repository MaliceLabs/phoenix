'use strict';

exports.base = 'users-and-submissions';

exports.up = function (query) {
	return query(
			"CREATE TABLE sessions(\
				id SERIAL PRIMARY KEY,\
				owner INTEGER REFERENCES users (id) ON DELETE CASCADE,\
				started TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')\
			)"
		)();
};

exports.down = function (query) {
	return query("DROP TABLE sessions")();
};
