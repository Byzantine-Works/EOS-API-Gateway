'use strict';
const es = require('../es.js');
const util = require('./util.js');

const {
  performance
} = require('perf_hooks');

module.exports = {
  exchangeadd: exchangeadd
};

function exchangeadd(req, res) {
  var t0 = performance.now();
  var exchange = {};
  exchange.chain = "EOS";
  exchange.name = req.swagger.params.body.value.name
  exchange.makerFee = req.swagger.params.body.value.makerFee;
  exchange.takerFee = req.swagger.params.body.value.takerFee;
  exchange.feeAccount = req.swagger.params.body.value.feeAccount;
  exchange.LDARenabled = req.swagger.params.body.value.LDARenabled;

  console.log(" exchangeadd api call => " + JSON.stringify(exchange));
  es.addExchange(exchange).then(function (exchangeResponse) {
    console.log('exchangeadd res => ' + JSON.stringify(exchangeResponse));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    var response = {};
    response.exchangeId = exchangeResponse._id;
    response.result = exchangeResponse.result;
    res.json(response);
  }).catch(err => {
    console.log("Error in exchangeadd api:=>" + err);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'exchange_exchangeadd_error'
    };
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    res.status(500).json(error);
  });
}