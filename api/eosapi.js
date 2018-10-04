'use strict';
require("dotenv").config();
const config = require("./config");
const ecc = require("eosjs-ecc");
const eosapiram = require("commander");
const BN = require("bignumber.js");
const Eos = require("eosjs");
const assert = require('assert');

//setup basic LB acros low-latent BP's (via persist/monitoring)
//Use the chosen one for eos onchain interactions
var eos = Eos(loadBalance());
//console.log("eos node config =>" + JSON.stringify(eos.fc.types.config, null, 4));
//console.log("eos http endpoint => " + eos.fc.types.config.httpEndpoint);

//Contract defs
const eosTokenContract = config.contracts.eosTokenContract;

/*
options = {
  authorization: ["reddy@active", "eosio.token@active"],
  broadcast: true,
  sign: true
};*/

const uint64_size = 8;
var {
    format
} = Eos.modules;


async function getNodeInfo() {
    eos = Eos(loadBalance());
    //console.log("eosapi:getNodeInfo:config=>" + JSON.stringify(eos));
    return await eos.getInfo({});
    // eos.getInfo({},function (err, data) {
    //     if (err) {
    //         log("/getNodeInfo err=> " + err);
    //         //res.status(400).send(err);
    //     } else {
    //         log("/getNodeInfo => " + JSON.stringify(data));
    //         //res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
    //         //res.end();
    //     }
    // });
}

async function getAllCurrentAirDropTokens() {
    console.log("eosapi:getAllCurrentAirDropTokens=> count:" + config.tokens.length); //+ " data:" + JSON.stringify(config.tokens));
    var tokens = config.tokens;
    for (var i = tokens.length; i--;) {
        var token = tokens[i];
        //console.log("TOKEN IS " + JSON.stringify(token));
        //delete token.contract;
        //token.splice(2, 1);
    }
    return tokens;
}

async function getTokensByAccount(code, account, symbol) {
    eos = Eos(loadBalance());
    var request = {};
    console.log("eosapi:getTokensByAccount=> contract:account:symbol =>" + JSON.stringify(code) + " : " + JSON.stringify(account) + " : " + JSON.stringify(symbol));
    return await eos.getCurrencyBalance({
        code,
        account,
        symbol
    }).catch(function (e) {
        //console.log("eosapi:getTokensByAccount:err=>" + e);
        //next(err);
    });
}

async function transfer(code, from, to, amount, memo, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:transferin with key: =>" + eos.fc.types.config.keyProvider);
    console.log("eosapi:transfer=> contract:from:to:amount:memo  =>" + JSON.stringify(code) + " : " + JSON.stringify(from) + " : " + JSON.stringify(to) + " : " + JSON.stringify(amount) + " : " + JSON.stringify(memo) + " : " + JSON.stringify(sig));
    var trxDeposit = await eos.transaction(code, contractuser => {
        contractuser.transfer({
            from: from,
            to: to,
            quantity: amount,
            memo: memo
        }, {
            authorization: [from]
            //authorization:[{ actor: account, permission:'active' }]
        });
    });
    console.log("eosapi:transfer=> " + JSON.stringify(trxDeposit));
    return (trxDeposit);
}

async function transferOffline(code, from, to, amount, memo, sig, transactionHeaders) {
    var keyProvider = '5J4vRX186htiS6s8rvfCeVxyzfKyjZDum5mpww8dT1qrpfsEJL'; //dummy key provider to test
    const eosjsOptions = {
        broadcast: false,
        authorization: [{
            actor: from,
            permission: 'active'
        }],
        transactionHeaders: transactionHeaders
    };
    //offline signing config
    eos = Eos({
        httpEndpoint: null,
        keyProvider,
        authorization: [{
            actor: from,
            permission: 'active'
        }],
        transactionHeaders
    });

    console.log("eosapi:transferOffline with sig: =>" + sig);
    console.log("eosapi:transfer=> contract:from:to:amount:memo:sig:trxHeaders  =>" + JSON.stringify(code) + " : " + JSON.stringify(from) + " : " + JSON.stringify(to) + " : " + JSON.stringify(amount) + " : " + JSON.stringify(memo) + " : " + JSON.stringify(sig) + ":" + JSON.stringify(transactionHeaders));
    var transfer = await eos.transfer({
        from,
        to,
        quantity: amount,
        memo
    }, eosjsOptions);

    // var transferTransaction = await eos.transaction(code, contractuser => {
    //     contractuser.transfer({
    //         from: from,
    //         to: to,
    //         quantity: amount,
    //         memo: memo
    //     },eosjsOptions);
    // });

    var transferTransaction = transfer.transaction;
    // ONLINE (bring `transferTransaction`)
    eos = Eos(loadBalance(null));
    transferTransaction.signatures.push(sig); //push scatter signature
    processedTransaction = await eos.pushTransaction(transferTransaction);
    console.log("eosapi:transferOffline=> " + JSON.stringify(processedTransaction));
    return (processedTransaction);
}

async function getTransaction(id) {
    eos = Eos(loadBalance());
    console.log("eosapi:getTransaction=> id  =>" + JSON.stringify(id));
    return await eos.getTransaction({
        id
        //}).catch(function (e) {
        //console.log("eosapi:getTransaction=>error: " + JSON.stringify(e));
        //next(err);
    });
}

async function getActions(account, pos, offset) {
    eos = Eos(loadBalance());
    console.log("eosapi:getActions=> account:pos:offset  =>" + JSON.stringify(account) + ":" + JSON.stringify(pos) + ":" + JSON.stringify(offset));
    return await eos.getActions(
        account,
        pos,
        offset
        //}).catch(function (e) {
        //console.log("eosapi:getActions=>error: " + JSON.stringify(e));
        //next(err);
    );
}

async function getAccount(account) {
    eos = Eos(loadBalance());
    console.log("eosapi:getAccount=> account  =>" + JSON.stringify(account));
    return await eos.getAccount(
        account
        //}).catch(function (e) {
        //console.log("eosapi:getAccount=>error: " + JSON.stringify(e));
        //next(err);
    );
}

async function getProducers() {
    console.log("eosapi:getProducers => ");
    return await eos.getProducers({
        json: true
    });
}

async function voteProducer(voter, proxy, producer, sig) {
    console.log("voteProducer:voter:proxy:producer => " + voter + ":" + proxy + ":" + producer);
    eos = Eos(loadBalance(sig));
    console.log("eosapi:votin with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.voteproducer(voter, proxy, producer);
}


async function undelegate(from, receiver, net, cpu, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:undelegatin with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.undelegatebw(from, receiver, net, cpu);
}

async function delegate(from, receiver, net, cpu, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:delegatin with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.delegatebw(from, receiver, net, cpu, 0);
}

async function createKeyset() {
    var keySet = {};
    keySet.owner_privateKey = await ecc.randomKey();
    keySet.owner_publicKey = ecc.privateToPublic(keySet.owner_privateKey);
    keySet.active_privateKey = await ecc.randomKey();
    keySet.active_publicKey = ecc.privateToPublic(keySet.active_privateKey);
    console.log("eosapi:keySet =>" + JSON.stringify(keySet));
    return keySet;
}

async function createAccount(creator, name, owner, active, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:createAccount with key: =>" + eos.fc.types.config.keyProvider);
    return trxCreateAccount = await eos.transaction(tr => {
        tr.newaccount({
            creator: creator,
            name: name,
            owner: owner,
            active: active
        }, {
            authorization: [creator]
        });
    });
}

async function buyRam(payer, receiver, quant, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:buyRam with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.buyram(payer, receiver, quant);
}

async function buyRamBytes(payer, receiver, bytes, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:buyRamBytes with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.buyrambytes(payer, receiver, bytes);
}

async function sellRamBytes(account, bytes, sig) {
    eos = Eos(loadBalance(sig));
    console.log("eosapi:sellRamBytes with key: =>" + eos.fc.types.config.keyProvider);
    return await eos.sellram(account, bytes);
}

async function getBandwidth(account) {
    console.log("eosapi:getBandwidth=> account  =>" + JSON.stringify(account));
    return await eos.getTableRows(true, 'eosio', account, 'delband')
}

async function getRamData() {
    console.log("eosapi:getRamData");
    return await eos.getTableRows(true, 'eosio', 'eosio', 'rammarket')
}

function loadBalance(sig) {
    // console.log("***************************")
    var chainList = config.eoschain;
    //console.log(chainList);
    var selectedChain = chainList[Math.floor(Math.random() * chainList.length)];
    //use this if we want to be the signing authority and thereby provide staking amount
    if (sig !== 'undefined' && sig !== null) {
        selectedChain.keyProvider = [sig];
    } else {
        //selectedChain.keyProvider = [process.env.PAK, process.env.SAK];
    }
    //console.log("selectedChain=> " + JSON.stringify(selectedChain));
    //console.log("***************************")
    return selectedChain;
}

//declare functions to export
module.exports.getNodeInfo = getNodeInfo;
module.exports.getAllCurrentAirDropTokens = getAllCurrentAirDropTokens;
module.exports.getTokensByAccount = getTokensByAccount;
module.exports.transfer = transfer;
module.exports.getTransaction = getTransaction;
module.exports.getActions = getActions;
module.exports.getAccount = getAccount;
module.exports.getProducers = getProducers;
module.exports.voteProducer = voteProducer;
module.exports.createAccount = createAccount;
module.exports.createKeyset = createKeyset;
module.exports.delegate = delegate;
module.exports.undelegate = undelegate;
module.exports.getBandwidth = getBandwidth;
module.exports.buyRam = buyRam;
module.exports.buyRamBytes = buyRamBytes;
module.exports.sellRamBytes = sellRamBytes;
module.exports.getRamData = getRamData;
module.exports.transferOffline = transferOffline;
