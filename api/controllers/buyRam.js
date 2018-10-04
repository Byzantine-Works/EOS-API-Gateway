'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const cipher = require('./decipher.js');
const {
  performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
  buyRam: buyRam
};


function buyRam(req, res) {
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var payer = req.swagger.params.body.value.payer;
  var receiver = req.swagger.params.body.value.receiver;
  var quant = req.swagger.params.body.value.quant;
  var sig = cipher.decryptXStrong(apiKey, req.swagger.params.body.value.sig);
  console.log("buyRam-req:payer:receiver:quant:sig=> " + payer + ":" + receiver + ":" + quant + ":" + sig);
  eosapi.buyRam(payer, receiver, quant, sig).then(function (result) {
    console.log("buyRam-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json((result));
  }, function (err) {
    console.log("Error in buyRam:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
    try {
      var error = JSON.parse(err);
      res.status(error.code).json(error);
    } catch (e) {
      res.status(400).json(err);
    }
  });
}