'use strict';

var Promise = require('promise');
var util = require('util');
var crypto = require('crypto');
var stream = require('stream');
var fs = require('fs');
var path = require('path');
var db = require('../lib/db');
var config = require('../config');

var temporaryDirectory = path.join(__dirname, '../', config.temporaryDirectory);
var mediaDirectory = path.join(__dirname, '../public/media/');

function const_(obj) {
	return function () {
		return obj;
	};
}

function HashStream() {
	HashStream.super_.call(this);

	var resolveDigest;
	var hash = crypto.createHash('sha256');

	this.hash = hash;

	this.digest = new Promise(function (resolve) {
		resolveDigest = resolve;
	});

	this.on('finish', function () {
		this.hash = null;
		resolveDigest(hash.digest());
	});
}

util.inherits(HashStream, stream.Writable);

HashStream.prototype._write = function (chunk, encoding, callback) {
	this.hash.update(chunk, encoding);
	process.nextTick(callback);
};

function createUploadStream() {
	return new Promise(function (resolve, reject) {
		crypto.randomBytes(15, function (error, bytes) {
			if (error) {
				reject(error);
				return;
			}

			var tempPath = path.join(temporaryDirectory, bytes.toString('base64').replace(/\//g, '-'));
			var hashStream = new HashStream();
			var fileStream = fs.createWriteStream(tempPath, { flags: 'wx', mode: 6 << 6 });
			var uploadStream = new stream.PassThrough();

			uploadStream.pipe(hashStream);
			uploadStream.pipe(fileStream);

			var resolveUploaded;
			var rejectUploaded;

			uploadStream.uploaded = new Promise(function (resolve, reject) {
				resolveUploaded = resolve;
				rejectUploaded = reject;
			});

			uploadStream.on('end', function () {
				hashStream.digest.then(function (digest) {
					var hexDigest = digest.toString('hex');

					function getId(result) {
						return result.rows[0].id;
					}

					return db.query('INSERT INTO media (hash) VALUES ($1) RETURNING id', [hexDigest])
						.then(getId)
						.then(
							function (mediaId) {
								return new Promise(function (resolve, reject) {
									fs.rename(tempPath, path.join(mediaDirectory, hexDigest), function (error) {
										if (error) {
											reject(error);
										} else {
											resolve(mediaId);
										}
									});
								});
							},
							function (error) {
								return db.query('SELECT id FROM media WHERE hash = $1', [hexDigest])
									.then(getId)
									.catch(const_(Promise.reject(error)));
							}
						)
						.then(resolveUploaded, rejectUploaded);
				});
			});

			resolve(uploadStream);
		});
	});
}

function associate(user, mediaId, filename) {
	var mediaId_ = const_(mediaId);

	return db.query('INSERT INTO user_media (owner, media, name) VALUES ($1, $2, $3)', [user.id, mediaId, filename])
		.then(mediaId_, mediaId_);
}

module.exports.createUploadStream = createUploadStream;
module.exports.associate = associate;
