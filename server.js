'use strict';

var app = require('./application');

var server = app.listen(3000, '::1');

process.once('SIGINT', function () {
	server.close(function () {
		process.exit(0);
	});
});
