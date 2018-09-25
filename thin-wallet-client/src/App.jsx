import React from 'react';
import Config from './config.json';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
var crypto = require('crypto');


import * as actions from './actions/actions'


const mapStateToProps = store => ({
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
    updateState: data => dispatch(actions.updateState(data))
});


class App extends React.Component {

    constructor(props) {
        super(props);

        this.send = this.send.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.purge = this.purge.bind(this);
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


    purge() {
        const socket = openSocket('http://localhost:8000');
        let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // console.log(randChannel);
        socket.emit('user', [this.props.from, randChannel]);

        socket.on(randChannel, async function (data) {
            console.log(data);
        });
    }


    changeInput(e) {

        let payload = [];
        if (e.target.id === 'amount') {
            let amt = parseFloat(e.target.value)
            amt = parseFloat(Math.round(amt * Math.pow(10, 4)) / Math.pow(10, 4)).toFixed(4);
            payload.push(e.target.id, amt);
        }
        else {
            payload.push(e.target.id, e.target.value)
        }
        this.props.updateState(payload);
    }

    render() {
        return (
            <div className="Wallet">
                <input id="from" placeholder="From" onChange={this.changeInput}></input>
                <input id="privateKey" placeholder="Enter your private key" onChange={this.changeInput}></input>
                <input id="to" placeholder="To" onChange={this.changeInput}></input>
                <input id="amount" placeholder="Enter your amount" onChange={this.changeInput}></input>
                <input id="coin" placeholder="Coin" onChange={this.changeInput} list="coinList"></input>
                <datalist id="coinList">
                    <option value="EOS"></option>
                    <option value="ETH"></option>
                </datalist>
                <input id="memo" placeholder="Memo" onChange={this.changeInput}></input>
                <button id="send" onClick={this.send}>Send</button>
                <button id="purge" onClick={this.purge}>Purge</button>
            </div>

        );
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);