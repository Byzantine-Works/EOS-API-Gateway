'use strict';
const eosapi = require('../eosapi.js');
const es = require('../es.js');
const cipher = require('./decipher.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');

module.exports = {
  transfer: transfer
};

function transfer(req, res) {
  console.log("req transfer: ", req.swagger.params.body.value)
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");
  //console.log("apiKey => "+ JSON.stringify(apiKey));

  var from = req.swagger.params.body.value.from;
  var to = req.swagger.params.body.value.to;
  var amount = req.swagger.params.body.value.amount;
  var memo = req.swagger.params.body.value.memo;
  var sig = req.swagger.params.body.value.sig;
  var contract = getContractForSymbol(amount);

  console.log("transfer-req:contract-from-to-amount-memo-sig=> " + contract + ":" + from + ":" + to + ":" + amount + ":" + memo + ":" + sig);
  //decipher sig
  cipher.decryptXStrong(apiKey, sig).then(function (decipheredKey) { 
    //transfer action
    eosapi.transfer(contract, from, to, amount, memo, decipheredKey[1]).then(function (result) {
      console.log("transfer-res => " + JSON.stringify(result));
      es.incrementNonce(apiKey, Number(decipheredKey[0]));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);
      res.json(result);
    }).catch(err => {
      console.log("Error in transfer:=>" + err);
      //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
      var t2 = performance.now();
      es.auditAPIEvent(req, t2 - t0, false);
      try {
        var error = JSON.parse(err);
        res.status(error.code).json(error);
      } catch (e) {
        res.status(400).json(err);
      }
    });
  }).catch(err => {
    console.log("Error in decypher transfer:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'transfer_error'
    };
    res.status(error.statusCode).json(error);
  });
}

function getContractForSymbol(amount) {
  console.log("getContractForSymbol => " + amount);
  var tokenList = config.tokens;
  var symbol = amount.toString().split(' ')[1];
  // var contract = lodash.filter(tokenList, x => x.symbol === symbol);
  // if (contract == null)
  //   throw new Error("Invalid token symbol ", symbol);
  // else
  //   return contract.contract;
  for (var i = 0, len = tokenList.length; i < len; i++) {
    if (tokenList[i].symbol == symbol) {
      return tokenList[i].contract;
    }
  }
  throw new Error("Invalid token symbol " + symbol);
}