'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  ordercancel: ordercancel
};


function ordercancel(req, res) {
  var t0 = performance.now();
  var orderId = req.swagger.params.body.value.orderId;
  var orderHash = req.swagger.params.body.value.orderHash;

  //TODO check for orderhash and the user signature recovery before executing cancel

  console.log(" ordercancel api call => orderId:orderHash" + orderId + ":" + orderHash);
  es.orderCancel(orderId, orderHash).then(function (order) {
    console.log('ordercancel res => ' + JSON.stringify(order));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    var response = {};
    response.orderId = order._id;
    response.result = order.result;
    res.json(response);
    
  }).catch(err => {
    console.log("Error in ordercancel api:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'exchange_ordercancel_error'
    };
    res.status(error.statusCode).json(error);
  });
}