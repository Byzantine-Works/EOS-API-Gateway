'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  orderbyid: orderbyid
};


function orderbyid(req, res) {
  var t0 = performance.now();
  var orderId = req.swagger.params.orderId.value;
  console.log(" orderbyid api call => " + orderId);
  es.getOrderById(orderId).then(function (order) {
    console.log('orderbyid res => ' + JSON.stringify(order));

    //hide the hash for now
    order.hash="******************************";
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json(order);
  }).catch(err => {
    console.log("Error in orderbyid api:=>" + err);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'orderbyid_error'
    };
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(error);
  });
}