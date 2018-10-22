'use strict';
const eosapi = require('../eosapi.js');
const exchangeapi = require('../../../UberDEX/test/uberdexapi');
const es = require('../es.js');
const cipher = require('./decipher.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');

module.exports = {
  deposit: deposit
};

function deposit(req, res) {
  console.log("req deposit: ", req.swagger.params.body.value)
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");
  //console.log("apiKey => "+ JSON.stringify(apiKey));

  var from = req.swagger.params.body.value.from;
  var amount = req.swagger.params.body.value.amount;
  var sig = req.swagger.params.body.value.sig;
  var contract = getContractForSymbol(amount);

  console.log("deposit-req:contract-from-amount-sig=> " + contract + ":" + from + ":" + amount + ":" + sig);
  //decipher sig
  cipher.decryptXStrong(apiKey, sig).then(function (decipheredKey) {
    //deposit action
    //TODO Add a check for depositing only accepted tokens

    exchangeapi.exdeposit(contract, from, amount, decipheredKey[1], decipheredKey[0]).then(function (result) {
      console.log("exdeposit-res => " + JSON.stringify(result));
      es.incrementNonce(apiKey, Number(decipheredKey[0]));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);
      res.json(result);
    }).catch(err => {
      console.log("Error in exdeposit:=>" + err);
      var error = {
        statusCode: 500,
        message: err.message,
        code: 'exchange_deposit_error'
      };
      var t2 = performance.now();
      es.auditAPIEvent(req, t2 - t0, false);
      res.status(500).json(error);
    });
  }).catch(err => {
    console.log("Error in decypher deposit:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'exchange_deposit_error'
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