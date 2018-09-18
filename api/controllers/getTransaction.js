'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");

module.exports = {
  getTransaction: getTransaction
};


function getTransaction(req, res) {
  var trxid = req.swagger.params.id.value;
  console.log("getTransaction-req:=> " + trxid);
  eosapi.getTransaction(trxid).then(function (result) {
    console.log("getTransaction-res => " + result);
    res.json(result);
  }, function (err) {
    console.log("Error in getTransaction:=>" + err);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}