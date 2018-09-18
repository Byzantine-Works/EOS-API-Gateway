'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");

module.exports = {
  getBandwidth: getBandwidth
};


function getBandwidth(req, res) {
  var account = req.swagger.params.account.value;
  console.log("getBandwidth-req:=> " + account);
  eosapi.getBandwidth(account).then(function (result) {
    console.log("getBandwidth-res => " + result);
    res.status(200).json(result);
  }, function (err) {
    console.log("Error in getBandwidth:=>" + err);
    res.status(400).json(err);
  });
}