'use strict';
const eosapi = require('../eosapi.js');
const cipher = require('./decipher.js');
const config = require("../config");

module.exports = {
  transferWithScatter: transferWithScatter
};


function transferWithScatter(req, res) {
  var from = req.swagger.params.body.value.from;
  var to = req.swagger.params.body.value.to;
  var amount = req.swagger.params.body.value.amount;
  var memo = req.swagger.params.body.value.memo;
  var sig = cipher.decryptXStrong(req.swagger.params.body.value.sig);
  var transactionHeaders = req.swagger.params.body.value.transactionHeaders;

  var contract = getContractForSymbol(amount);
  console.log("transferWithScatter-req:contract-from-to-amount-memo-sig-transactionHeaders=> " + contract + ":" + from + ":" + to + ":" + amount + ":" + memo + ":" + sig + ":" + transactionHeaders);
  eosapi.transferOffline(contract, from, to, amount, memo, sig,transactionHeaders).then(function (result) {
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

// function getFromExtendedAsset(type, extendedAsset) {
//   // return extendedAsset decomposition based on type
//   // exampe extendedAsset looks like "1.0000 EOS@eosio.token"
//   console.log ("getFromExtendedAsset type:extendedAsset => " + type + ":" + extendedAsset);
//   if (extendedAsset !== 'undefined' && extendedAsset.length > 1) {
//     switch (type) {
//       case "amount":
//         return extendedAsset.split(' ')[0];
//       case "symbol":
//         var symbolAndContract = extendedAsset.split(' ')[1];
//         return 
//         return getContractForSymbol(symbolAndContract.split('@')[0])
//       case "contract":
//       var symbolAndContract = extendedAsset.split(' ')[1];
//       return getContractForSymbol(symbolAndContract.split('@')[1])
//     }
//     return extendedAsset.split(' ')[0];

//   } else
//     throw new Error("Token not recognized");
// }