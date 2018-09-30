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
import { css } from 'react-emotion';
import Loader from 'react-spinners/BounceLoader';

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
    loading: store.loading,
    amountFocus: store.amountFocus,
    fiatFocus: store.fiatFocus,
    amRend : store.amRend,
    fiatAmRend : store.fiatAmRend,
    balance: store.balance,
    rateEURUSD: store.rateEURUSD,
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
        this.unFocus = this.unFocus.bind(this);
        this.scatterPair = this.scatterPair.bind(this);
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
        this.props.updateState(["loading", true]);
        const socket = openSocket('http://local.byzanti.ne:8900');
        console.log(socket);
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
            console.log(objReq);

           
            // await fetch('http://api.byzanti.ne:8902/transfer', {
            await fetch(`http://local.byzanti.ne:8901/transfer?api_key=${Config.apiKey}`, {
                method: 'POST',
                headers: {
                    "Wallet-API-Key": Config.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objReq)
            })
            .then(response => {
                console.log(response);
                this.props.updateState(["loading", false]);
            }).catch((err) =>  {
                this.props.updateState(["loading", false])
                console.log(err)
            })
            socket.on('disconnect');
        });
        this.props.updateState(["loading", false])

    }

    async scatterPair(){
        const connected = await scatter.connect("wallet-thin");
        await console.log(connected);
        const requiredFields = { accounts:[network] };
        const ID = await scatter.getIdentity(requiredFields);
        this.props.updateState(["from", ID.accounts[0].name]);
        this.props.updateState(["privateKey", ID.hash])
        console.log(ID)
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

    unFocus(e) {
            this.props.updateState(["amRend", this.props.amount]);
            this.props.updateState(["fiatAmRend", this.props.fiatAm]);
    }


    async changeCoin(){
        this.props.updateState(["loading", true]);
        let response = await axios(`http://api.byzanti.ne:8902/tokensByAccount/${this.props.from}`);
        let balance = {};
        for(let x in response.data){
            let o = response.data[x]
            balance[o.symbol] = {balance: o.balance, contract: o.contract, precision: o.precision, hash: o.hash}
        }

        await this.props.updateState(["tokens", response.data.map(el => {return el.symbol})]);
        await this.props.updateState(["balance", balance]);
        if(this.props.from !== null) {
            await this.props.updateState(["token", response.data[0].symbol]);
            await this.props.updateState(["usdeur", "USD"]);
        }
        this.conversion();
    }

    async conversion () {
        this.props.updateState(["loading", true]);
        let rateUSD;
    
        //http://free.currencyconverterapi.com/api/v5/convert?q=EUR_USD&compact=y
        if(this.props.token === 'EOS'){
            let reqCrypComp = await axios('https://min-api.cryptocompare.com/data/price?fsym=EOS&tsyms=USD,EUR')
            rateUSD = reqCrypComp.data.USD;
        } else {
            let symbol = lodash.filter(listing.data, x => {return x.currency === this.props.token})[0].symbol;
            let a = await axios('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/ticker/price', {params: {symbol: symbol}});
            rateUSD = a.data.data.price;
        }
        if(this.props.rateEURUSD === null){
            let respEur = await axios('http://free.currencyconverterapi.com/api/v5/convert?q=EUR_USD&compact=y');
            this.props.updateState(["rateEURUSD", respEur.data.EUR_USD.val]);
        }

        let rateEUR = rateUSD/this.props.rateEURUSD;
        this.props.updateState(["rate", this.props.token])
        this.props.updateState(["USD", rateUSD]);
        this.props.updateState(["EUR", rateEUR]);
        if(this.props.amount > 0) {
            this.props.updateState(["fiatAm", this.props.amount*this.props.USD]);
            this.props.updateState(["fiatAmRend", this.props.amount*this.props.USD]);

        }
        this.props.updateState(["loading", false]);

    }




    async changeInput(e) {
        

        let payload = [];
        if (e.target.id === 'amount') {
            if(isNaN(Number(e.target.value))) return;
            else {
            payload.push(e.target.id, e.target.value);
            await this.props.updateState(payload);
            if(this.props.token !== null && this.props.token !== this.props.rate) {
                this.conversion();
            }
            if(this.props.coin !== null) this.props.updateState(["fiatAm", this.props.amount*this.props[this.props.usdeur]]);
        }
        } else if (e.target.id === "scatter") {
            this.props.updateScatter();
        } else if (e.target.id === "from") {
            payload.push(e.target.id, e.target.value)
            await this.props.updateState(payload);
            if(this.props.coin !== null) {
                this.changeCoin();
            }

        } else if (e.target.id === "coin") {
            payload.push(e.target.id, e.target.value)
            this.props.updateState(payload);
            if(this.props.from !== null) {
                this.changeCoin(this.props.coin);
            }

        } else if (e.target.id === "token") {
            payload.push(e.target.id, e.target.value)
            await this.props.updateState(payload);
            await this.conversion();
            await this.props.updateState(["fiatAm", this.props[this.props.usdeur]*this.props.amount]);
        
        } else if (e.target.id === "usdeur") {
            await this.props.updateState(["usdeur", e.target.value]);
            await this.props.updateState(["fiatAm", this.props[this.props.usdeur]*this.props.amount]);

        } else if (e.target.id === "fiat") {
            if(isNaN(Number(e.target.value))) return;
            else {
            await this.props.updateState(["fiatAm", e.target.value]);
            await this.props.updateState(["amount", this.props.fiatAm/this.props[this.props.usdeur]]);
            }

        } else {
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
            <select key="token" id="token" placeholder="token" onChange={this.changeInput} ></select>,
            <input key="fiat" id="fiat" value={this.props.fiatAmRend} onChange={this.changeInput}></input>
            
        ];

        let gradient = this.props.token ? this.props.amount/this.props.balance[this.props.token].balance : 0;

//        #347fb9 ${(1-(this.props.amount/this.props.balance[this.props.token].balance))*100}%

        let Style = {
            borderRadius: '15px',
            margin: 'auto 0',
            background: `#14466C`,
            height:'110%',
            width: `${gradient > 1 ? 100 : gradient*100}%`,
            zindex: '6',  
        }

        const fiatSelec = [
            <input key="fiat" id="fiat" value={this.props.fiatAmRend} onBlur={this.unFocus} onChange={this.changeInput}></input>,
            <select key="usdeur" id="usdeur" onChange={this.changeInput} >
                <option id="USD">USD</option>
                <option id="EUR">EUR</option>
            </select>,
            this.props.token ? <p key="balance" id="balance">{(this.props.balance[this.props.token].balance - this.props.amount).toFixed(4)}</p> : null,
            <div style={{borderRadius: '15px', padding: '-5px', zindex: '6', top: '10px', width:'100%', background:'white', height:'5px'}}><div style={Style} key="balanceVisual" id="balanceVisual"></div></div>
        ];

        const override = css`
            top: -200px;
            border-color: red;
            margin: 0 auto;
            z-index: 5;`;


        return (
            <div>

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

            } 
        })}
                <input key="from" id="from" placeholder="From" value={this.props.from} onChange={this.changeInput}></input>
                <input key="privateKey" id="privateKey" type="password" placeholder="Enter your private key" value={this.props.privateKey} onChange={this.changeInput}></input>
                <input key="to" id="to" placeholder="To" onChange={this.changeInput}></input>
                <input key="amount" id="amount" placeholder="Amount" value={this.props.amRend} onChange={this.changeInput} onBlur={this.unFocus}></input>
                <select key="coin" id="coin" placeholder="Coin" onChange={this.changeInput}>
                    <option id="null">Chain</option>
                    <option id="EOS">EOS</option>
                    <option id="ETH">ETH</option>
                </select>
                <input key="memo" id="memo" placeholder="Memo" onChange={this.changeInput}></input>
                <button id="send" key="send" onClick={this.props.scatter ? this.scatterSend : this.send}>Send</button>
                <label className="Scatter"><img src="https://coinclarity.com/wp-content/uploads/2018/06/6ZtwIwM_400x400-1.jpg"></img><input type="checkbox" id="scatter" onChange={this.scatterPair}></input><span className="checkmark"></span></label>
            </div>
            <div className='sweet-loading'>
                <Loader
                              className={override}
                              sizeUnit={"px"}
                              size={70}
                              color={'#14466C'}
                              loading={this.props.loading}/>
                </div>

        </div> 

        );
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);