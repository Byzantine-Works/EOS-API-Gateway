'use strict';
const eosapi = require('../eosapi.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  tokens: tokens
};

const indexName = 'symbols';
const indexType = "symbol";

function tokens(req, res) {
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