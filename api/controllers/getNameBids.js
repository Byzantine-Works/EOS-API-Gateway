'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config.js");
const {
  performance
} = require('perf_hooks');
var es = require("../es.js");

module.exports = {
  getNameBids: getNameBids
};


function getNameBids(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;

  eosapi.getNameBids(account).then(function (result) {
    console.log("getNameBids-res => " + JSON.stringify(result));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(result);
  }, function (err) {
    console.log("Error in getNameBids:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(400).json(err);
  });
}