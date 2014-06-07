'use strict';

var express = require('express');
var submissions = require('../controllers/submissions');
var promiseResponse = require('../lib/promise-response');

var router = new express.Router();

router.get('/new', promiseResponse.html(function (request) {
	if (request.query.submit) {
		return submissions.createForm(request);
	}

	return submissions.uploadForm(request);
}));

router.post('/', promiseResponse.html(submissions.create));

router.post('/media/', promiseResponse.html(submissions.upload));

module.exports = router;
