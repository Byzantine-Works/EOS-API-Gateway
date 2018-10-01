'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  getBandwidth: getBandwidth
};


function getBandwidth(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  console.log("getBandwidth-req:=> " + account);
  eosapi.getBandwidth(account).then(function (result) {
    console.log("getBandwidth-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.status(200).json(result);
  }, function (err) {
    console.log("Error in getBandwidth:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(400).json(err);
  });
}