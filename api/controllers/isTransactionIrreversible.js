'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  isTransactionIrreversible: isTransactionIrreversible
};

function isTransactionIrreversible(req, res) {
  var t0 = performance.now();
  var trxid = req.swagger.params.id.value;
  console.log("isTransactionIrreversible-req:=> " + trxid);
  eosapi.getTransaction(trxid).then(function (result) {
    console.log("isTransactionIrreversible-res => " + result);
    var transaction = {
      last_irreversible_block_num: result.last_irreversible_block,
      transaction_block_num: result.block_num,
      is_irreversible: result.last_irreversible_block >= result.block_num
    };
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(transaction);
  }, function (err) {
    console.log("Error in isTransactionIrreversible:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}

// function isTransactionIrreversible(req, res) {
//   var trxid = req.swagger.params.id.value;
//   let getData = new Promise((resolve, reject) => {
//     eosapi.getTransaction(trxid).then(function (result) {
//       var block_num = result.block_num;
//       resolve(block_num);
//     })
//   }).then(function (block_num) {
//     eosapi.getNodeInfo().then(function (result) {
//       var transaction = {
//         last_irreversible_block_num: result.last_irreversible_block_num,
//         transaction_block_num: block_num,
//         is_irreversible: result.last_irreversible_block_num >= block_num
//       }
//       console.log("isTransactionIrreversible-res => trx_block_num:current_block_num " + block_num + ":" + (result.last_irreversible_block_num));
//       res.json(transaction)
//     });
//   })
// }