'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const cipher = require('./decipher.js');
var es = require("../es");

const {
  performance
} = require('perf_hooks');

module.exports = {
  voteProducer: voteProducer
};


function voteProducer(req, res) {
  var t0 = performance.now();
  var apiKey = req.headers.api_key;
  if (apiKey === null || apiKey === undefined || apiKey.length < 1) throw new Error("Invalid api_key!");

  var voter = req.swagger.params.body.value.voter;
  var producer = req.swagger.params.body.value.producer; //s.split(',');
  var sig = req.swagger.params.body.value.sig;
  console.log("voteProducer-req:voter:producer:sig=> " + voter + ":" + producer + ":" + sig);
  //decipher sig
  cipher.decryptXStrong(apiKey, sig).then(function (decipheredKey) {
    //voteproducer action
    eosapi.voteProducer(voter, '', [producer], decipheredKey[1]).then(function (result) {
      console.log("voteProducer-res => " + result);
      es.incrementNonce(apiKey, Number(decipheredKey[0]));
      var t1 = performance.now();
      es.auditAPIEvent(req, t1 - t0, true);
      res.json((result));
    }).catch(err => {
      console.log("Error in voteProducer:=>" + err);
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
  }).catch(err => {
    console.log("Error in voteProducer:=>" + err);
    var t2 = performance.now();
    es.auditAPIEvent(req, t2 - t0, false);
    var error = {
      statusCode: 500,
      message: err.message,
      code: 'voteProducer_error'
    };
    res.status(error.statusCode).json(error);
  });
}