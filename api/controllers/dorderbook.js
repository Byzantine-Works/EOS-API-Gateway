'use strict';
const es = require('../es.js');
const dexconfig = require('../dexconfig.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  orderbook: orderbook
};

const indexName = 'orders';
const indexType = "order";
const buyType = "BUY";
const sellType = "SELL";

function orderbook(req, res) {
  var t0 = performance.now();
  var symbol = req.swagger.params.symbol.value;
  var size = req.swagger.params.size.value;
  var ticksize=req.swagger.params.ticksize.value;
  if (size > 10000) throw new Error("Order size cannot exceed 10000!");
  console.log(" orderbook api call => " + symbol + ":" + ticksize + ":" + size);
  //TODO: pass ticksize and write an aggregation query for impl
  es.getOrderBook(indexName, indexType, symbol, size).then(function (orders) {
    //console.log('order book data => ' + JSON.stringify(orders));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(orders);
  }).catch(err => {
    console.log("Error in orderbook:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}