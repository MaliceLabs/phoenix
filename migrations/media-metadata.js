'use strict';

var Promise = require('promise');

exports.base = 'media';

exports.up = function (query) {
	return Promise.resolve()
		.then(query("ALTER TABLE media ADD type VARCHAR NOT NULL"))
		.then(query("ALTER TABLE media ADD file_size INTEGER NOT NULL"))
		.then(query("ALTER TABLE media ADD width INTEGER"))
		.then(query("ALTER TABLE media ADD height INTEGER"));
};

exports.down = function (query) {
	return Promise.resolve()
		.then(query("ALTER TABLE user_media DROP type,\
		                                    DROP file_size,\
		                                    DROP width,\
		                                    DROP height"));
};
