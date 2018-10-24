'use strict';
const es = require('../es.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  symbols: symbols
};

const indexName = 'symbols';
const indexType = "symbol";

function symbols(req, res) {
  var t0 = performance.now();
  es.readIndex(indexName, indexType).then(function (symbols) {
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(util.sanitizeSymbols(symbols));
  }).catch(err => {
    console.log("Error in symbols:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}