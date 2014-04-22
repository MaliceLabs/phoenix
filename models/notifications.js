'use strict';

var _ = require('lodash');
var Promise = require('promise');
var redis = require('../lib/redis');

function toInteger(obj) {
	return obj | 0;
}

var keys = ['submissions'];

function counts() {
	return new Promise(function (resolve, reject) {
		redis.hmget('notifications:username', keys, function (error, values) {
			if (error) {
				reject(error);
				return;
			}

			resolve({
				notifications: _.zipObject(keys, values.map(toInteger))
			});
		});
	});
}

module.exports.counts = counts;
