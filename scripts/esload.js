'use strict';

const crypto = require('crypto');
const request = require('request');
const config = require('./chainsnapshot.js');
const elasticsearch = require('elasticsearch');
const nodeDateTime = require('node-datetime');
// const sleep = require('sleep');

const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});

function getHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
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
                    var indexableData = JSON.parse(body);
                    console.log("Raw Ticker for Symbol is  => " + body);
                    console.log("Loading Ticker data => " + indexableData);
                    indexableData.data.tradingpair = indexableData.data.symbol;
                    indexableData.data.symbol = indexableData.data.currency;
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
            });
        }
    });
}

function deleteExchanges() {
    console.log("Deleting Exchanges...");
    deleteRecords("exchanges", "exchange");
}

function deleteOrders() {
    console.log("Deleting Tickers...!");
    deleteRecords('orders', 'order');
}

function loadExchanges() {
    //TODO Do we need supported symbols per exchange?
    //TODO Do we need suported order types, LIMIT and MARKET?
    var exchanges = ['UberDEX', "A-DEX", 'B-DEX', 'MBAEX'];
    console.log("Loading Exchanges of size => " + exchanges.length);
    var indexableExchange = [];
    for (var i = 0, len = exchanges.length; i < len; i++) {
        var exchange = {};
        exchange.name = exchanges[i];
        exchange.makerFee = 0.01;
        exchange.takerFee = 0.02;
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

function loadOrders() {
    var BASE_SYMBOL = "EOS";
    // console.log("Deleting Tickers...!");
    // deleteRecords('orders', 'order');
    console.log("Loading Tickers...!");
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
                    console.log(body);
                    var orders = [];
                    for (var j = 0, len = 3800; j < len; j++) {
                        //create 1000 orders per symbol
                        // sleep.sleep(2);
                        var order = {};
                        var ticker = JSON.parse(body);

                        //set up randomizers
                        var items = [1, 2];
                        var expires = ["1d", "2d", "3d", "7d"];
                        var sources = ["UberDEX", "UberDEX", "A-DEX", "B-DEX", "MBAEX"];
                        var source = sources[Math.floor(Math.random() * sources.length)];

                        var item = items[Math.floor(Math.random() * items.length)];
                        var expire = expires[Math.floor(Math.random() * expires.length)];
                        var randomOrderPrice = ((Math.random() * (1.12 - 0.98) + 0.98) * parseFloat(ticker[0].last)).toFixed(7);
                        var randomAmount = (Math.random() * (649678.1234 - 12312.1234) + 12312.10).toFixed(4);
                        var randomAmountBuy = (randomAmount * randomOrderPrice).toFixed(4);
                        var randomSell = (randomOrderPrice * randomAmountBuy).toFixed(4);

                        //construct order
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
                    console.log("Order size => " + orders.length);
                    client.bulk({
                        index: 'orders',
                        type: 'order',
                        body: orders
                    }, function (err, resp, status) {
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
    console.log("index:type:query is => " + indexName + ":" + indexType);
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
module.exports.deleteOrders = deleteOrders;
// module.exports.readOrders = readOrders;
module.exports.loadTickers = loadTickers;
module.exports.readTickers = readTickers;
module.exports.readSymbols = readSymbols;
module.exports.readOrders = readOrders;
module.exports.read = read;
module.exports.index = index;