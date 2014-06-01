'use strict';

var cookie = require('cookie');

function withCookies(request, response, next) {
	var cookieHeader = request.headers.cookie;
	request.cookies = cookieHeader ? cookie.parse(cookieHeader) : {};
	next();
}

exports.middleware = withCookies;
