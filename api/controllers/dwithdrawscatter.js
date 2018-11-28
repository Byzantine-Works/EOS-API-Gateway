'use strict';
const eosapi = require('../eosapi.js');
const exchangeapi = require('../../../UberDEX/test/uberdexapi');
const es = require('../es.js');
const config = require("../config");
var datetime = require('node-datetime');

const {
  performance
} = require('perf_hooks');

module.exports = {
  withdrawscatter: withdrawscatter
};

function withdrawscatter(req, res) {
  var t0 = performance.now();
  var user = req.swagger.params.body.value.user;
  var token = req.swagger.params.body.value.token;
  var amount = req.swagger.params.body.value.amount;
  var nonce = req.swagger.params.body.value.nonce;
  var headers = req.swagger.params.body.value.headers;
  var signature = req.swagger.params.body.value.signature;

  //Do we need token contract?
  console.log("withdrawscatter-req:user:token:amount:nonce:headers:signature => " + user + ":" + token + ":" + amount + ":" + nonce + ":" + headers + ":" + signature);

  //check for valid nonce
  es.getUserNonce(user).then(function (curNonce) {
    if (nonce != curNonce)
      throw new Error("Invalid nonce, replay attack detected!");
    exchangeapi.exOfflineWithdrawal(user, token, amount, nonce, headers, signature).then(function (result) {
      console.log("withdrawscatter-res => " + JSON.stringify(result));
      es.incrementUserNonce(user, Number(nonce + 1));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);

      //create a response object
      var response = {};
      response.result = "Success!";
      response.transactionId = result.processed.id;
      response.blockNumber = result.processed.block_num;

      // Add withdrawal record
      var withdrawal = {};
      withdrawal.transactionId = result.processed.id;
      withdrawal.blocknumber = result.processed.block_num;
      withdrawal.account = user;
      withdrawal.symbol = token;
      withdrawal.amount = parseFloat(amount);
      withdrawal.nonce = nonce;
      withdrawal.signature = signature;
      withdrawal.transactionheaders = headers;
      withdrawal.timestamp = datetime.create().epoch();
      withdrawal.created = datetime.create().format('Y-m-d H:M:S');
      withdrawal.updated = datetime.create().format('Y-m-d H:M:S');
      es.addWithdrawal(withdrawal);
      //return response
      res.json(response);
    }).catch(err => {
      console.log("Error in withdrawscatter:=>" + err);
      var error = {
        statusCode: 500,
        message: err.message,
        code: 'exchange_withdrawscatter_error'
      };
      var t2 = performance.now();
      es.auditAPIEvent(req, t2 - t0, false);
      res.status(500).json(error);
    });
  }).catch(err => {
    console.log("Error in getNonce() as part of withdrawscatter:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'exchange_withdrawscatter_error'
    };
    res.status(error.statusCode).json(error);
  });
}