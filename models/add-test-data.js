'use strict';

var readline = require('readline');
var users = require('./users');

var rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Username? ', function createUser(username) {
	rl.close();

	users.create({ username: username, password: 'password' }).then(
		function (userId) {
			console.log('Created user %d with password “password”.', userId);
			require('../lib/db').pg.end();
		},
		function (error) {
			console.error(error.stack);
			process.exit(1);
		}
	);
});
