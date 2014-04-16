'use strict';

module.exports.base = 'users-and-submissions';

module.exports.up = function (query) {
	return query(
			"CREATE TABLE sessions(\
				id SERIAL PRIMARY KEY,\
				owner INTEGER REFERENCES users (id) ON DELETE CASCADE,\
				started TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')\
			)"
		)();
};

module.exports.down = function (query) {
	return query("DROP TABLE sessions")();
};
