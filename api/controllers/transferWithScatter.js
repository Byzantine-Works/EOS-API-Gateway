'use strict';
const eosapi = require('../eosapi.js');
const cipher = require('./decipher.js');
const config = require("../config");

module.exports = {
  transferWithScatter: transferWithScatter
};


function transferWithScatter(req, res) {
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var from = req.swagger.params.body.value.from;
  var to = req.swagger.params.body.value.to;
  var amount = req.swagger.params.body.value.amount;
  var memo = req.swagger.params.body.value.memo;
  var sig = cipher.decryptXStrong(apiKey, req.swagger.params.body.value.sig);
  var transactionHeaders = req.swagger.params.body.value.transactionHeaders;

  var contract = getContractForSymbol(amount);
  console.log("transferWithScatter-req:contract-from-to-amount-memo-sig-transactionHeaders=> " + contract + ":" + from + ":" + to + ":" + amount + ":" + memo + ":" + sig + ":" + transactionHeaders);
  eosapi.transferOffline(contract, from, to, amount, memo, sig, transactionHeaders).then(function (result) {
    console.log("transfer-res => " + result);
    res.json((result));
  }, function (err) {
    console.log("Error in transferWithScatter:=>" + err);
    //TODO: @reddy rollbackNonce if method fails

    //TODO: @reddy fix the kluge below
    //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
    try {
      var error = JSON.parse(err);
      res.status(error.code).json(error);
    } catch (e) {
      res.status(400).json(err);
    }
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