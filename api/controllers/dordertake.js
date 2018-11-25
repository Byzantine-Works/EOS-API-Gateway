'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  ordertake: ordertake
};



function ordertake(req, res) {
  var t0 = performance.now();
  var orderId = req.swagger.params.body.value.orderId;
  var ordertake = {};
  ordertake.chain = "EOS";
  ordertake.source = "UberDEX";
  // ordertake.side = req.swagger.params.body.value.side
  ordertake.assetBuy = req.swagger.params.body.value.assetBuy;
  ordertake.assetSell = req.swagger.params.body.value.assetSell;

  ordertake.amountBuy = req.swagger.params.body.value.amountBuy;
  ordertake.amountSell = req.swagger.params.body.value.amountSell;
  ordertake.price = req.swagger.params.body.value.price;
  ordertake.type = 1; //market buy/sell
  ordertake.hash = req.swagger.params.body.value.hash;
  ordertake.taker = req.swagger.params.body.value.taker;
  ordertake.takerExchange = req.swagger.params.body.value.takerExchange;
  ordertake.makerExchange = req.swagger.params.body.value.makerExchange;
  ordertake.signature = req.swagger.params.body.value.signature;
  ordertake.takerFee = 0.02;
  ordertake.makerFee = 0.01;
  ordertake.feediscount = 2;

  console.log(" ordertake api call => orderId:" + orderId + " order:" + JSON.stringify(ordertake));
  es.orderTake(orderId, ordertake).then(function (order) {
    console.log('ordertake res => ' + JSON.stringify(order));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    var response = {};
    response.tradeId = order._id;
    response.result = order.result;
    response.transactionId = order.transactionId;
    response.blockNumber = order.blockNumber;
    res.json(response);
  }).catch(err => {
    console.log("Error in ordertake api:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'exchange_ordertake_error'
    };
    res.status(500).json(error);
  });
}