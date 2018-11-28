'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  ordermake: ordermake
};



function ordermake(req, res) {
  var t0 = performance.now();
  var ordermake = {};
  ordermake.chain = "EOS";
  ordermake.source = "UberDEX";
  ordermake.side = req.swagger.params.body.value.side
  ordermake.assetBuy = req.swagger.params.body.value.assetBuy;
  ordermake.assetSell = req.swagger.params.body.value.assetSell;
  ordermake.signature = req.swagger.params.body.value.signature;

  ordermake.amountBuy = req.swagger.params.body.value.amountBuy;
  ordermake.amountSell = req.swagger.params.body.value.amountSell;
  ordermake.price = req.swagger.params.body.value.price;
  ordermake.expires = req.swagger.params.body.value.expires;
  ordermake.type = req.swagger.params.body.value.type; //1 for market and 2 for limit
  ordermake.hash = req.swagger.params.body.value.hash;
  ordermake.useraccount = req.swagger.params.body.value.useraccount;
  ordermake.filled = 2;
  ordermake.cancelled = 2;
  ordermake.new = 1;
  ordermake.feediscount = 2;

  console.log(" ordermake api call => " + JSON.stringify(ordermake));
  es.orderMake(ordermake).then(function (order) {
    console.log('order book res => ' + JSON.stringify(order));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    var response = {};
    response.orderId = order._id;
    response.result = order.result;
    res.json(response);
  }).catch(err => {
    console.log("Error in makeorder api:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}