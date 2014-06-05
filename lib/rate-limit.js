'use strict';

var Promise = require('promise');
var Interval = require('./unit').Interval;
var redis = require('./redis');

var alreadyResponded = new (require('./respond').AlreadyResponded)();

function byAddress(count, interval_, action, identifier) {
	var key = 'rate:' + identifier;
	var interval = Interval.parse(interval_).seconds * 1000;

	var timers = {};

	return function rateLimited(request, response) {
		var remoteAddr = request.headers['x-forwarded-for'];

		if (!remoteAddr) {
			return action(request, response);
		}

		return redis.hincrby(key, remoteAddr, 1).then(function (error, value) {
			if (value > count) {
				response.writeHead(429, { 'Content-Type': 'text/plain' });
				response.end('Slow down!');
				return alreadyResponded;
			}

			if (timers.hasOwnProperty(remoteAddr)) {
				clearTimeout(timers[remoteAddr]);
			}

			timers[remoteAddr] = setTimeout(function () {
				delete timers[remoteAddr];
				redis.client.hset(key, remoteAddr, 0, function () {});
			}, interval);

			return action(request, response);
		});
	};
}

exports.byAddress = byAddress;
