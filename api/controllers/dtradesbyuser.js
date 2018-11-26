'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  tradesbyuser: tradesbyuser
};


function tradesbyuser(req, res) {
  var t0 = performance.now();
  var user = req.swagger.params.user.value;
  console.log(" tradesbyuser api call => " + user);
  es.getTradesByUser(user).then(function (order) {
    console.log('ordersbyuser res => ' + JSON.stringify(order));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(order);
  }).catch(err => {
    console.log("Error in tradesbyuser api:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(err);
  });
}