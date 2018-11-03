'use strict';
const ecc = require("eosjs-ecc");
const Eos = require("eosjs");

async function getActions(account) {
    var eos = Eos({
        eosVersion: '0f6695cb',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        httpEndpoint: 'http://127.0.0.1:8888',
        debug: false,
        verbose: false
    });
    console.log("scanner:getActions=> account:pos:offset  =>" + JSON.stringify(account));
    return await eos.getActions(
        'exchange',
        0,
        20
    );
}

getActions('exchange').then(function (result) {
    console.log("getActions-res => " + JSON.stringify(result));
}, function (err) {
    console.log("Error in getActions:=>" + err);
});