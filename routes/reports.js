var async = require('async');
var AWS = require('aws-sdk');
var express = require('express');
var proxy = require('proxy-agent');
var https_proxy = require("https-proxy-agent");
var router = express.Router();

var apiVersion = '2014-02-01';
var regions = ['us-east-1', 'us-west-1'];

if (process.env.HTTP_PROXY) {
  AWS.config.update({
    httpOptions: {agent: https_proxy(process.env.HTTPS_PROXY)}
  });
}

router.get('/external_ips', function(req, res) {
  collect_regions("describeAddresses", {}, function(err, data) {
    if (err) console.error(err);
    res.send(data);
  });
});

module.exports = router;

function collect_regions(action, params, callback) {
  async.map(regions, function(region, cb) {
    var ec2 = new AWS.EC2({
      region: region,
      apiVersion: apiVersion
    });
    ec2[action](params, function(err, data) {
      if (err) return cb(err);
      data.Region = region;
      cb(null, data);
    });
  }, callback);  
}