import React from 'react';
import Config from './config.json';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
var crypto = require('crypto');
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';
const scatter = ScatterJS.scatter;

import * as actions from './actions/actions';

const network = {
    blockchain:'eos',
    protocol:'https',
    host:'nodes.get-scatter.com',
    port:443,
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}


const mapStateToProps = store => ({
    scatter: store.scatter,
    nonce: store.nonce,
    privateKey: store.privateKey,
    from: store.from,
    to: store.to,
    amount: store.amount,
    coin: store.coin,
    memo: store.memo
});

const mapDispatchToProps = dispatch => ({
    updateNonce: data => dispatch(actions.updateNonce(data)),
    updateState: data => dispatch(actions.updateState(data)),
    updateScatter: () => dispatch(actions.updateScatter())
});


class App extends React.Component {

    constructor(props) {
        super(props);

        this.send = this.send.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.scatterSend = this.scatterSend.bind(this);
        this.encrypt = this.encrypt.bind(this);
    }

    encrypt (nonce) {
        var iv = Buffer.from('0000000000000000');
        let key = Config.saltKey;
        let message = nonce.toString()+' '+this.props.privateKey;
        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        return cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
    };


    send(e) {

        console
        // const socket = openSocket('http://api.byzanti.ne:8902/');
        const socket = openSocket('http://localhost:5000');
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        socket.emit('user', [Config.saltKey, randChannel]);

        let that = this;

        socket.on(randChannel, async function (data) {
            console.log(data);
            let objReq = {};
            objReq.sig = await that.encrypt(data);
            objReq.from = that.props.from;
            objReq.to = that.props.to;
            objReq.amount = that.props.amount + ' ' + that.props.coin;
            objReq.memo = that.props.memo;

           
            // await fetch('http://api.byzanti.ne:8902/transfer', {
            await fetch('http://local.byzanti.ne:8901/transfer', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objReq)
            })
            .then(response => console.log(response));
            socket.on('disconnect');
        });
    }


    scatterSend(e) {
    
        scatter.connect("thin-wallet").then(connected => {
            if(!connected) {
                // User does not have Scatter Desktop or Classic installed. 
                return false;
            }
 

            const requiredFields = { accounts:[network] };
            scatter.getIdentity(requiredFields).then(() => {

                // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
                // the user for their account name beforehand. They could still give you a different account.
                const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
                
        
            //     // You can pass in any additional options you want into the eosjs reference.
            //     const eosOptions = { expireInSeconds:60 };

               
        
            //     // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
                const eos = scatter.eos(network, Eos);
                
                const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
                eos.transfer(account.name, this.props.to, this.props.amount + ' ' + this.props.coin, this.props.memo, transactionOptions).then(trx => {
                    // That's it!
                    console.log(`Transaction ID: ${trx.transaction_id}`);
                }).catch(error => {
                    console.error(error);
                });
        
            }).catch(error => {
                // The user rejected this request, or doesn't have the appropriate requirements.
                console.error(error);
            });
            
        });


    }


    changeInput(e) {
        let payload = [];
        if (e.target.id === 'amount') {
            let amt = parseFloat(e.target.value)
            amt = parseFloat(Math.round(amt * Math.pow(10, 4)) / Math.pow(10, 4)).toFixed(4);
            payload.push(e.target.id, amt);
        }
        if (e.target.id === "scatter") this.props.updateScatter();
        else payload.push(e.target.id, e.target.value)
        this.props.updateState(payload);
    }


    render() {
        const scatter = this.props.scatter;
        const inputs = [
            <input key="from" id="from" placeholder="From" onChange={this.changeInput}></input>, 
            <input key="privateKey" id="privateKey" type="password" placeholder="Enter your private key" onChange={this.changeInput}></input>,
            <input key="to" id="to" placeholder="To" onChange={this.changeInput}></input>,
            <input key="amount" id="amount" placeholder="Enter your amount" onChange={this.changeInput}></input>,
            <input key="coin" id="coin" placeholder="Coin" onChange={this.changeInput} list="coinList"></input>,
            <input key="memo" id="memo" placeholder="Memo" onChange={this.changeInput}></input>
        ];


        return (
     
            <div className="Wallet">
            {inputs.map(el => {
            if(el.key === "from" || el.key === "privateKey"){
                if(!scatter) return el;
            }
            else return el;
        })}
                <button key="send" onClick={this.props.scatter ? this.scatterSend : this.send}>Send</button>
                <span> Check this box to use scatter<input type="checkbox" id="scatter" onChange={this.changeInput}></input></span>
            </div>

        );
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);