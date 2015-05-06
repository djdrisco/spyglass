var AWS = require('aws-sdk');
var express = require('express');
var proxy = require('proxy-agent');
var https_proxy = require("https-proxy-agent");
var router = express.Router();

if (process.env.HTTP_PROXY) {
  AWS.config.update({
    httpOptions: {agent: https_proxy(process.env.HTTPS_PROXY)}
  });
}

var ec2 = new AWS.EC2({
  region: 'us-east-1', 
  apiVersion: "2014-02-01"
});

router.get('/external_ips', function(req, res) {
  console.log("---");
  ec2.describeInstances({}, function(err, data) {
    if (err) console.error(err);
    console.log(">>>", data);
    res.send(data);
  });
});

module.exports = router;
