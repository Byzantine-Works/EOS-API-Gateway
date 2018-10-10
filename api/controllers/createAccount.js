'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config.js");
const cipher = require('./decipher.js');
var es = require("../es.js");

const {
  performance
} = require('perf_hooks');


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
  var sig = req.swagger.params.body.value.sig;
  console.log("createAccount-req:creator:name:owner:active:sig=> " + creator + ":" + name + ":" + owner + ":" + active + ":" + sig);
  //decipher sig
  cipher.decryptXStrong(apiKey, sig).then(function (decipheredKey) {
    //createAccount action
    eosapi.createAccount(creator, name, owner, active, decipheredKey[1]).then(function (result) {
      console.log("createAccount-res => " + result);
      es.incrementNonce(apiKey, Number(decipheredKey[0]));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);
      res.json((result));
    }).catch(err => {
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
  }).catch(err => {
    console.log("Error in createAccount:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'createAccount_error'
    };
    res.status(error.statusCode).json(error);
  });
}