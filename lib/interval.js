'use strict';

var seconds = {
	millisecond: 0.001,
	// please do not complain about centiseconds and deciseconds
	second: 1,
	minute: 60,
	hour: 3600,
	day: 86400,
	month: 86400 * 30,
	year: 86400 * 365,
};

var INTERVAL_STRING = new RegExp('^\\s*(\\d+(?:\\.\\d*)?|\\.\\d+)\\s+(' + Object.keys(seconds).join('|') + ')s?\\s*$', 'i');

function Interval(seconds) {
	this.seconds = seconds;
}

Interval.parse = function (intervalString) {
	var match = INTERVAL_STRING.exec(intervalString);

	if (!match) {
		throw new SyntaxError('Couldn’t parse ' + JSON.stringify(intervalString) + ' as a time interval.');
	}

	return new Interval(match[1] * seconds[match[2].toLowerCase()]);
};

exports.Interval = Interval;
