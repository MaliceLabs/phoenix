'use strict';

var express = require('express');
var authentication = require('../controllers/authentication');
var promiseResponse = require('../lib/promise-response');

var router = new express.Router();

router.route('/login')
	.get(promiseResponse.html(authentication.loginForm))
	.post(promiseResponse.html(authentication.login));

router.route('/logout')
	.post(promiseResponse.html(authentication.logout));

module.exports = router;
