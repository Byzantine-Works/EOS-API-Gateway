'use strict';
const eosapi = require('../eosapi.js');
const cipher = require('./decipher.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  transferWithScatter: transferWithScatter
};


function transferWithScatter(req, res) {
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var from = req.swagger.params.body.value.from;
  var to = req.swagger.params.body.value.to;
  var amount = req.swagger.params.body.value.amount;
  var memo = req.swagger.params.body.value.memo;
  var sig = req.swagger.params.body.value.sig;
  var transactionHeaders = req.swagger.params.body.value.transactionHeaders;

  var contract = getContractForSymbol(amount);
  console.log("transferWithScatter-req:contract-from-to-amount-memo-sig-transactionHeaders=> " + contract + ":" + from + ":" + to + ":" + amount + ":" + memo + ":" + sig + ":" + transactionHeaders);
  //decipher sig
  cipher.decryptXStrong(apiKey, sig).then(function (decipheredKey) {
    //transferOffline action
    eosapi.transferOffline(contract, from, to, amount, memo, decipheredKey[1], transactionHeaders).then(function (result) {
      console.log("transferOffline-res => " + result);
      es.incrementNonce(apiKey, Number(decipheredKey[0]));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);
      res.json((result));
    }).catch(err => {
      console.log("Error in transferWithScatter:=>" + err);
      //TODO: @reddy rollbackNonce if method fails
      var t2 = performance.now();
      es.auditAPIEvent(req, t2 - t0, false);
      //TODO: @reddy fix the kluge below
      //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
      try {
        var error = JSON.parse(err);
        res.status(error.code).json(error);
      } catch (e) {
        res.status(400).json(err);
      }
    });
  }).catch(err => {
    console.log("Error in transfer:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'offlinetransfer_error'
    };
    res.status(error.statusCode).json(error);
  });
}

function getContractForSymbol(amount) {
  console.log("getContractForSymbol => " + amount);
  var tokenList = config.tokens;
  var symbol = amount.toString().split(' ')[1];
  for (var i = 0, len = tokenList.length; i < len; i++) {
    if (tokenList[i].symbol == symbol) {
      return tokenList[i].contract;
    }
  }
  throw new Error("Invalid token symbol " + symbol);
}