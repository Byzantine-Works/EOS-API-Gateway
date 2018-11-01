'use strict';
const es = require('../es.js');
const util = require('./util.js');
const exchangeapi = require('../../../UberDEX/test/uberdexapi');

const {
  performance
} = require('perf_hooks');

module.exports = {
  chainbalance: chainbalance
};

function chainbalance(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  exchangeapi.getBalance(account, "EOS").then(function (balances) {
    console.log('account data => ' + JSON.stringify(balances));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    if (balances.length == 0) {
      var error = {
        statusCode: 401,
        message: account + " does not have any token balances!",
        code: 'chain_balance_error'
      };
      res.status(401).json(error);
    } else {
      res.json(balances);
    }
  }).catch(err => {
    console.log("Error in chainbalance:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}