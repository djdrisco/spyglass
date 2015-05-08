var async = require('async');
var AWS = require('aws-sdk');
var express = require('express');
var proxy = require('proxy-agent');
var https_proxy = require("https-proxy-agent");
var router = express.Router();

var settings = require("../settings.js");

if (process.env.HTTP_PROXY) {
  AWS.config.update({
    httpOptions: {agent: https_proxy(process.env.HTTPS_PROXY)}
  });
}

//////////////////////////////////////////////////////////////////////////////////////////

router.get('/vpcs', function(req, res) {
  collect_regions("describeVpcs", {}, function(err, data) {
    if (err) return console.error(err);
    res.send(data);
  });
});

router.get('/external_ips', function(req, res) {
  collect_regions("describeAddresses", {}, function(err, data) {
    if (err) return console.error(err);
    res.send(data);
  });
});

router.get('/instances', function(req, res) {
  collect_regions("describeInstances", {}, function(err, data) {
    if (err) return console.error(err);
    res.send(data);
  });
});

//////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

function collect_regions(action, params, callback) {
  async.map(settings.regions, function(region, cb) {
    var ec2 = new AWS.EC2({
      region: region,
      apiVersion: settings.apiVersion
    });
    ec2[action](params, function(err, data) {
      if (err) return cb(err);
      data.Region = region;
      cb(null, data);
    });
  }, callback);  
}
