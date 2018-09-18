'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");

module.exports = {
  getAccount: getAccount
};


function getAccount(req, res) {
  var account = req.swagger.params.account.value;
  console.log("getAccount-req:account=> " + account);
  eosapi.getAccount(account).then(function (result) {
    console.log("getAccount-res => " + result);
    res.json(result);
  }, function (err) {
    console.log("Error in getAccount:=>" + err);
    //var error = JSON.parse(err);
    //var error = err.replace(/"code":500/g, '"code":"500"');
    //console.log("Sanitized Err transfer:=>" + error);
    //res.status(error.code).json(error);
    res.status(400).json(err);
  });
}