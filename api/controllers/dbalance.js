'use strict';
const es = require('../es.js');
const dexconfig = require('../dexconfig.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  balance: balance
};

function balance(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  es.getUserBalances(account).then(function (accounts) {
    console.log('account data => ' + JSON.stringify(accounts));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(accounts);
  }).catch(err => {
    console.log("Error in balance:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}