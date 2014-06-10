'use strict';

var unorm = require('unorm');

var AMPERSAND = /&/g;
var SLUG_PART = /[a-z0-9]+/g;

function slugFor(text) {
	return unorm.nfd(text.toLowerCase().replace(AMPERSAND, ' and ')).match(SLUG_PART).join('-');
}

exports.slugFor = slugFor;
