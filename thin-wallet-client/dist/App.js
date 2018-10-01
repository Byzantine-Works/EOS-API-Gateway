function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import React from 'react';
import Config from './config.json';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
var crypto = require('crypto');
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';
const EosApi = require('eosjs-api');
const scatter = ScatterJS.scatter;
import axios from 'axios';
const https = require('https');
import listing from './listing.json';
const lodash = require('lodash');
import { css } from 'react-emotion';
import Loader from 'react-spinners/BounceLoader';
import Dialog from './Dialog.jsx';
// import pic from '../assets/scatterPic.png'

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
    blockchain: 'eos',
    protocol: 'https',
    host: 'mainnet.libertyblock.io',
    port: 7777,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

    // const network = {
    //     blockchain:'eos',
    //     protocol:'https',
    //     host:'nodes.get-scatter.com',
    //     port:443,
    //     chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    // }

};const eos = EosApi(network);

const mapStateToProps = store => ({
    scatterID: store.scatterID,
    error: store.error,
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

    encrypt(nonce) {
        var iv = Buffer.from('0000000000000000');
        nonce++;
        let key = Config.saltKey;
        let message = nonce.toString() + ' ' + this.props.privateKey;
        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        return cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
    }

    send(e) {
        this.props.updateState(["loading", true]);
        const socket = openSocket('http://local.byzanti.ne:8900');
        console.log(socket);
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        socket.emit('user', [Config.apiKey, randChannel]);

        let that = this;

        socket.on(randChannel, (() => {
            var _ref = _asyncToGenerator(function* (data) {
                var _this = this;

                let amt = parseFloat(that.props.amount);
                amt = parseFloat(Math.round(amt * Math.pow(10, 4)) / Math.pow(10, 4)).toFixed(4);
                console.log(data);
                let objReq = {};
                objReq.sig = yield that.encrypt(data);
                objReq.from = that.props.from;
                objReq.to = that.props.to;
                objReq.amount = amt + ' ' + that.props.token;
                objReq.memo = that.props.memo;
                console.log(objReq);

                // await fetch('http://api.byzanti.ne:8902/transfer', {
                yield fetch(`http://local.byzanti.ne:8901/transfer?api_key=${Config.apiKey}`, {
                    method: 'POST',
                    headers: {
                        "api_key": Config.apiKey,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(objReq)
                }).then(function (response) {
                    if (response.status !== 200) alert("We were not able to perform the transaction. Pleae ensure that every field is filled properly.");
                    console.log(response.status);
                    _this.props.updateState(["loading", false]);
                }).catch(function (err) {
                    _this.props.updateState(["loading", false]);
                    alert("We were not able to perform the transaction. Pleae ensure that every field is filled properly.");
                    console.log(err);
                });
                socket.on('disconnect');
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })());
        this.props.updateState(["loading", false]);
    }

    scatterPair() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            _this2.props.updateState(["loading", true]);
            try {
                const connected = yield scatter.connect("wallet-thin");
            } catch (error) {
                _this2.props.updateState(["loading", false]);
                alert("We could not pair with your Scatter account. Please ensure that the Scatter desktop application or web estension is signed in before trying again.");
                // this.props.updateState(["error", "notScatterConnected"]);
            }
            try {
                const requiredFields = { accounts: [network] };
                const ID = yield scatter.getIdentity(requiredFields);
                console.log(ID);
                _this2.props.updateScatter();
                _this2.props.updateState(["from", ID.accounts[0].name]);
                _this2.props.updateState(["privateKey", ID.hash]);
                _this2.props.updateState(["scatterID", ID]);
            } catch (error) {
                _this2.props.updateState(["loading", false]);
                alert("We could not pair with your Scatter account. Please ensure that the Scatter desktop application or web extension is signed in before trying again.");
                // this.props.updateState(["error", "authRefused"]);
            }

            _this2.props.updateState(["loading", false]);
        })();
    }

    scatterSend(e) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            _this3.props.updateState(["loading", true]);

            const account = _this3.props.scatterID.accounts.find(function (x) {
                return x.blockchain === 'eos';
            });
            console.log("account: ", account);

            //     // You can pass in any additional options you want into the eosjs reference.
            //     const eosOptions = { expireInSeconds:60 };


            //     // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
            const eos = scatter.eos(network, Eos);

            const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };
            eos.transfer(account.name, _this3.props.to, _this3.props.amRend + ' ' + _this3.props.coin, _this3.props.memo, transactionOptions).then(function (trx) {
                // That's it!
                console.log(`Transaction ID: ${trx.transaction_id}`);
                _this3.props.updateState(["loading", false]);
            }).catch(function (error) {
                _this3.props.updateState(["loading", false]);
                alert("We were not able to perform the transaction. Please ensure that every field is filled properly.");
            });
        })();
    }

    unFocus(e) {
        this.props.updateState(["amRend", this.props.amount]);
        this.props.updateState(["fiatAmRend", this.props.fiatAm]);
    }

    changeCoin() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            _this4.props.updateState(["loading", true]);
            let response = yield axios(`http://api.byzanti.ne:8902/tokensByAccount/${_this4.props.from}`);
            let balance = {};
            for (let x in response.data) {
                let o = response.data[x];
                balance[o.symbol] = { balance: o.balance, contract: o.contract, precision: o.precision, hash: o.hash };
            }

            yield _this4.props.updateState(["tokens", response.data.map(function (el) {
                return el.symbol;
            })]);
            yield _this4.props.updateState(["balance", balance]);
            if (_this4.props.from !== null) {
                yield _this4.props.updateState(["token", response.data[0].symbol]);
                yield _this4.props.updateState(["usdeur", "USD"]);
            }
            _this4.conversion();
        })();
    }

    conversion() {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            _this5.props.updateState(["loading", true]);
            let rateUSD;

            //http://free.currencyconverterapi.com/api/v5/convert?q=EUR_USD&compact=y
            if (_this5.props.token === 'EOS') {
                let reqCrypComp = yield axios('https://min-api.cryptocompare.com/data/price?fsym=EOS&tsyms=USD,EUR');
                rateUSD = reqCrypComp.data.USD;
            } else {
                let symbol = lodash.filter(listing.data, function (x) {
                    return x.currency === _this5.props.token;
                })[0].symbol;
                let a = yield axios('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/ticker/price', { params: { symbol: symbol } });
                rateUSD = a.data.data.price;
            }
            if (_this5.props.rateEURUSD === null) {
                let respEur = yield axios('http://free.currencyconverterapi.com/api/v5/convert?q=EUR_USD&compact=y');
                _this5.props.updateState(["rateEURUSD", respEur.data.EUR_USD.val]);
            }

            let rateEUR = rateUSD / _this5.props.rateEURUSD;
            _this5.props.updateState(["rate", _this5.props.token]);
            _this5.props.updateState(["USD", rateUSD]);
            _this5.props.updateState(["EUR", rateEUR]);
            if (_this5.props.amount > 0) {
                _this5.props.updateState(["fiatAm", _this5.props.amount * _this5.props.USD]);
                _this5.props.updateState(["fiatAmRend", _this5.props.amount * _this5.props.USD]);
            }
            _this5.props.updateState(["loading", false]);
        })();
    }

    changeInput(e) {
        var _this6 = this;

        return _asyncToGenerator(function* () {

            let payload = [];
            if (e.target.id === 'amount') {
                if (isNaN(Number(e.target.value))) return;else {
                    payload.push(e.target.id, e.target.value);
                    yield _this6.props.updateState(payload);
                    if (_this6.props.token !== null && _this6.props.token !== _this6.props.rate) {
                        _this6.conversion();
                    }
                    if (_this6.props.coin !== null) _this6.props.updateState(["fiatAm", _this6.props.amount * _this6.props[_this6.props.usdeur]]);
                }
            } else if (e.target.id === "from") {
                payload.push(e.target.id, e.target.value);
                yield _this6.props.updateState(payload);
                if (_this6.props.coin !== null) {
                    _this6.changeCoin();
                }
            } else if (e.target.id === "coin") {
                payload.push(e.target.id, e.target.value);
                _this6.props.updateState(payload);
                if (_this6.props.from !== null) {
                    _this6.changeCoin(_this6.props.coin);
                }
            } else if (e.target.id === "token") {
                payload.push(e.target.id, e.target.value);
                yield _this6.props.updateState(payload);
                yield _this6.conversion();
                yield _this6.props.updateState(["fiatAm", _this6.props[_this6.props.usdeur] * _this6.props.amount]);
            } else if (e.target.id === "usdeur") {
                yield _this6.props.updateState(["usdeur", e.target.value]);
                yield _this6.props.updateState(["fiatAm", _this6.props[_this6.props.usdeur] * _this6.props.amount]);
            } else if (e.target.id === "fiat") {
                if (isNaN(Number(e.target.value))) return;else {
                    yield _this6.props.updateState(["fiatAm", e.target.value]);
                    yield _this6.props.updateState(["amount", _this6.props.fiatAm / _this6.props[_this6.props.usdeur]]);
                }
            } else {
                payload.push(e.target.id, e.target.value);
                _this6.props.updateState(payload);
            }
        })();
    }

    render() {
        const scatter = this.props.scatter;
        const tokens = this.props.tokens ? this.props.tokens.map(tok => {
            return React.createElement(
                'option',
                { key: tok, id: tok },
                tok
            );
        }) : null;

        const dialogBox = this.props.error ? React.createElement(
            'div',
            { id: 'dialog' },
            React.createElement(Dialog, { updateState: this.props.updateState, error: this.props.error })
        ) : null;

        // let eosTokens = symbols.map(el => {
        //     return <option id={el}>{el}</option>
        // }) 
        const inputs = [React.createElement('select', { key: 'token', id: 'token', placeholder: 'token', onChange: this.changeInput }), React.createElement('input', { key: 'fiat', id: 'fiat', value: this.props.fiatAmRend, onChange: this.changeInput })];

        let gradient = this.props.token ? this.props.amount / this.props.balance[this.props.token].balance : 0;

        //        #347fb9 ${(1-(this.props.amount/this.props.balance[this.props.token].balance))*100}%

        let Style = {
            borderRadius: '15px',
            margin: 'auto 0',
            background: `#14466C`,
            height: '110%',
            width: `${gradient > 1 ? 100 : gradient * 100}%`,
            zindex: '6'
        };

        let StyleContainer = {
            transform: 'translateY(20%)',
            margin: '0 auto',
            borderRadius: '15px',
            padding: '-5px',
            zindex: '6',
            width: '100%',
            background: 'white',
            height: '5px',
            gridArea: 'j'
        };
        let balance = this.props.token ? this.props.balance[this.props.token].balance - this.props.amount : null;

        const fiatSelec = [React.createElement('input', { key: 'fiat', id: 'fiat', value: this.props.fiatAmRend, onBlur: this.unFocus, onChange: this.changeInput }), React.createElement(
            'select',
            { key: 'usdeur', id: 'usdeur', onChange: this.changeInput },
            React.createElement(
                'option',
                { id: 'USD' },
                'USD'
            ),
            React.createElement(
                'option',
                { id: 'EUR' },
                'EUR'
            )
        ), this.props.token ? React.createElement(
            'p',
            { key: 'balance', id: 'balance', style: { color: balance >= 0 ? 'white' : 'red' } },
            balance.toFixed(4) + ' ' + this.props.token
        ) : null, React.createElement(
            'div',
            { style: StyleContainer },
            React.createElement('div', { style: Style, key: 'balanceVisual', id: 'balanceVisual' })
        )];

        const override = /*#__PURE__*/css('top:-200px;border-color:red;margin:0 auto;z-index:5;');

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'Wallet' },
                inputs.map(el => {
                    if (el.key === "from" || el.key === "privateKey") {
                        if (!scatter) return el;
                    } else if (el.key === 'token' && this.props.token !== null) {
                        return React.createElement(
                            'select',
                            { key: 'token', id: 'token', placeholder: 'token', onChange: this.changeInput },
                            tokens
                        );
                    } else if (el.key === 'fiat' && this.props.token !== null) {
                        return fiatSelec;
                    }
                }),
                React.createElement('input', { key: 'from', id: 'from', placeholder: 'From', value: this.props.from, onChange: this.changeInput }),
                React.createElement('input', { key: 'privateKey', id: 'privateKey', type: 'password', placeholder: 'Enter your private key', value: this.props.privateKey, onChange: this.changeInput }),
                React.createElement('input', { key: 'to', id: 'to', placeholder: 'To', onChange: this.changeInput }),
                React.createElement('input', { key: 'amount', id: 'amount', placeholder: 'Amount', value: this.props.amRend, onChange: this.changeInput, onBlur: this.unFocus }),
                React.createElement(
                    'select',
                    { key: 'coin', id: 'coin', placeholder: 'Coin', onChange: this.changeInput },
                    React.createElement(
                        'option',
                        { id: 'null' },
                        'Chain'
                    ),
                    React.createElement(
                        'option',
                        { id: 'EOS' },
                        'EOS'
                    ),
                    React.createElement(
                        'option',
                        { id: 'ETH' },
                        'ETH'
                    )
                ),
                React.createElement('input', { key: 'memo', id: 'memo', placeholder: 'Memo', onChange: this.changeInput }),
                React.createElement(
                    'button',
                    { id: 'send', key: 'send', onClick: this.props.scatter ? this.scatterSend : this.send },
                    'Send'
                ),
                React.createElement(
                    'label',
                    { className: 'Scatter' },
                    React.createElement('input', { type: 'checkbox', id: 'scatter', onChange: this.scatterPair }),
                    React.createElement('span', { className: 'checkmark' }),
                    React.createElement(
                        'p',
                        null,
                        'Transfer with Scatter'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'sweet-loading' },
                React.createElement(Loader, {
                    className: override,
                    sizeUnit: "px",
                    size: 70,
                    color: '#14466C',
                    loading: this.props.loading })
            ),
            dialogBox
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);