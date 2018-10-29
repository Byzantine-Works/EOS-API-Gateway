'use strict';
const es = require('../es.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  tradebook: tradebook
};

function tradebook(req, res) {
  var t0 = performance.now();
  var symbol = req.swagger.params.symbol.value;
  var size = req.swagger.params.size.value;
  if (size > 10000) throw new Error("Trades size cannot exceed 10000!");
  console.log(" tradebook api call => " + symbol + ":" + size);
  es.getTradeBook(symbol, size).then(function (trades) {
    //console.log('trade book data => ' + JSON.stringify(trades));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(trades);
  }).catch(err => {
    console.log("Error in tradebook:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}