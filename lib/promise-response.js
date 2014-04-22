'use strict';

var view = require('./view');

var errorTemplate = view.templateLoader.load('error');

function responseHtml(callback) {
	return function (request, response) {
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
		);
	};
}

module.exports.html = responseHtml;
