'use strict';

var express = require('express');
var general = require('../controllers/general');
var promiseResponse = require('../lib/promise-response');

var router = new express.Router();

router.get('/', promiseResponse.html(general.home));

module.exports = router;
