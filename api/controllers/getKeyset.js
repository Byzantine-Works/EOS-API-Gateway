'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const {
    performance
} = require('perf_hooks');
var es = require("../es");

module.exports = {
    getKeyset: getKeyset
};


function getKeyset(req, res) {
    var t0 = performance.now();
    console.log("getKeyset-req");
    eosapi.createKeyset().then(function (result) {
        console.log("getKeyset-res => " + result);
        var t1 = performance.now();
        es.auditAPIEvent(req, t1 - t0, true);
        res.json(result);
    }, function (err) {
        console.log("Error in getKeyset:=>" + err);
        var t2 = performance.now();
        es.auditAPIEvent(req, t2 - t0, false);
        res.status(400).json(err);
    });
}