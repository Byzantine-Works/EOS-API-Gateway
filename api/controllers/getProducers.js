'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");

module.exports = {
  getProducers: getProducers
};


function getProducers(req, res) {
  console.log("getProducers-req:");
  eosapi.getProducers().then(function (result) {
    console.log("getProducers-res => " + result);
    res.json(result);
  }, function (err) {
    console.log("Error in getProducers:=>" + err);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}