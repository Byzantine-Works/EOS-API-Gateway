'use strict';
const es = require('../es.js');
const dexconfig = require('../dexconfig.js');
const util = require('./util.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  ticker: ticker
};

const indexName = 'tickers';
const indexType = "ticker";

function ticker(req, res) {
  var t0 = performance.now();
  var symbol = req.swagger.params.symbol.value;
  es.readIndex(indexName, indexType, symbol).then(function (tickers) {
    var ticker = util.sanitizeTickerData(tickers.hits.hits);
    //console.log('ticker data => ' + JSON.stringify(ticker));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(ticker);
  }).catch(err => {
    console.log("Error in ticker:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}