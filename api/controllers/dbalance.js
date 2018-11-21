'use strict';
const es = require('../es.js');
const util = require('./util.js');
const exchangeapi = require('../../../UberDEX/test/uberdexapi');

const {
  performance
} = require('perf_hooks');

module.exports = {
  balance: balance
};

function balance(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  // es.getUserBalances(account).then(function (accounts) {
  es.getUserBalances(account).then(function (accounts) {
    console.log('exchange account response data => ' + (accounts));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    if (accounts.length == 0) {
      var error = {
        statusCode: 401,
        message: account + " user does not have an exchange account!",
        code: 'exchange_balance_error'
      };
      res.status(401).json(error);
    } else {
      res.json(accounts);
    }
  }).catch(err => {
    console.log("Error in balance:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}