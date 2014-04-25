'use strict';

var app = require('./application');

var server = app.listen(
	process.env.PORT || 3000,
	process.env.HOST || 'localhost'
);

process.once('SIGINT', function () {
	server.close(function () {
		process.exit(0);
	});
});
