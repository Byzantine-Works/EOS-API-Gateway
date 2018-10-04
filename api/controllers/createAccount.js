'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config.js");
const cipher = require('./decipher.js');
const {
  performance
} = require('perf_hooks');
var es = require("../es.js");


module.exports = {
  createAccount: createAccount
};


function createAccount(req, res) {
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var creator = req.swagger.params.body.value.creator;
  var name = req.swagger.params.body.value.name;
  var owner = req.swagger.params.body.value.owner;
  var active = req.swagger.params.body.value.active;
  var sig = cipher.decryptXStrong(apiKey, req.swagger.params.body.value.sig);
  console.log("createAccount-req:creator:name:owner:active:sig=> " + creator + ":" + name + ":" + owner + ":" + active + ":" + sig);
  eosapi.createAccount(creator, name, owner, active, sig).then(function (result) {
    console.log("createAccount-res => " + result);
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json((result));
  }, function (err) {
    console.log("Error in createAccount:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    try {
      var error = JSON.parse(err);
      res.status(error.code).json(error);
    } catch (e) {
      res.status(400).json(err);
    }
  });
}