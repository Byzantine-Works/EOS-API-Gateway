'use strict';
const eosapi = require('../eosapi.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  tokensByAccount: tokensByAccount
};

//local vars
var theTokenArray = [];
const indexName = 'symbols';
const indexType = "symbol";

function tokensByAccount(req, res) {
  var t0 = performance.now();
  theTokenArray = [];

  var pass = 0;
  var account = req.swagger.params.account.value;
  es.readIndex(indexName, indexType).then(function (symbols) {
    var tokenList = util.sanitizeSymbols(symbols);
    for (var i = 0, len = tokenList.length; i < len; i++) {
      //console.log("Processing contract => " + tokenList[i].contract + ":" + tokenList[i].symbol);
      //console.log("TokenList => " + JSON.stringify(tokenList));
      _getTokensByAccount(tokenList[i].contract, account, tokenList[i].symbol, tokenList[i].currency_precision, tokenList[i].hash).then(function (value) {
        pass += 1;
        if (pass === tokenList.length) {
          console.log("tokensByAccount=>count: " + theTokenArray.length); //+ " data:" + JSON.stringify(theTokenArray));        
          var t1 = performance.now();
          es.auditAPIEvent(req, t1 - t0, true);
          res.json(theTokenArray);
          //res.end();
        }
      }).catch(function (e) {
        console.log(e);
        console.log("Eror occured while processing account => " + account);
        var t2 = performance.now();
        es.auditAPIEvent(req, t2 - t0, false);
        var error = JSON.parse(e);
        res.status(error.code).json(error);
        //res.status(500).json(e);
      });
    }
  }).catch(err => {
    console.log("Error in tokensByAccount:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}

async function _getTokensByAccount(code, account, symbol, precision, hash) {
  const balance = await eosapi.getTokensByAccount(code, account, symbol);
  if (balance != undefined && balance.length != 0 && !isNaN(balance.toString().split(' ')[0])) {
    var balanceStr = balance.toString().split(' ')[0];
    var data = {
      account: account,
      contract: code,
      symbol: symbol,
      balance: balanceStr,
      precision: precision,
      hash: hash
      //balance: (balanceStr ? balanceStr : "0.0000")
    };
    //console.log("size is" + theTokenArray.length + " pushing...." + JSON.stringify(data));
    theTokenArray.push(data);
  }
}