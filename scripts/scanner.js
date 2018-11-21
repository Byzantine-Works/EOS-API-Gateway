'use strict';
const Eos = require("eosjs");
const es = require("../api/es.js");
var datetime = require('node-datetime');


const eos = Eos({
    eosVersion: '0f6695cb',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    httpEndpoint: 'http://127.0.0.1:8888',
    debug: false,
    verbose: false
});

async function getActions(contractName, startSeq, endSeq) {
    console.log("scanner:getActions=> account:startSeq:endSeq  =>" + contractName + ":" + startSeq + ":" + endSeq);
    return await eos.getActions(
        'exchange',
        startSeq,
        endSeq
    );
}

async function scanBlockchain() {
    //get curr sequence from configs
    var config = await es.getActionSequence('EOS');
    var currentActionSequence = config.hits.hits[0]._source.actionsequence;
    console.log("Current Scan Sequence => " + currentActionSequence);

    //get actions in a loop 1 at a time, if none just chill
    var result = await getActions('exchange', currentActionSequence, 0);
    console.log("getActions-res length => " + result.actions.length);
    if (result.actions.length > 0) {
        //for each action
        for (var i = 0, len = result.actions.length; i < len; i++) {
            var actionInfo = {};
            console.log("Current Action Sequence => " + result.actions[i].account_action_seq);
            actionInfo.account_action_seq = result.actions[i].account_action_seq;
            // actionInfo.block_num = result.actions[i].block_num;
            // actionInfo.block_time = result.actions[i].block_time;
            // actionInfo.contract = result.actions[i].act.account;
            // actionInfo.actionname = result.actions[i].action_trace.act.name;
            // actionInfo.receiver = result.actions[i].action_trace.receipt.receiver;
            // actionInfo.transactionid = result.actions[i].action_trace.trx_id;

            // //key info
            // actionInfo.from = result.actions[i].action_trace.act.data.from;
            // actionInfo.to = result.actions[i].action_trace.act.data.to;
            // actionInfo.quantity = result.actions[i].action_trace.act.data.quantity;
            // actionInfo.memo = result.actions[i].action_trace.act.data.memo;
            // console.log(actionInfo);

            //create deposit record
            var deposit = {};
            deposit.amount = parseFloat((result.actions[i].action_trace.act.data.quantity).split(" ")[0]);
            deposit.symbol = (result.actions[i].action_trace.act.data.quantity).split(" ")[1];
            deposit.account = result.actions[i].action_trace.act.data.from;
            deposit.transactionid = result.actions[i].action_trace.trx_id;
            deposit.timestamp = datetime.create().epoch();
            deposit.created = datetime.create().format('Y-m-d H:M:S');
            deposit.updated = datetime.create().format('Y-m-d H:M:S');

            console.log(deposit);
            await es.index(deposit, 'deposits', 'deposit');

            //create account record if new user
            var account = {};
            account.account = result.actions[i].action_trace.act.data.from;
            account.nonce = 1; //init user nonce
            account.feediscount = 1; //??
            account.rewards = 1; //??
            account.timestamp = datetime.create().epoch();
            account.created = datetime.create().format('Y-m-d H:M:S');
            account.updated = datetime.create().format('Y-m-d H:M:S');
            await es.addAccount(account, 'accounts', 'account');

            //update balance record for user
            var balance = {};
            balance.account = result.actions[i].action_trace.act.data.from;;
            balance.amount = parseFloat((result.actions[i].action_trace.act.data.quantity).split(" ")[0]);
            balance.symbol = (result.actions[i].action_trace.act.data.quantity).split(" ")[1];
            balance.timestamp = datetime.create().epoch();
            balance.created = datetime.create().format('Y-m-d H:M:S');
            balance.updated = datetime.create().format('Y-m-d H:M:S');
            await es.updateBalances(balance);

        }
        await es.updateActionSequence('EOS', actionInfo.account_action_seq + 1);
    } else
        console.log("No new deposit actions after sequence " + currentActionSequence);
}
setInterval(scanBlockchain, 10000);