'use strict';
const eosapi = require('../eosapi.js');
const {
  performance
} = require('perf_hooks');
var es = require("../es.js");

module.exports = {
  getCurrencyStats: getCurrencyStats
};

function getCurrencyStats(req, res) {
  var apiKey = req.headers.api_key;
  var contract = req.swagger.params.contract.value;
  var symbol = req.swagger.params.symbol.value;

  var t0 = performance.now();
  eosapi.getCurrencyStats(contract, symbol).then(function (result) {
    console.log("getCurrencyStats:contract:symbol => " + JSON.stringify(result));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json((result));
  }, function (err) {
    console.log("Error in getCurrencyStats:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(400).json(err);
  });
}