'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config.js");
const {
  performance
} = require('perf_hooks');
var es = require("../es.js");

module.exports = {
  getRefunds: getRefunds
};


function getRefunds(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;

  eosapi.getRefunds(account).then(function (result) {
    console.log("getRefunds-res => " + JSON.stringify(result));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(result);
  }, function (err) {
    console.log("Error in getRefunds:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(400).json(err);
  });
}