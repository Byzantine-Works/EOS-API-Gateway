'use strict';

const crypto = require('crypto');
const request = require('request');
const config = require('./chainsnapshot.js');
const elasticsearch = require('elasticsearch');
const nodeDateTime = require('node-datetime');
var sleep = require('sleep');
const ecc = require("eosjs-ecc");

// const sleep = require('sleep');

//A list of initial dexes part of LDAR
const exchanges = ["uberdex", "mbaex", "adex", "bdex", 'whalex', 'blockex'];

const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO,
    requestTimeout: Infinity
    //log: 'trace'
});

function getHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

function getSig() {
    return "SIG_K1_REDD" + crypto.randomBytes(45).toString('hex');
}

function getAccountName() {
    var rndIndex = Math.floor(Math.random() * config.chainData.length);
    if (typeof config.chainData[rndIndex].account_name === 'undefined') {
        //throw new Error("Cannot load account from chain snapshot");
        //console.log("Random account from chain => " + rndIndex + " => a.dummy");
        return "a.dummy";
    }
    //console.log("Random account from chain => " + rndIndex + " => " + config.chainData[rndIndex].account_name);
    return config.chainData[rndIndex].account_name;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function ping() {
    client.ping({
        requestTimeout: 30000,
    }, function (error) {
        if (error) {
            console.error('Elasticsearch cluster is down!');
        } else {
            console.log('All is well!');
        }
    });
}


function readTickers(symbol) {
    return read('tickers', 'ticker', symbol);
}

function readOrders() {
    return read('orders', 'order');
}

function readTrades() {
    return read('trades', 'trade');
}


function readExchanges() {
    return read('exchanges', 'exchange');
}

async function readSymbols() {
    return await client.search({
        index: "symbols",
        type: "symbol",
        size: 10000
    });
}

function getSymbolByCurrency(currency) {
    client.search({
        index: 'symbols',
        type: 'symbol',
        body: {
            query: {
                match: {
                    currency: currency
                }
            }
        }
    }).then(function (symbol) {
        console.log("getSymbolByCurrency :: currency:" + currency + " has ordersize = " + symbol.hits.hits.length);
        return symbol.hits.hits[0];
    }, function (err) {
        console.log("Error in getSymbolByCurrency " + err);
    });

}

function loadSymbols() {
    console.log("Deleting symbols...!");
    deleteRecords('symbols', 'symbol');
    console.log("Loading symbols...!");
    request.get('https://api.newdex.io/v1/common/symbols', function (err, res, body) {
        if (err) //TODO: handle err
        {
            console.log("Error in loadSymbols => " + err);
        } else {
            //console.log((body));
            var indexableData = JSON.parse(body);
            for (var i = 0, len = indexableData.data.length; i < len; i++) {
                console.log("Adding symbol => " + JSON.stringify(indexableData.data[i]));
                // dont like "tradingpair": "trybenetwork-trybe-eos"
                indexableData.data[i].tradingpair = (indexableData.data[i].currency).toLowerCase() + "_eos";
                indexableData.data[i].symbol = (indexableData.data[i].currency).toLowerCase() + "_eos";
                client.index({
                    index: 'symbols',
                    type: 'symbol',
                    body: indexableData.data[i]
                }, function (err, resp, status) {
                    console.log(resp);
                });
            }
        }
    });
}
// }

function loadTickers() {
    console.log("Deleting Tickers...!");
    deleteRecords('tickers', 'ticker');
    console.log("Loading Tickers...!");

    readSymbols().then(function (symbols) {
        console.log("Symbol data size is " + JSON.stringify(symbols.hits.hits.length));
        //console.log("Symbol data is " + JSON.stringify(symbols.hits.hits));
        if (typeof symbols === 'undefined') throw new Error("Cannot load symbols");
        for (var i = 0, len = symbols.hits.hits.length; i < len; i++) {
            console.log("qs => " + 'https://api.newdex.io/v1/ticker?symbol=' + symbols.hits.hits[i]._source.symbol);
            request.get('https://api.newdex.io/v1/ticker?symbol=' + symbols.hits.hits[i]._source.symbol, function (err, res, body) {
                if (err) //TODO: handle err
                {
                    console.log(err);
                } else {
                    if (typeof body !== 'undefined' && body) {
                        var indexableData = JSON.parse(body);
                        console.log("Raw Ticker for Symbol is  => " + body);
                        console.log("Loading Ticker data => " + JSON.stringify(indexableData));
                        console.log("STatus code => " + indexableData.code);
                        if (indexableData.code != 501 && indexableData.data.last) {
                            indexableData.data.tradingpair = indexableData.data.currency + "_eos";
                            indexableData.data.symbol = (indexableData.data.currency).toUpperCase();
                            delete indexableData.data.currency;
                            //console.log(indexableData);
                            //process.exit();
                            client.index({
                                index: 'tickers',
                                type: 'ticker',
                                body: indexableData
                            }, function (err, resp, status) {
                                console.log(resp);
                            });
                        }
                    }
                }
            });
        }
    });
}

function deleteExchanges() {
    console.log("Deleting Exchanges...");
    deleteRecords("exchanges", "exchange");
}

function deleteOrders() {
    console.log("Deleting Orders...!");
    deleteRecords('orders', 'order');
}

function deleteTrades() {
    console.log("Deleting Trades...!");
    deleteRecords('trades', 'trade');
}

function loadExchanges() {
    //TODO Do we need supported symbols per exchange?
    //TODO Do we need suported order types, LIMIT and MARKET?
    var exchanges = ['uberdex', "adex", 'bdex', 'mbaex'];
    console.log("Loading Exchanges of size => " + exchanges.length);
    var indexableExchange = [];
    for (var i = 0, len = exchanges.length; i < len; i++) {
        var exchange = {};
        exchange.name = exchanges[i];
        exchange.makerFee = 0.01;
        exchange.takerFee = 0.02;
        exchange.feeAccount = exchanges[i] + '.fee';
        exchange.LDARenabled = 1; //whether the exchanges wants to settle trades from other exchanges
        // exchange.LDARmakerfee; //Do we share profits between the ex or jut leave the makler/taker fee
        // exchange.LDARtakerfee; // TODO think?
        exchange.created = nodeDateTime.create().format('Y-m-d H:M:S');
        exchange.updated = nodeDateTime.create().format('Y-m-d H:M:S');
        exchange.timestamp = Math.floor(new Date() / 1000);
        client.index({
            index: 'exchanges',
            type: 'exchange',
            body: exchange
        }, function (err, resp, status) {
            console.log(status);
            if (err)
                console.log("loadExchanges err => " + err);
            else
                console.log("loadExchanges resp => " + (resp));
        });
    }
}

function loadTrades() {
    const BASE_CHAIN = "EOS";
    console.log("Loading Symbols...!");
    readSymbols().then(function (symbols) {
        console.log("Symbol data size is " + JSON.stringify(symbols.hits.hits.length));
        if (typeof symbols === 'undefined') throw new Error("Cannot load symbols");
        for (var i = 0, len = symbols.hits.hits.length; i < len; i++) {
            //for each symbol, load its corresponding asks/bids
            console.log("Fetching orderbook for => " + symbols.hits.hits[i]._source.symbol.split("_")[0].toUpperCase());
            request.get('http://local.byzanti.ne:8901/orderbook?size=150&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N&symbol=' + symbols.hits.hits[i]._source.symbol.split("_")[0].toUpperCase(), function (err, res, body) {
                if (err) //TODO: handle err
                {
                    console.log(err);
                } else if (JSON.parse(body).asks.length > 0 && JSON.parse(body).bids.length > 0) {
                    var asks = JSON.parse(body).asks;
                    var bids = JSON.parse(body).bids;

                    console.log("asks data size is => " + (asks.length));
                    console.log("bids data size is => " + (bids.length));

                    //Setup a random but unique numbers between 0-99
                    var arr = [];
                    while (arr.length < 20) {
                        var randomnumber = Math.floor(Math.random() * 100) + 1;
                        if (arr.indexOf(randomnumber) > -1) continue;
                        arr[arr.length] = randomnumber;
                    }

                    //buy from a few asks by matching the price and amount
                    //TODO build for case of partial fills
                    var askTrades = [];
                    for (var j = 0, len = arr.length; j < len; j++) {
                        if (asks[arr[j]] === undefined) {
                            continue;
                        }
                        var askTaker = getAccountName();
                        var source = exchanges[Math.floor(Math.random() * exchanges.length)];
                        console.log(askTaker + " about to take asks for order => " + arr[j] + " from source@" + source + " with data= " + JSON.stringify(asks[arr[j]]));
                        var trade = {};
                        trade.chain = BASE_CHAIN;
                        trade.assetBuy = asks[arr[j]].assetSell;
                        trade.assetSell = asks[arr[j]].assetBuy;
                        trade.amountBuy = asks[arr[j]].amountSell;
                        trade.amountSell = asks[arr[j]].amountBuy;
                        trade.price = asks[arr[j]].price;
                        trade.type = asks[arr[j]].type;
                        trade.hash = getHash();
                        trade.maker = asks[arr[j]].useraccount;
                        trade.taker = askTaker;
                        trade.makerExchange = asks[arr[j]].source;
                        trade.takerExchange = source;
                        //TODO load these from exchange specific data
                        trade.makerFee = (trade.amountBuy * 0.01).toFixed(4); // + " " + trade.assetBuy;
                        trade.takerFee = (trade.amountSell * 0.02).toFixed(4); // + " " + trade.assetSell;
                        trade.created = nodeDateTime.create().format('Y-m-d H:M:S');
                        trade.updated = nodeDateTime.create().format('Y-m-d H:M:S');
                        trade.feediscount = asks[arr[j]].feediscount;
                        trade.timestamp = Math.floor(new Date() / 1000) + Math.floor(Math.random() * 60) + 1;
                        trade.makerSignature = getSig();
                        trade.takerSignature = getSig();
                        console.log(trade);
                        //execute the trade on chain
                        //update the orderbook
                        console.log("Updating order with id => " + asks[arr[j]].orderId);
                        try {
                            updateOrderByOrderId(asks[arr[j]].orderId);
                        } catch (err) {
                            console.log(err);
                        }
                        //insert trade
                        askTrades.push({
                            index: {
                                _index: 'trades',
                                _type: 'trade'
                            }
                        });
                        askTrades.push(trade);
                    }

                    //sell to a few bids by matching the price and amount
                    //TODO build for case of partial fills
                    for (var j = 0, len = arr.length; j < len; j++) {
                        if (bids[arr[j]] === undefined) {
                            continue;
                        }
                        var bidTaker = getAccountName();
                        var source = exchanges[Math.floor(Math.random() * exchanges.length)];
                        console.log(bidTaker + " about to take bids for order => " + arr[j] + " from source@" + source + " with data= " + JSON.stringify(bids[arr[j]]));
                        var trade = {};
                        trade.chain = BASE_CHAIN;
                        trade.assetBuy = bids[arr[j]].assetSell;
                        trade.assetSell = bids[arr[j]].assetBuy;
                        trade.amountBuy = bids[arr[j]].amountSell;
                        trade.amountSell = bids[arr[j]].amountBuy;
                        trade.price = bids[arr[j]].price;
                        trade.type = bids[arr[j]].type;
                        trade.hash = getHash();
                        trade.maker = bids[arr[j]].useraccount;
                        trade.taker = bidTaker;
                        trade.makerExchange = bids[arr[j]].source;
                        trade.takerExchange = source;
                        //TODO load these from exchange specific data
                        trade.makerFee = (trade.amountBuy * 0.01).toFixed(4); // + " " + trade.assetBuy;
                        trade.takerFee = (trade.amountSell * 0.02).toFixed(4); // + " " + trade.assetSell;
                        trade.created = nodeDateTime.create().format('Y-m-d H:M:S');
                        trade.updated = nodeDateTime.create().format('Y-m-d H:M:S');
                        trade.feediscount = bids[arr[j]].feediscount;
                        trade.timestamp = Math.floor(new Date() / 1000) + Math.floor(Math.random() * 60) + 1;
                        trade.makerSignature = getSig();
                        trade.takerSignature = getSig();
                        console.log(trade);
                        //execute the trade on chain
                        //update the orderbook
                        console.log("Updating order with id => " + bids[arr[j]].orderId);
                        try {
                            updateOrderByOrderId(bids[arr[j]].orderId);
                        } catch (err) {
                            console.log(err);
                            resume;
                        }
                        //insert trade
                        askTrades.push({
                            index: {
                                _index: 'trades',
                                _type: 'trade'
                            }
                        });
                        askTrades.push(trade);
                    }
                    //bulk index bidTrades
                    console.log("askTrades size => " + askTrades.length);

                    // setTimeout(function () {
                    if (askTrades.length > 0) {
                        client.bulk({
                            index: 'trades',
                            type: 'trade',
                            body: askTrades
                        }, function (err, resp, status) {
                            sleep.sleep(1);
                            console.log(status);
                            if (err) {
                                console.log("loadTrades Trades err => " + err);
                            } else
                                console.log("loadTrades Trades resp => " + ((resp)));
                        });
                    }
                    // }, 4000);
                }
            });
        }
    });
}

async function updateOrderByOrderId(orderId) {
    await client.update({
        index: 'orders',
        type: 'order',
        id: orderId,
        body: {
            doc: {
                filled: 1
            }
        }
    });
}

function loadOrders() {
    var BASE_SYMBOL = "EOS";
    console.log("Loading Orders...!");
    readSymbols().then(function (symbols) {
        console.log("Symbol data size is " + JSON.stringify(symbols.hits.hits.length));
        //console.log("Symbol data is " + JSON.stringify(symbols.hits.hits));
        if (typeof symbols === 'undefined') throw new Error("Cannot load symbols");

        for (var i = 0, len = symbols.hits.hits.length; i < len; i++) {
            console.log("Loading Orders for => " + symbols.hits.hits[i]._source.symbol);
            //get ticker data
            request.get('http://local.byzanti.ne:8901/ticker?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N&symbol=' + symbols.hits.hits[i]._source.symbol, function (err, res, body) {
                if (err) //TODO: handle err
                {
                    console.log(err);
                } else {
                    //console.log(body);
                    var orders = [];
                    for (var j = 0, len = 3000; j < len; j++) {
                        var order = {};
                        var ticker = JSON.parse(body);

                        if (typeof ticker !== 'undefined' && ticker.length > 0) {

                            //set up randomizers
                            var items = [1, 2];
                            var expires = ["1d", "2d", "3d", "7d"];
                            var source = exchanges[Math.floor(Math.random() * exchanges.length)];

                            var item = items[Math.floor(Math.random() * items.length)];
                            var expire = expires[Math.floor(Math.random() * expires.length)];
                            var randomOrderPrice = ((Math.random() * (1.12 - 0.98) + 0.98) * parseFloat(ticker[0].last)).toFixed(7);

                            var randomAmount = (Math.random() * (649678.1234 - 12312.1234) + 12312.10).toFixed(4);
                            var randomAmountBuy = (randomAmount * randomOrderPrice).toFixed(4);
                            var randomSell = (randomOrderPrice * randomAmountBuy).toFixed(4);

                            //construct order
                            // order.quantity = randomAmount;
                            order.source = source;
                            order.price = parseFloat(randomOrderPrice);
                            order.side = (order.price > (parseFloat(ticker[0].last)).toFixed(7)) ? "SELL" : "BUY"; //BUY/SELL
                            order.chain = BASE_SYMBOL;
                            if (order.side.includes("BUY")) {
                                // console.log("BUY ORDER");
                                order.assetBuy = ticker[0].symbol;
                                order.assetSell = BASE_SYMBOL;
                                order.amountBuy = parseFloat(randomAmountBuy);
                                order.amountSell = parseFloat(randomSell);
                            } else {
                                // console.log("SELL ORDER");
                                order.assetBuy = BASE_SYMBOL;
                                order.assetSell = ticker[0].symbol;
                                order.amountBuy = parseFloat(randomSell);
                                order.amountSell = parseFloat(randomAmountBuy);
                            }
                            order.expires = expire; // 1d, 2d, 3d, 7d?
                            order.type = 2; //1 = MARKET, 2 = LIMIT

                            // order.nonce = 2434;
                            order.hash = getHash();
                            order.useraccount = getAccountName();
                            order.filled = item; //1 = FILLED 2 = NOT FILLED
                            order.cancelled = item; //1 = CANCELLED 2 = NOT CANCELLED
                            order.new = item; //1 = NEW 2= NOT NEW?
                            order.created = nodeDateTime.create().format('Y-m-d H:M:S');
                            order.updated = nodeDateTime.create().format('Y-m-d H:M:S');
                            order.feediscount = item; //1 = FEE DISCOUNT else NOT (if the participant dex pays outside the exec window)?
                            order.timestamp = Math.floor(new Date() / 1000);
                            order.signature = getSig();
                            //console.log(" Order is => " + JSON.stringify(order, null, 4));
                            //process.exit(-23);
                            orders.push({
                                index: {
                                    _index: 'orders',
                                    _type: 'order'
                                }
                            });
                            orders.push(order);
                        }
                    }
                    console.log("Order size for => " + JSON.stringify(body) + " is => " + orders.length);
                    client.bulk({
                        index: 'orders',
                        type: 'order',
                        body: orders
                    }, function (err, resp, status) {
                        sleep.sleep(1);
                        console.log(status);
                        if (err)
                            console.log("loadOrders err => " + err);
                        else
                            console.log("loadOrders resp => " + (resp));
                    });
                }
            });
        }
    });
}


function read(indexName, indexType, query) {
    //console.log("index:type:query is => " + indexName + ":" + indexType + ":" + query);
    client.search({
        index: indexName,
        type: indexType,
        q: query
    }).then(function (resp) {
        var hits = resp.hits.hits;
        // console.log(JSON.stringify(hits, null, 4));
        console.log("read:: returning data of length => " + resp.hits.total);
        return hits;
    }, function (err) {
        console.log(err);
    });
}

function deleteRecords(indexName, indexType) {
    console.log("deleteRecords:indexName:indexType is => " + indexName + ":" + indexType);
    client.deleteByQuery({
        index: indexName,
        type: indexType,
        q: "*"
    }).then(function (resp) {
        console.log("deleteRecords: status => " + JSON.stringify(resp));
    }, function (err) {
        console.log("Error in deleteRecords: => " + err);
    });
}

function index(indexName, indexType, object) {
    //console.log(JSON.stringify(object));
    client.index({
        index: indexName,
        type: indexType,
        body: object
    }, function (err, resp, status) {
        //console.log(resp);
        console.log(status);
        if (err) {
            console.log(err);
        }
    });
}
//ping();
//index();
//read();
//loadOrders();
//console.log (getAccountName());

module.exports.loadExchanges = loadExchanges;
module.exports.deleteExchanges = deleteExchanges;
module.exports.readExchanges = readExchanges;

module.exports.loadSymbols = loadSymbols;
module.exports.loadOrders = loadOrders;
module.exports.loadTrades = loadTrades;
module.exports.deleteOrders = deleteOrders;
module.exports.deleteTrades = deleteTrades;
module.exports.loadTickers = loadTickers;
module.exports.readTickers = readTickers;
module.exports.readSymbols = readSymbols;
module.exports.readOrders = readOrders;
module.exports.readTrades = readTrades;

module.exports.read = read;
module.exports.index = index;