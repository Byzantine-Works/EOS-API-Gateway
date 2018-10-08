require('dotenv').config();
import React from 'react';
import Config from './config.json';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';
import EosApi from 'eosjs-api';
import axios from 'axios';
import listing from './listing.json';
import lodash from 'lodash';
import { css } from 'react-emotion';
import Loader from 'react-spinners/BounceLoader';
import Dialog from './Dialog.jsx';
import encrypt from './enc.js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

let scatter = ScatterJS.scatter;
console.log("Eos: ", EosApi);


import * as actions from './actions/actions';

const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: process.env.HOST,
    port: Number(process.env.PORT),
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}

// const network = {
//     blockchain:'eos',
//     protocol:'https',
//     host: 'mainnet.libertyblock.io',
//     port: 7777,
//     chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
// }


// const network = {
//     blockchain:'eos',
//     protocol:'https',
//     host:'nodes.get-scatter.com',
//     port:443,
//     chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
// }



const eos = EosApi(network);


const mapStateToProps = store => ({
    scatterID: store.scatterID,
    tooltip: store.tooltip,
    tooltipMessage: store.tooltipMessage,
    transactionID: store.transactionID,
    message: store.message,
    loading: store.loading,
    fiatFocus: store.fiatFocus,
    amRend: store.amRend,
    fiatAmRend: store.fiatAmRend,
    balance: store.balance,
    rateEURUSD: store.rateEURUSD,
    EUR: store.EUR,
    USD: store.USD,
    fiatAm: store.fiatAm,
    usdeur: store.usdeur,
    tokens: store.tokens,
    token: store.token,
    scatter: store.scatter,
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
        this.changeCoin = this.changeCoin.bind(this);
        this.conversion = this.conversion.bind(this);
        this.unFocus = this.unFocus.bind(this);
        this.scatterPair = this.scatterPair.bind(this);
        this.toolTip = this.toolTip.bind(this);
    }



    send(e) {
        this.props.updateState(["loading", true]);
        const socket = openSocket(process.env.SOCKET);
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        socket.emit(process.env.CHANNEL, [Config.apiKey, randChannel]);

        let that = this;

        socket.on(randChannel, async function (data) {
            let amt = parseFloat(that.props.amount)
            amt = parseFloat(Math.round(amt * Math.pow(10, 4)) / Math.pow(10, 4)).toFixed(4);
            console.log(data);
            let objReq = {};
            objReq.sig = await encrypt(data, that.props.privateKey);
            objReq.from = that.props.from;
            objReq.to = that.props.to;
            objReq.amount = amt + ' ' + that.props.token;
            objReq.memo = that.props.memo;
            let arReq = Object.keys(objReq).map(function(key) {return objReq[key]});
            console.log(arReq);
            let nullParam = lodash.indexOf(arReq, null);
            if (nullParam !== -1) {
                console.log("Into nullParam");
                that.props.updateState(["loading", false]);
                that.props.updateState(["message", "missingField"]);
            } else {
            console.log(process.env.TRANSFER)
            let response = await fetch(process.env.TRANSFER, {
                method: 'POST',
                headers: {
                    "api_key": Config.apiKey,
                    "Content-Type": "application/json"

                },
                body: JSON.stringify(objReq)
            })
                .then(response => {
                    if (response.status !== 200) that.props.updateState(["message", "transacRefused"]);
                    else that.props.updateState(["message", "transacSuccess"])
                    console.log(response);

                }).catch((err) => {
                    this.props.updateState(["message", "transacRefused"]);
                    this.props.updateState(["loading", false])

                    console.log(err)
                })
                console.log(response);
            socket.on('disconnect');
            }
        });
        this.props.updateState(["loading", false])

    }


    async scatterPair(e) {


        if (this.props.scatter) {
            location.reload();
        }
        else {
            e.preventDefault()

            this.props.updateState(["loading", true]);
            try {

                const connected = await scatter.connect("wallet-thin");
                console.log("connected: ", connected)

            } catch (error) {
                console.log("scatter error")
                this.props.updateState(["loading", false]);
                this.props.updateState(["message", "notScatterConnected"])
                return;
            }
            try {

                const requiredFields = { accounts: [network] };
                console.log("window scatter: ", window.scatter)
                let id;

                if (window.scatter.isExtension) {
                    scatter = window.scatter;
                    id = await scatter.getIdentity(requiredFields);
                    window.scatter = null;

                } else id = await scatter.getIdentity(requiredFields);


                console.log("id :", id)


                if (id.accounts.length) {
                    document.getElementById('scatter').checked = true;
                    this.props.updateScatter();
                }
                this.props.updateState(["from", id.accounts[0].name]);
                this.props.updateState(["privateKey", id.hash])
                this.props.updateState(["scatterID", id])
                if (this.props.coin) this.changeCoin();
            } catch (error) {
                console.log("error: ", error);
                this.props.updateState(["loading", false]);
                if (!window.scatter.isExtension) {
                    this.props.updateState(["message", "authRefused"]);
                    document.getElementById('scatter').checked = false;
                }
            }
        };
        this.props.updateState(["loading", false]);
    }


    async scatterSend(e) {
        this.props.updateState(["loading", true]);

        const account = this.props.scatterID.accounts.find(x => x.blockchain === 'eos');
        console.log("account: ", account);

        const eosOptions = { expireInSeconds: 60 };

        //     // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        const eos = scatter.eos(network, Eos, eosOptions);
        console.log("eos: ", eos);

        const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };
        let arReq = [account.name, this.props.to, this.props.amRend + ' ' + this.props.token, this.props.memo, transactionOptions]
        console.log(arReq);
        let nullParam = lodash.indexOf(arReq, null);
        if (nullParam !== -1) {
            this.props.updateState(["loading", false]);
            this.props.updateState(["message", "missingField"]);
        } else {
            try {
                let trx;
                if(this.props.token === 'EOS') trx = await eos.transfer(...arReq);
                else {
                    let contractName = this.props.balance[this.props.token].contract;
                    let contract = await eos.contract(contractName);
                    trx = await contract.transfer(...arReq);
                }
                    // That's it!
                console.log(`Transaction ID: ${trx.transaction_id}`);
                this.props.updateState(["loading", false]);
                this.props.updateState(["message", "transacSuccess"]);
                this.props.updateState(["transactionID", trx.transaction_id])
                // .catch(error => {
                //     console.log("error scatter send: ", JSON.parse(error));
                //     this.props.updateState(["message", "transacRefused"]);
                //     this.props.updateState(["loading", false]);               
                // });
            } catch (err) {
                this.props.updateState(["loading", false]);
                console.log(err)
                if(typeof err === 'string'){
                var code = JSON.parse(err).error.code
                if (code === 3080004) return this.props.updateState(["message", "cpuExceeded"]);
                if (code === 3050003) return this.props.updateState(["message", "mustPositive"]);
                } else {
                    console.log("scatter send: ", err);
                    if (err.code === 402) this.props.updateState(["message", "transacDenied"]);
                    else this.props.updateState(["message", "transacRefused"]);
                    
                }
            }
        }
    }

    unFocus(e) {
        this.props.updateState(["amRend", this.props.amount]);
        this.props.updateState(["fiatAmRend", this.props.fiatAm]);
    }


    async changeCoin() {
        let response;
        this.props.updateState(["loading", true]);
        response = await axios(process.env.TOKENS + this.props.from + '?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        console.log(response)
        if (!response.data.length) {
            this.props.updateState(["token", null])
            this.props.updateState(["loading", false]);
            return;
        }
        let balance = {};
        for (let x in response.data) {
            let o = response.data[x]
            balance[o.symbol] = { balance: o.balance, contract: o.contract, precision: o.precision, hash: o.hash }
        }
        let tokens = response.data.map(el => { return el.symbol }).sort();
        tokens.splice(tokens.indexOf('EOS'), 1);
        tokens.unshift('EOS');
        console.log(tokens)
        await this.props.updateState(["tokens", tokens]);
        await this.props.updateState(["balance", balance]);
        if (this.props.from !== null) {
            await this.props.updateState(["token", "EOS"]);
            await this.props.updateState(["usdeur", "USD"]);
        }
        this.props.updateState(["amRend", this.props.amount]);
        this.conversion();
    }


    async conversion() {
        let symbolObj = lodash.filter(listing.data, x => { return x.currency === this.props.token })[0];
        if(!symbolObj && this.props.token !== 'EOS') {
            this.props.updateState(["USD", false]);
            this.props.updateState(["loading", false]);
            return;
        }
        console.log("in conversion")

        this.props.updateState(["loading", true]);
        let rateUSD;

        if (this.props.token === 'EOS') {
            let reqCrypComp = await axios(process.env.EOS_PRICE)
            rateUSD = reqCrypComp.data.USD;
        } else {
            try {
            let symbol = symbolObj.symbol;
            let a = await axios(process.env.TOKENS_PRICE, { params: { symbol: symbol } });
            rateUSD = a.data.data.price;
            } catch(err) {
                this.props.updateState(["USD", false])
                this.props.updateState(["loading", false])
            }
    
        }
        if (this.props.rateEURUSD === null) {
            let respEur = await axios(process.env.USD_EUR);
            this.props.updateState(["rateEURUSD", respEur.data.EUR_USD.val]);
        }

        let rateEUR = rateUSD / this.props.rateEURUSD;
        this.props.updateState(["rate", this.props.token])
        this.props.updateState(["USD", rateUSD]);
        this.props.updateState(["EUR", rateEUR]);
        if (this.props.amount > 0) {
            this.props.updateState(["amFiat", this.props.fiatAm * this.props.USD]);
            this.props.updateState(["amFiatRend", this.props.fiatAm * this.props.USD]);
        }
        this.props.updateState(["loading", false]);

    }


    toolTip(e) {
        this.props.updateState(["tooltip", e.target.id]);

    }




    async changeInput(e) {


        let payload = [];
        if (e.target.id === 'amount') {
            if (isNaN(Number(e.target.value))) return;
            else {
                payload.push(e.target.id, e.target.value);
                await this.props.updateState(payload);
                if (this.props.token !== null && this.props.token !== this.props.rate) {
                    this.conversion();
                }
                if (this.props.coin !== null) this.props.updateState(["fiatAm", this.props.amount * this.props[this.props.usdeur]]);
            }
        } else if (e.target.id === "from") {
            payload.push(e.target.id, e.target.value);
            await this.props.updateState(payload);
            console.log()
            if (this.props.coin !== null && this.props.from.length === 12) {
                this.changeCoin();
            } else this.props.updateState(["token", null])

        } else if (e.target.id === "coin") {
            payload.push(e.target.id, e.target.value)
            this.props.updateState(payload);
            if (this.props.from.length) {
                this.changeCoin(this.props.coin);
            }

        } else if (e.target.id === "token") {
            payload.push(e.target.id, e.target.value)
            await this.props.updateState(payload);
            await this.conversion();
            if(this.props.USD) await this.props.updateState(["amount", this.props.fiatAm/this.props[this.props.usdeur]]);

        } else if (e.target.id === "usdeur") {
            await this.props.updateState(["usdeur", e.target.value]);
            await this.props.updateState(["fiatAm", this.props[this.props.usdeur] * this.props.amount]);

        } else if (e.target.id === "fiat") {
            if (isNaN(Number(e.target.value))) return;
            else {
                await this.props.updateState(["fiatAm", e.target.value]);
                await this.props.updateState(["amount", this.props.fiatAm / this.props[this.props.usdeur]]);
            }

        } else {
            payload.push(e.target.id, e.target.value)
            this.props.updateState(payload);
        }

    }

    render() {

        const scatter = this.props.scatter;
        const tokens = this.props.tokens ? this.props.tokens.map(tok => { return <option key={tok} id={tok}>{tok}</option> }) : null;

        const dialogBox = this.props.message ? <div id='dialog'><Dialog updateState={this.props.updateState} transactionID={this.props.transactionID} message={this.props.message}></Dialog></div> : null;


        const tooltip =
            <Tooltip id="tooltip">
                {this.props.tooltip ? this.props.tooltipMessage[this.props.tooltip] : null}
            </Tooltip>

        let transacLink = `https://eosflare.io/tx/${this.props.transactionID}`

        const inputs = [
            <select key="token" id="token" placeholder="token" onChange={this.changeInput} ></select>,
            <input key="fiat" id="fiat" value={this.props.fiatAmRend} onChange={this.changeInput}></input>,
            <button id="send" key="send" onClick={this.props.scatter ? this.scatterSend : this.send}>Send</button>,
            <label className="Scatter" key="scatterBox"><input type="checkbox" id="scatter" onChange={this.scatterPair}></input><span className="checkmark"></span><OverlayTrigger placement="top" overlay={tooltip}><p id="scatterBox" onMouseOver={this.toolTip}>Pair with Scatter</p></OverlayTrigger></label>,
            <a key="transactionId" id="transactionId" href={transacLink} target="_blank" onMouseOver={this.toolTip}>{this.props.transactionID}</a>
        ];

        let gradient = this.props.token ? this.props.amount / this.props.balance[this.props.token].balance : 0;

        let Style = {
            borderRadius: '15px',
            margin: 'auto 0',
            background: `#14466C`,
            height: '110%',
            width: `${gradient > 1 ? 100 : gradient * 100}%`,
            zindex: '6',
        }

        let StyleContainer = {
            transform: 'translateY(20%)',
            margin: '0 auto',
            borderRadius: '15px',
            padding: '-5px',
            zindex: '6',
            width: '100%',
            background: 'white',
            height: '5px',
            gridArea: 'j',
        }

        let balance = this.props.token ? this.props.balance[this.props.token].balance - this.props.amount : null;

        const fiatSelec = [
            this.props.USD ? <input key="fiat" id="fiat" value={this.props.fiatAmRend} onBlur={this.unFocus} onChange={this.changeInput}></input> : <p>This token is not listed</p>,
            this.props.USD ? <select key="usdeur" id="usdeur" onChange={this.changeInput} >
                <option key="USD" id="USD">USD</option>
                <option key="EUR" id="EUR">EUR</option>
            </select> : null,
            this.props.token ? <p key="balance" id="balance" style={{ color: balance >= 0 ? 'white' : 'red' }}>{balance.toFixed(4) + ' ' + this.props.token}</p> : null,
            <div key="balContainer" style={StyleContainer}><div style={Style} key="balanceVisual" id="balanceVisual"></div></div>
        ];

        const override = css`
            top: -200px;
            border-color: red;
            margin: 0 auto;
            z-index: 5;`;


        return (
            <span>
                <div id="thin-wallet">

                    {inputs.map(el => {
                        if (el.key === "from" || el.key === "privateKey") {
                            if (!scatter) return el;
                        } else if (el.key === 'token' && this.props.token !== null) {
                            return <select key="token" id="token" placeholder="token" value={this.props.token} onChange={this.changeInput}>
                                {tokens}
                            </select>
                        } else if (el.key === 'fiat' && this.props.token !== null) {
                            return fiatSelec;
                        } else if (el.key === "send" || el.key === "scatterBox") {
                            if (this.props.transactionID === null) return el;
                        } else if (el.key === 'transactionId' && this.props.transactionID !== null) return <OverlayTrigger placement="top" overlay={tooltip}>{el}</OverlayTrigger>;
                    })}

                    <OverlayTrigger placement="top" overlay={tooltip}><input key="from" id="from" placeholder="From" value={this.props.from} onChange={this.changeInput} onMouseOver={this.toolTip} required></input></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={tooltip}><input key="privateKey" id="privateKey" type="password" placeholder="Enter your private key" value={this.props.privateKey} onChange={this.changeInput} onMouseOver={this.toolTip} required></input></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={tooltip}><input key="to" id="to" placeholder="To" onChange={this.changeInput} onMouseOver={this.toolTip} required></input></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={tooltip}><input key="amount" id="amount" placeholder="Amount" value={this.props.amRend} onChange={this.changeInput} onBlur={this.unFocus} onMouseOver={this.toolTip} required></input></OverlayTrigger>
                    <select key="coin" id="coin" placeholder="Coin" onChange={this.changeInput}>
                        <option id="EOS">EOS</option>
                        <option id="ETH" disabled>ETH</option>
                        <option id="TRX" disabled>TRX</option>
                        <option id="STEEM" disabled>STEEM</option>
                        <option id="BTS" disabled>BTS</option>
                        <option id="LSK" disabled>LSK</option>
                        <option id="RHOC" disabled>RHOC</option>
                        <option id="ARK" disabled>ARK</option>
                        <option id="NANO" disabled>NANO</option>
                        <option id="ADA" disabled>ADA</option>
                        <option id="XTZ" disabled>XTZ</option>
                    </select>
                    <OverlayTrigger placement="top" overlay={tooltip}><input key="memo" id="memo" placeholder="Memo" onChange={this.changeInput} onMouseOver={this.toolTip}></input></OverlayTrigger>
                </div>
                <div className='sweet-loading'>
                    <Loader
                        className={override}
                        sizeUnit={"px"}
                        size={70}
                        color={'#14466C'}
                        loading={this.props.loading} />




                </div>
                {dialogBox}
            </span>
        );
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);