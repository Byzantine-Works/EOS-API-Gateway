'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  getAccount: getAccount
};


function getAccount(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  console.log("getAccount-req:account=> " + account);
  eosapi.getAccount(account).then(function (result) {
    console.log("getAccount-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(result);
  }, function (err) {
    console.log("Error in getAccount:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}