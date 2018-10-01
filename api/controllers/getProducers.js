'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  getProducers: getProducers
};


function getProducers(req, res) {
  var t0 = performance.now();
  console.log("getProducers-req:");
  eosapi.getProducers().then(function (result) {
    console.log("getProducers-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(result);
  }, function (err) {
    console.log("Error in getProducers:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}