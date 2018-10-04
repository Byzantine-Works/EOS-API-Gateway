'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config.js");
const cipher = require('./decipher.js');
const {
  performance
} = require('perf_hooks');
var es = require("../es.js");


module.exports = {
  delegate: delegate
};


function delegate(req, res) {
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var from = req.swagger.params.body.value.from;
  var receiver = req.swagger.params.body.value.receiver;
  var net = req.swagger.params.body.value.net;
  var cpu = req.swagger.params.body.value.cpu;
  var sig = cipher.decryptXStrong(apiKey, req.swagger.params.body.value.sig);
  console.log("delegate-req:from:receiver:net:cpu:sig=> " + from + ":" + receiver + ":" + net + ":" + cpu + ":" + sig);
  eosapi.delegate(from, receiver, net, cpu, sig).then(function (result) {
    console.log("delegate-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json((result));
  }, function (err) {
    console.log("Error in delegate:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
    try {
      var error = JSON.parse(err);
      res.status(error.code).json(error);
    } catch (e) {
      res.status(400).json(err);
    }
  });
}