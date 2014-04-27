'use strict';

var express = require('express');
var submissions = require('../controllers/submissions');
var promiseResponse = require('../lib/promise-response');

var router = new express.Router();

router.get('/new', promiseResponse.html(submissions.creationForm));
router.post('/', promiseResponse.html(submissions.create));

module.exports = router;
