'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  nonce: nonce
};

function nonce(req, res) {
  var t0 = performance.now();
  var account = req.swagger.params.account.value;
  es.getUserNonce(account).then(function (nonce) {
    console.log('getUserNonce response data => ' + (nonce));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    if (nonce == null) {
      var error = {
        statusCode: 401,
        message: account + " user does not have an exchange account!",
        code: 'exchange_userbalance_nonce_error'
      };
      res.status(401).json(error);
    } else {
      var noncePayload = {
        nonce: nonce,
        account: account
      };
      res.json(noncePayload);
    }
  }).catch(err => {
    console.log("Error in getUserNonce:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 401,
      message: err.message,
      code: 'exchange_userbalance_nonce_error'
    };
    res.status(500).json(error);
  });
}