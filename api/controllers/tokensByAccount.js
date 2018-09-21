'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");

module.exports = {
  tokensByAccount: tokensByAccount
};
var theTokenArray = [];

function tokensByAccount(req, res) {
  theTokenArray = [];
  var tokenList = config.tokensA;

  var pass = 0;
  var account = req.swagger.params.account.value;
  for (var i = 0, len = tokenList.length; i < len; i++) {
    //console.log("Processing contract => " + tokenList[i].contract + ":" + tokenList[i].symbol);
    //console.log("TokenList => " + JSON.stringify(tokenList));
    _getTokensByAccount(tokenList[i].contract, account, tokenList[i].symbol).then(function (value) {
      pass += 1;
      if (pass === tokenList.length) {
        console.log("tokensByAccount=>count: " + theTokenArray.length); //+ " data:" + JSON.stringify(theTokenArray));        
        res.json(theTokenArray);
        //res.end();
      }
    }).catch(function (e) {
      console.log(e);
      console.log("Eror occured while processing account => " + account);
      var error = JSON.parse(e);
      res.status(error.code).json(error);
      //res.status(500).json(e);
    });
  }
}

async function _getTokensByAccount(code, account, symbol) {
  const balance = await eosapi.getTokensByAccount(code, account, symbol);
  if (balance != undefined && balance.length != 0) {
    var balanceStr = balance.toString().split(' ')[0];
    var data = {
      account: account,
      contract: code,
      symbol: symbol,
      balance: (balanceStr ? balanceStr : "0.0000")
    };
    //console.log("size is" + theTokenArray.length + " pushing...." + JSON.stringify(data));
    theTokenArray.push(data);
  }
}