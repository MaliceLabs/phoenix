'use strict';

var byteSizes = {
	byte: 1,
	bytes: 1,
	KiB: 1 << 10,
	MiB: 1 << 20,
	GiB: 1 << 30,
};

var BYTE_SIZE_STRING = new RegExp('^\\s*(\\d+(?:\\.\\d*)?|\\.\\d+)\\s+(' + Object.keys(byteSizes).join('|') + ')\\s*$');

function ByteSize(byteSizeString) {
	var match = BYTE_SIZE_STRING.exec(byteSizeString);

	if (!match) {
		throw new SyntaxError('Couldn’t parse ' + JSON.stringify(byteSizeString) + ' as a byte size.');
	}

	this.bytes = Math.floor(match[1] * byteSizes[match[2]]);
}

module.exports.ByteSize = ByteSize;
