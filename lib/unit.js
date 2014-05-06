'use strict';

function unit(baseUnit, scale) {
	var nameMap = {};

	scale.sort(function (a, b) {
		return b.magnitude - a.magnitude;
	});

	scale.forEach(function (item) {
		nameMap[item.plural] = item.magnitude;
		nameMap[item.singular] = item.magnitude;
	});

	function Unit(value) {
		this[baseUnit] = value;
	}

	Unit.parse = function parseUnit(unitString) {
		var parts = unitString.split(' ');
		var count = +parts[0];
		var unit = parts[1];

		if (count !== count || !nameMap.hasOwnProperty(unit)) {
			throw new Error('Could not parse ' + JSON.stringify(unitString) + ' as ' + baseUnit + '.');
		}

		return new Unit(count * nameMap[unit]);
	};

	Unit.prototype.toString = function (precision) {
		var value = this[baseUnit];
		var count;
		var item;
		var i;

		for (i = 0; i < scale.length; i++) {
			item = scale[i];

			if (value >= item.magnitude) {
				break;
			}
		}

		item = scale[i];
		count = (value / item.magnitude).toFixed(precision);

		return count + ' ' + (+count === 1 ? item.singular : item.plural);
	};

	return Unit;
}

exports.ByteSize = unit('bytes', [
	{ magnitude: 1 << 30, singular: 'GiB',  plural: 'GiB'   },
	{ magnitude: 1 << 20, singular: 'MiB',  plural: 'MiB'   },
	{ magnitude: 1 << 10, singular: 'KiB',  plural: 'KiB'   },
	{ magnitude: 1,       singular: 'byte', plural: 'bytes' }
]);

exports.Interval = unit('seconds', [
	{ magnitude: 86400 * 365, singular: 'year',   plural: 'years'   },
	{ magnitude: 86400 * 30,  singular: 'month',  plural: 'months'  },
	{ magnitude: 86400,       singular: 'day',    plural: 'days'    },
	{ magnitude: 3600,        singular: 'hour',   plural: 'hours'   },
	{ magnitude: 60,          singular: 'minute', plural: 'minutes' },
	{ magnitude: 1,           singular: 'second', plural: 'seconds' }
]);
