'use strict';
const es = require('../es.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  orders: orders
};

const indexName = 'orders';
const indexType = "order";

function orders(req, res) {
  var t0 = performance.now();
  var symbol = req.swagger.params.symbol.value;
  var side = req.swagger.params.side.value;
  var size = req.swagger.params.size.value;
  console.log(" Orders api call => " + symbol + ":" + side + ":" + size);
  if ((side.toString().trim() !== 'BUY') && (side.toString().trim() !== 'SELL'))
    throw new Error("Orders support only BUY or SELL side!")
  es.getOrders(indexName, indexType, symbol, side, size).then(function (orders) {
    var order = util.sanitizeOrderData(orders.hits.hits);

    // console.log('order data => ' + JSON.stringify(order));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(order);
  }).catch(err => {
    console.log("Error in orders:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}