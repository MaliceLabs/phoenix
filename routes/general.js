'use strict';

var express = require('express');
var general = require('../controllers/general');
var promiseResponse = require('../lib/promise-response');

var router = new express.Router();

router.get('/', promiseResponse.html(general.home));

router.get('/support/terms', promiseResponse.html(general.terms));
router.get('/support/submission-agreement', promiseResponse.html(general.submissionAgreement));
router.get('/support/acceptable-upload-policy', promiseResponse.html(general.aup));

module.exports = router;
