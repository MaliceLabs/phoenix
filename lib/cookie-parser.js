'use strict';

function parse(cookieHeader) {
	var cookies = {};
	var parts = cookieHeader.split('; ');

	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		var separatorIndex = part.indexOf('=');
		var name = part.substring(0, separatorIndex);
		var value = part.substring(separatorIndex + 1);

		if (value.charAt(0) === '"') {
			value = value.slice(1, -1);
		}

		cookies[name] = value;
	}

	return cookies;
}

function withCookies(request, response, next) {
	var cookieHeader = request.headers.cookie;
	request.cookies = cookieHeader ? parse(cookieHeader) : {};
	next();
}

exports.parse = parse;
exports.middleware = withCookies;
