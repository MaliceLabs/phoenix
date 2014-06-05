'use strict';

var _ = require('lodash');
var Promise = require('promise');
var redis = require('../lib/redis');

function toInteger(obj) {
	return obj | 0;
}

var keys = ['submissions', 'comments', 'journals', 'streams', 'watches', 'notes'];

function counts(request) {
	if (!request.user.id) {
		return Promise.resolve(null);
	}

	return redis.hmget('notifications:' + request.user.id, keys).then(function (values) {
		return {
			notifications: _.zipObject(keys, values.map(toInteger))
		};
	});
}

exports.counts = counts;
