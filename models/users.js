'use strict';

var Promise = require('promise');
var assert = require('assert');
var db = require('../lib/db');
var bcrypt = require('bcrypt');
var config = require('../config');

var bcryptRounds = config.password.bcryptRounds;

assert((bcryptRounds | 0) === bcryptRounds, 'password.bcryptRounds should be an integer');

function authenticate(credentials) {
	var username = credentials.username;
	var password = credentials.password;

	if (!username || !password) {
		return Promise.resolve({ failureType: username ? 'password' : 'username' });
	}

	return db.query('SELECT id, password_hash FROM users WHERE username = $1', [username]).then(function (result) {
		var user = result.rows[0];

		if (!user) {
			return { failureType: 'username' };
		}

		return new Promise(function (resolve, reject) {
			bcrypt.compare(password, user.password_hash, function (error, match) {
				if (error) {
					reject(error);
					return;
				}

				resolve(match ? { userId: user.id } : { failureType: 'password' });
			});
		});
	});
}

function create(credentials) {
	var username = credentials.username;
	var password = credentials.password;

	if (!username) {
		return Promise.reject(new Error('A username is required.'));
	}

	if (!password) {
		return Promise.reject(new Error('A password is required.'));
	}

	return new Promise(function (resolve, reject) {
		bcrypt.hash(password, bcryptRounds, function (error, hash) {
			if (error) {
				reject(error);
				return;
			}

			db.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id', [username, hash]).then(
				function (result) {
					resolve(result.rows[0].id);
				},
				reject
			);
		});
	});
}

module.exports.authenticate = authenticate;
module.exports.create = create;
