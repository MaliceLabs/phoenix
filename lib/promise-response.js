'use strict';

var view = require('./view');

var errorTemplate = view.templateLoader.load('error');

function responseHtml(callback) {
	if (typeof callback !== 'function') {
		throw new TypeError('Expected a function.');
	}

	return function (request, response, next) {
		callback(request, response).then(
			function (responseOrBody) {
				if (responseOrBody.respond) {
					responseOrBody.respond(request, response);
					return;
				}

				response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				response.end(responseOrBody);
			},
			function (error) {
				response.writeHead(error.statusCode || 500, { 'Content-Type': 'text/html; charset=utf-8' });
				response.end(errorTemplate(error));
			}
		).catch(next);
	};
}

exports.html = responseHtml;
