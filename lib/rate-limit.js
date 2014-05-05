'use strict';

var Promise = require('promise');
var Interval = require('./interval').Interval;
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

		return new Promise(function (resolve, reject) {
			redis.hincrby(key, remoteAddr, 1, function (error, value) {
				if (error) {
					console.error('Couldn’t get key %s of %s:\n%s', remoteAddr, key, error.stack);
					action(request, response).then(resolve, reject);
					return;
				}

				if (value > count) {
					response.writeHead(429, { 'Content-Type': 'text/plain' });
					response.end('Slow down!');
					resolve(alreadyResponded);
				} else {
					action(request, response).then(resolve, reject);
				}

				if (timers.hasOwnProperty(remoteAddr)) {
					clearTimeout(timers[remoteAddr]);
				}

				timers[remoteAddr] = setTimeout(function () {
					delete timers[remoteAddr];
					redis.hset(key, remoteAddr, 0, function () {});
				}, interval);
			});
		});
	};
}

module.exports.byAddress = byAddress;
