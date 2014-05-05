'use strict';

var byteSizes = {
	byte: 1,
	bytes: 1,
	KiB: 1 << 10,
	MiB: 1 << 20,
	GiB: 1 << 30,
};

var sortedSizes = Object.keys(byteSizes)
	.map(function (key) {
		return { key: key, value: byteSizes[key] };
	})
	.sort(function (a, b) {
		return b.value - a.value;
	})
	.slice(0, -2);

var BYTE_SIZE_STRING = new RegExp('^\\s*(\\d+(?:\\.\\d*)?|\\.\\d+)\\s+(' + Object.keys(byteSizes).join('|') + ')\\s*$');

function ByteSize(bytes) {
	this.bytes = bytes;
}

ByteSize.parse = function (byteSizeString) {
	var match = BYTE_SIZE_STRING.exec(byteSizeString);

	if (!match) {
		throw new SyntaxError('Couldn’t parse ' + JSON.stringify(byteSizeString) + ' as a byte size.');
	}

	return new ByteSize(Math.floor(match[1] * byteSizes[match[2]]));
};

ByteSize.prototype.toString = function () {
	var bytes = this.bytes;

	for (var i = 0; i < sortedSizes.length; i++) {
		var size = sortedSizes[i];

		if (bytes >= size.value) {
			return (bytes / size.value).toFixed(1) + ' ' + size.key;
		}
	}

	return bytes + (bytes === 1 ? ' byte' : ' bytes');
};

exports.ByteSize = ByteSize;
