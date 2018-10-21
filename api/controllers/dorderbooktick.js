'use strict';
const es = require('../es.js');
const dexconfig = require('../dexconfig.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  orderbooktick: orderbooktick
};

const indexName = 'orders';
const indexType = "order";
const buyType = "BUY";
const sellType = "SELL";

function orderbooktick(req, res) {
  var t0 = performance.now();
  var symbol = req.swagger.params.symbol.value;
  var ticksize = req.swagger.params.ticksize.value;
  // if (size > 10000) throw new Error("Order size cannot exceed 10000!");
  console.log(" orderbooktick api call => " + symbol + ":" + ticksize);
  //TODO: pass ticksize and write an aggregation query for impl
  es.getOrderBookTick(symbol, ticksize).then(function (orders) {
    var asks = [];
    var bids = [];

    var askCount = orders.aggregations.asks_aggs.buckets[0].doc_count;
    for (var i = 0, len = orders.aggregations.asks_aggs.buckets[0].asks.buckets.length; i < len; i++) {
      var ask = {};
      ask.order_count = orders.aggregations.asks_aggs.buckets[0].asks.buckets[i].doc_count;
      ask.price = parseFloat(orders.aggregations.asks_aggs.buckets[0].asks.buckets[i].key.toFixed(7));
      ask.amountToSell = parseFloat(orders.aggregations.asks_aggs.buckets[0].asks.buckets[i].sumAmountSell.value.toFixed(4));
      asks.push(ask);
    }
    for (var i = 0, len = orders.aggregations.bids_aggs.buckets[0].bids.buckets.length; i < len; i++) {
      var bid = {};
      bid.order_count = orders.aggregations.bids_aggs.buckets[0].bids.buckets[i].doc_count;
      bid.price = parseFloat(orders.aggregations.bids_aggs.buckets[0].bids.buckets[i].key.toFixed(7));
      bid.amountToSell = parseFloat(orders.aggregations.bids_aggs.buckets[0].bids.buckets[i].sumAmountSell.value.toFixed(4));
      bids.push(bid);
    }
    // console.log("asks => " + asks);
    // console.log("bids => " + bids);
    var orderBookTick = {};
    orderBookTick.asks = asks;
    orderBookTick.bids = bids;

    //console.log('order book data => ' + JSON.stringify(orders));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(orderBookTick);
  }).catch(err => {
    console.log("Error in orderbooktick:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}