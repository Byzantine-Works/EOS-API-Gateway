'use strict';
const es = require('../es.js');
const dexconfig = require('../dexconfig.js');
const {
  performance
} = require('perf_hooks');

module.exports = {
  symbols: symbols
};

function symbols(req, res) {
  var t0 = performance.now();
  var t1 = performance.now();
  es.auditAPIEvent(req, t1 - t0, true);
  res.json(dexconfig.symbols);
}