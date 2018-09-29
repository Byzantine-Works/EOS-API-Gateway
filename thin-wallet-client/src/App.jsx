import React from 'react';
import Config from './config.json';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
var crypto = require('crypto');
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';
const EosApi = require('eosjs-api')
const scatter = ScatterJS.scatter;
import axios from 'axios';
const https = require('https')
import listing from './listing.json';
const lodash = require('lodash');

// var Eth = require('web3-eth');

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
// var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');

import * as actions from './actions/actions';

const eosChain = {
    eosVersion: 'f2cb2722',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    httpEndpoint: 'https://mainnet.libertyblock.io:7777',
    debug: false,
    verbose: false,
    latency: 160
  };


const network = {
    blockchain:'eos',
    protocol:'https',
    host:'mainnet.libertyblock.io',
    port: 7777,
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}

const eos = EosApi(network);


const mapStateToProps = store => ({
    EUR: store.EUR,
    USD: store.USD,
    fiatAm: store.fiatAm,
    usdeur: store.usdeur,
    tokens: store.tokens,
    token: store.token,
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
        this.changeCoin = this.changeCoin.bind(this);
        this.conversion = this.conversion.bind(this);
       
    }

    encrypt (nonce) {
        var iv = Buffer.from('0000000000000000');
        nonce++;
        let key = Config.saltKey;
        let message = nonce.toString()+' '+this.props.privateKey;
        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        return cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
    };


    send(e) {

        const socket = openSocket('http://local.byzanti.ne:8900/');
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("apiKey: ", Config.apiKey)
        socket.emit('user', [Config.apiKey, randChannel]);

        let that = this;

        socket.on(randChannel, async function (data) {
            let amt = parseFloat(that.props.amount)
            amt = parseFloat(Math.round(amt * Math.pow(10, 4)) / Math.pow(10, 4)).toFixed(4);
            console.log(data);
            let objReq = {};
            objReq.sig = await that.encrypt(data);
            objReq.from = that.props.from;
            objReq.to = that.props.to;
            objReq.amount = amt + ' ' + that.props.token;
            objReq.memo = that.props.memo;

           
            // await fetch('http://api.byzanti.ne:8902/transfer', {
            await fetch(`http://local.byzanti.ne:8902/transfer?api_key=${Config.apiKey}`, {
                method: 'POST',
                headers: {
                    "Wallet-API-Key": Config.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objReq)
            })
            .then(response => console.log(response));
            socket.on('disconnect');
        });
    }


    async scatterSend(e) {

    
        scatter.connect("wallet-thin").then(connected => {
            if(!connected) {
                // User does not have Scatter Desktop or Classic installed. 
                return false;
            }
            if(connected) {
                // this.scatter = scatter;
                // window.scatter = null;
                
            }
            console.log(connected)
    
 

            const requiredFields = { accounts:[network] };
            scatter.getIdentity(requiredFields).then(identity => {
                console.log("identity: ", identity)

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
    async changeCoin(){

        let response = await axios(`http://api.byzanti.ne:8902/tokensByAccount/${this.props.from}`);
        await this.props.updateState(["tokens", response.data.map(el => {return el.symbol})]);
        if(this.props.from !== null) {
            await this.props.updateState(["token", response.data[0].symbol]);
            await this.props.updateState(["usdeur", "USD"]);
        }
    }

    async conversion () {
        let rate;
        let index = lodash.filter(listing.data, x => x.symbol === this.props.token)[0];
        https.get(`https://api.coinmarketcap.com/v2/ticker/${index.id}/?convert=EUR`, resp => {
            let data;
            resp.on('data', d => data += d)
            resp.on('error', err => console.log(err));
            resp.on('end', () => {
                rate = JSON.parse(data.split("undefined")[1]).data.quotes;
                this.props.updateState(["rate", this.props.token])
                this.props.updateState(["USD", rate.USD.price]);
                this.props.updateState(["EUR", rate.EUR.price]);
                if(this.props.amount > 0) this.props.updateState(["fiatAm", this.props.amount*this.props.USD])
              });
        })

    }

    calculateRate()  {

    }



    async changeInput(e) {
        

        let payload = [];
        if (e.target.id === 'amount') {
            payload.push(e.target.id, Number(Number(e.target.value).toFixed(2)));
            this.props.updateState(payload);
            if(this.props.token !== null && this.props.token !== this.props.rate) {
                this.conversion();
            }
        }
        else if (e.target.id === "scatter") {
            this.props.updateScatter();
            this.conversion();
        }
        else if (e.target.id === "from") {
            payload.push(e.target.id, e.target.value)
            await this.props.updateState(payload);
            if(this.props.coin !== null) this.changeCoin();

        }
        else if (e.target.id === "coin") {
            payload.push(e.target.id, e.target.value)
            this.props.updateState(payload);
            if(this.props.from !== null) {
                this.changeCoin(this.props.coin)
                
            }
        }
        else if (e.target.id === "token") {
            payload.push(e.target.id, e.target.value)
            await this.props.updateState(payload);
            await this.conversion();
            await this.props.updateState(["fiatAm", this.props[this.props.usdeur]*this.props.amount]);
        
        }
        else if (e.target.id === "usdeur") {
            await this.props.updateState(["usdeur", e.target.value]);
            await this.props.updateState(["fiatAm", this.props[this.props.usdeur]*this.props.amount])
        }
        else if (e.target.id === "fiat") {
            await this.props.updateState(["fiatAm", Number(Number(e.target.value).toFixed(2))]);
            await this.props.updateState(["amount", this.props.fiatAm/this.props[this.props.usdeur]]);
        }


        else {
            payload.push(e.target.id, e.target.value)
            this.props.updateState(payload);
        }
        
    }


    render() {
        const scatter = this.props.scatter;
        const tokens = this.props.tokens ?  this.props.tokens.map(tok => {return <option key={tok} id={tok}>{tok}</option>}) : null;
        


        // let eosTokens = symbols.map(el => {
        //     return <option id={el}>{el}</option>
        // }) 
        const inputs = [
            <input key="from" id="from" placeholder="From" onChange={this.changeInput}></input>, 
            <input key="privateKey" id="privateKey" type="password" placeholder="Enter your private key" onChange={this.changeInput}></input>,
            <select key="token" id="token" placeholder="token" onChange={this.changeInput} ></select>,
            <input key="fiat" id="fiat" value={this.props.fiatAm} onChange={this.changeInput}></input>,
            
        ];

        const fiatSelec = [
            <input key="fiat" id="fiat" value={this.props.fiatAm} onChange={this.changeInput}></input>,
            <select key="usdeur" id="usdeur" onChange={this.changeInput} >
                <option id="USD">USD</option>
                <option id="EUR">EUR</option>
            </select>

        ]


        return (

            <div className="Wallet">
            {inputs.map(el => {
            if(el.key === "from" || el.key === "privateKey"){
                if(!scatter) return el;
            } else if(el.key === 'token' && this.props.token !== null) {
                    return <select key="token" id="token" placeholder="token" onChange={this.changeInput}>
                                {tokens}
                            </select>
            } else if(el.key === 'fiat' && this.props.token !== null){
                return fiatSelec;                    

            } else if(el.key === 'fiat' && this.props.token !== null){
          
            }
        })}

                <input key="to" id="to" placeholder="To" onChange={this.changeInput}></input>
                <input key="amount" id="amount" placeholder="Amount" value={this.props.amount} onChange={this.changeInput}></input>
                <select key="coin" id="coin" placeholder="Coin" onChange={this.changeInput}>
                    <option id="null">Chain</option>
                    <option id="EOS">EOS</option>
                    <option id="ETH">ETH</option>
                </select>
                <input key="memo" id="memo" placeholder="Memo" onChange={this.changeInput}></input>
                <button id="send" key="send" onClick={this.props.scatter ? this.scatterSend : this.send}>Send</button>
                <span className="Scatter"> Check this box to use scatter<input type="checkbox" id="scatter" onChange={this.changeInput}></input></span>
            </div>

        );
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);