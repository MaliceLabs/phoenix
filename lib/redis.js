'use strict';

var redis = require('redis');
var client = redis.createClient();

client.on('error', console.error);

module.exports = client;
