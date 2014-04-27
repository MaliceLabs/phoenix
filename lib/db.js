'use strict';

var Promise = require('promise');
var pg = require('pg');
var config = require('../config');
var slice = Array.prototype.slice;

var connectionString = config.database;

function query() {
	var args = slice.call(arguments);

	return new Promise(function (resolve, reject) {
		pg.connect(connectionString, function (error, client, done) {
			if (error) {
				reject(error);
				return;
			}

			function callback(error, result) {
				done();

				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			}

			client.query.apply(client, args.concat(callback));
		});
	});
}

module.exports.query = query;
module.exports.pg = pg;
