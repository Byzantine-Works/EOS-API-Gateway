'use strict';
const eosapi = require('../eosapi.js');
const cipher = require('./cipher.js');
const config = require("../config");

module.exports = {
  transfer: transfer
};


function transfer(req, res) {
  var from = req.swagger.params.body.value.from;
  var to = req.swagger.params.body.value.to;
  var amount = req.swagger.params.body.value.amount;
  var memo = req.swagger.params.body.value.memo;
  var sig = cipher.decryptXStrong(req.swagger.params.body.value.sig);
  var contract = getContractForSymbol(amount);

  console.log("transfer-req:contract-from-to-amount-memo-sig=> " + contract + ":" + from + ":" + to + ":" + amount + ":" + memo + ":" + sig);
  eosapi.transfer(contract, from, to, amount, memo, sig).then(function (result) {
    console.log("transfer-res => " + result);
    //res.status(200).send(result /*JSON.stringify(data,null,2)*/ );
    //res.end();
    //res.json(util.format(result));
    res.json((result));
  }, function (err) {
    console.log("Error in transfer:=>" + err);
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
  var tokenList = config.tokensA;
  var symbol = amount.toString().split(' ')[1];
  var contract;
  for (var i = 0, len = tokenList.length; i < len; i++) {
    if (tokenList[i].symbol == symbol) {
      return tokenList[i].contract;
    }
  }
}