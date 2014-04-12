'use strict';

var ENOTDIR = -20;

var fs = require('fs');
var path = require('path');
var util = require('util');
var events = require('events');
var Promise = require('promise');
var childProcess = require('child_process');

function cons(head, tail) {
	var list = [head];

	list.push.apply(list, tail);

	return list;
}

function TreeWatcher(directory) {
	var treeWatcher = this;

	function pass(event) {
		return function () {
			treeWatcher.emit.apply(treeWatcher, cons(event, arguments));
		};
	}

	fs.watch(directory, pass('change'));

	fs.readdir(directory, function (error, names) {
		if (error) {
			if (error.errno !== ENOTDIR) {
				treeWatcher.emit('error', error);
			}

			return;
		}

		names.forEach(function (name) {
			var subWatcher = new TreeWatcher(path.join(directory, name));

			subWatcher.on('error', pass('error'));
			subWatcher.on('change', pass('change'));
		});
	});
}

util.inherits(TreeWatcher, events.EventEmitter);

function SingleProcess() {
	this.last = Promise.resolve();
}

SingleProcess.prototype.spawn = function spawn(path, args, options) {
	return (this.last = this.kill('SIGINT').then(function () {
		return childProcess.spawn(path, args, options);
	}));
};

SingleProcess.prototype.kill = function kill(signal) {
	return (this.last = this.last.then(function (previous) {
		if (previous === undefined) {
			return Promise.resolve();
		}

		return new Promise(function (resolve) {
			previous.on('exit', function () {
				resolve();
			});

			previous.kill(signal);
		});
	}));
};

function limit(func, timeout) {
	var lastCall = 0;

	return function () {
		var now = Date.now();

		if (now - lastCall >= timeout) {
			lastCall = now;
			func.apply(this, arguments);
		}
	};
}

var p = new SingleProcess();

var spawnOptions = {
	cwd: __dirname,
	stdio: 'inherit'
};

function spawnServer() {
	p.spawn(process.execPath, process.execArgv.concat(['server']), spawnOptions);
}

function changed() {
	p.kill('SIGINT').then(spawnServer);
}

process.once('SIGINT', function () {
	p.kill('SIGINT').then(function () {
		process.exit(0);
	});
});

new TreeWatcher(__dirname).on('change', limit(changed, 100));

spawnServer();
