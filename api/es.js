'use strict';

var datetime = require('node-datetime');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});

const exchangeapi = require('../../UberDEX/test/uberdexapi');

const indexName = "eosapievents";
const indexType = "eosapievent";
const apiKeyIndexName = "apikeys";
const apiKeyIndexType = "apikey";
const accounts_indexName = "accounts";
const accounts_indexType = "account";

const EX_ACTION_TYPE_DEPOSIT = "deposit";
const EX_ACTION_TYPE_WITHDRAW = "withdraw";

// TODO @reddy - clean this up with proper templated calls

function ping() {
    client.ping({
        requestTimeout: 3000,
    }, function (error) {
        if (error) {
            console.error('Elasticsearch cluster is down!');
        } else {
            console.log('Elasticsearch cluster is active!');
        }
    });
}

async function read(indexName, indexType, symbol) {
    return await client.search({
        index: indexName,
        type: indexType,
        q: symbol,
        size: 10000
        // }).then(function (resp) {
        //     var hits = resp.hits.hits;
        //     return hits;
        //     //console.log(hits);
        // }, function (err) {
        //     console.log(err.message);
    });
}

async function getOrders(indexName, indexType, symbol, side, size) {
    // if (side.toString().trim() === 'BUY')
    //TODO : Seems like attribute name cannot be passed dymanically
    //TODO : Figure and fix this later
    if (side.toString().trim() === 'BUY') {
        return await client.search({
            index: indexName,
            type: indexType,
            size: size,
            sort: 'price:desc',
            // chain: "EOS",
            body: {
                query: {
                    "bool": {
                        "must": [{
                                "match": {
                                    "assetBuy": symbol
                                }
                            },
                            {
                                "match": {
                                    "side": side
                                }
                            },
                            {
                                "match": {
                                    "filled": 2
                                }
                            },
                            {
                                "match": {
                                    "cancelled": 2
                                }
                            }
                        ]
                    }
                }
            }
        });
    } else {
        return await client.search({
            index: indexName,
            type: indexType,
            size: size,
            sort: 'price:asc',
            // chain: "EOS",
            body: {
                query: {
                    "bool": {
                        "must": [{
                                "match": {
                                    "assetSell": symbol
                                }
                            },
                            {
                                "match": {
                                    "side": side
                                }
                            },
                            {
                                "match": {
                                    "filled": 2
                                }
                            },
                            {
                                "match": {
                                    "cancelled": 2
                                }
                            }
                        ]
                    }
                }
            }
        });
    }
}

async function getOrderBookTick(symbol, ticksize) {
    return await client.searchTemplate({
        body: {
            id: "orderbooktemplate",
            params: {
                "symbol": symbol,
                "ticksize": ticksize
            }
        }
    });
}

async function getTradeBook(symbol, size) {
    const tradeBook = await client.search({
        index: 'trades',
        type: 'trade',
        size: size,
        sort: 'timestamp:desc',
        // chain: "EOS",
        body: {
            query: {
                "bool": {
                    "should": [{
                            "bool": {
                                "must": [{
                                    "match": {
                                        "assetBuy": symbol
                                    }
                                }]
                            }
                        },
                        {
                            "bool": {
                                "must": [{
                                    "match": {
                                        "assetSell": symbol
                                    }
                                }]
                            }
                        }
                    ]
                }
            }
        }
    });

    console.log("tradebook size => " + tradeBook.hits.hits.length);
    var tradeData = [];
    for (var i = 0, len = tradeBook.hits.hits.length; i < len; i++) {
        tradeBook.hits.hits[i]._source.tradeId = tradeBook.hits.hits[i]._id;
        tradeData.push(tradeBook.hits.hits[i]._source)
    }
    return tradeData;
}

async function getOrderBook(indexName, indexType, symbol, size) {
    const buyOrderBook = await client.search({
        index: indexName,
        type: indexType,
        size: size,
        sort: 'price:desc',
        // chain: "EOS",
        body: {
            query: {
                "bool": {
                    "must": [{
                            "match": {
                                "assetBuy": symbol
                            }
                        },
                        {
                            "match": {
                                "side": "BUY"
                            }
                        },
                        {
                            "match": {
                                "filled": 2
                            }
                        },
                        {
                            "match": {
                                "cancelled": 2
                            }
                        }
                    ]
                }
            }
        }
    });

    const sellOrderBook = await client.search({
        index: indexName,
        type: indexType,
        size: size,
        sort: 'price:asc',
        // chain: "EOS",
        body: {
            query: {
                "bool": {
                    "must": [{
                            "match": {
                                "assetSell": symbol
                            }
                        },
                        {
                            "match": {
                                "side": "SELL"
                            }
                        },
                        {
                            "match": {
                                "filled": 2
                            }
                        },
                        {
                            "match": {
                                "cancelled": 2
                            }
                        }
                    ]
                }
            }
        }
    });
    console.log("buyOrderBook size => " + buyOrderBook.hits.hits.length);
    console.log("sellOrderBook size => " + sellOrderBook.hits.hits.length);
    var buyOrderData = [];
    for (var i = 0, len = buyOrderBook.hits.hits.length; i < len; i++) {
        buyOrderBook.hits.hits[i]._source.orderId = buyOrderBook.hits.hits[i]._id;
        buyOrderData.push(buyOrderBook.hits.hits[i]._source)
    }

    var sellOrderData = [];
    for (var i = 0, len = sellOrderBook.hits.hits.length; i < len; i++) {
        sellOrderBook.hits.hits[i]._source.orderId = sellOrderBook.hits.hits[i]._id;
        sellOrderData.push(sellOrderBook.hits.hits[i]._source)
    }

    var orderbook = {};
    orderbook.asks = sellOrderData;
    orderbook.bids = buyOrderData;
    //console.log("orderbook => " + JSON.stringify(orderbook));

    return orderbook;
}

function testAuditEvent() {
    client.index({
        index: indexName,
        type: indexType,
        body: {
            "method": "Get Current Balance",
            "success": true,
            "sla": 1.2,
            "key": "FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N",
            "ts": 12312332
        }
    }, function (err, resp, status) {
        if (err) console.log(err);
        console.log(resp);
        console.log(status);
        //return resp;
    });
}

function auditAPIEvent(req, mSla, mSuccess) {
    var body = {};
    body.method = req.url.match('^[^?]*')[0];
    body.sla = mSla;
    body.success = mSuccess;
    body.key = req.headers.api_key;
    body.ts = Date.now();
    index(body, indexName, indexType);
}

function addApiKey(name, key, webhook, rate, salt, nonce) {
    if (name == null || key == null || webhook == null || salt == null)
        throw new Error(" Cannot add apiKey with null args!");
    var body = {};
    body.name = name;
    body.key = key;
    body.webhook = webhook;
    body.rate = rate;
    body.nonce = nonce;
    body.salt = salt;
    body.ts = Date.now();
    console.log("addApiKey => " + JSON.stringify(body));
    index(body, apiKeyIndexName, apiKeyIndexType);
}

function addApiKey4Keygen(body) {
    if (body.name == null || body.key == null || body.webhook == null || body.salt == null)
        throw new Error(" Cannot add apiKey with null args!");
    body.ts = Date.now();
    console.log("addApiKey => " + JSON.stringify(body));
    index(body, apiKeyIndexName, apiKeyIndexType);
}

async function incrementNonce(apikey, nonce) {
    if (apikey == null || nonce == null)
        throw new Error(" Cannot increment nonce for null apiKey!");
    var updateNonce = nonce;
    return await client.updateByQuery({
        index: apiKeyIndexName,
        type: apiKeyIndexType,
        body: {
            "query": {
                "match": {
                    "key": apikey
                }
            },
            "script": "ctx._source.nonce=" + updateNonce
        }
    });
}

async function getApiKeySet(apikey) {
    return await client.search({
        index: apiKeyIndexName,
        type: apiKeyIndexType,
        body: {
            query: {
                match: {
                    key: apikey
                }
            }
        }
    });
}

function index(object, indexName, indexType) {
    //console.log("es.index => " + JSON.stringify(object));
    if (process.env.ES_EVENT_AUDIT_ENABLED !== 'false') {
        client.index({
            index: indexName,
            type: indexType,
            body: object
        }, function (err, resp, status) {
            //console.log(JSON.stringify(resp, null, 3));
            //console.log(status);
            if (err) {
                console.log(err);
            }
        });
    } else {
        console.log("*************API INDEX EVENT**************");
        console.log(JSON.stringify(object));
        console.log("******************************************");
    }
}

async function getExchanges() {
    var theExchanges = await client.search({
        index: 'exchanges',
        type: 'exchange',
        size: 10000
    });
    var exchanges = [];
    for (var i = 0, len = theExchanges.hits.hits.length; i < len; i++) {
        theExchanges.hits.hits[i]._source.exchangeId = theExchanges.hits.hits[i]._id;
        exchanges.push(theExchanges.hits.hits[i]._source)
    }
    console.log("getExchanges :: has distinct accounts = " + exchanges.length);
    return exchanges;
}

async function getUserBalances(user) {
    var userAccount = await client.search({
        index: accounts_indexName,
        type: accounts_indexType,
        body: {
            query: {
                match: {
                    user: user
                }
            }
        }
    });
    var accounts = [];
    for (var i = 0, len = userAccount.hits.hits.length; i < len; i++) {
        userAccount.hits.hits[i]._source.accountId = userAccount.hits.hits[i]._id;
        accounts.push(userAccount.hits.hits[i]._source)
    }
    console.log("getUserBalances :: user:" + user + " has distinct token balances = " + accounts.length);
    return accounts;
}

async function orderCancel(orderId, orderHash) {
    console.log("orderCancel:orderId:orderHash => " + orderId + ":" + orderHash);
    return await client.update({
        index: 'orders',
        type: 'order',
        id: orderId,
        body: {
            doc: {
                cancelled: 1
            }
        }
    });
}


async function getOrderById(orderId) {
    var userOrder = await client.search({
        index: 'orders',
        type: 'order',
        body: {
            "query": {
                "match": {
                    "_id": orderId
                }
            }
        }
    });
    if (userOrder.hits.hits.length == 0)
        throw new Error("Order does not exist!");
    else {
        // console.log(userOrder);
        userOrder.hits.hits[0]._source.orderId = userOrder.hits.hits[0]._id;
        return userOrder.hits.hits[0]._source;
    }
}

async function getOrdersByUser(user) {
    var userOrders = await client.search({
        index: 'orders',
        type: 'order',
        body: {
            query: {
                match: {
                    useraccount: user
                }
            }
        }
    });
    var orders = [];
    for (var i = 0, len = userOrders.hits.hits.length; i < len; i++) {
        userOrders.hits.hits[i]._source.orderId = userOrders.hits.hits[i]._id;
        orders.push(userOrders.hits.hits[i]._source)
    }
    console.log("getOrdersByUser :: user:" + user + " has ordersize = " + userOrders.length);
    return orders;
}

async function updateBalanceRecord(user, amount, symbol, type) {
    var dtFormatted = datetime.create().format('Y-m-d H:M:S');
    var amount = parseFloat(amount);
    console.log("addBalanceRecord :: user:amount:symbol => " + user + ":" + amount + ":" + symbol);
    //check if account exists
    //if account for token+user exists update balance
    //if not add new record with token+user
    //TODO Add a check for depositing only accepted tokens
    var accountAndSymbolExists = await client.search({
        index: accounts_indexName,
        type: accounts_indexType,
        body: {
            query: {
                match: {
                    user: user
                },
                match: {
                    symbol: symbol
                }
            }
        }
    });

    if (accountAndSymbolExists.hits.hits.length > 0) {
        //case of account and symbol exist, perform update
        var updateAmount;
        if (type.toString().trim() === EX_ACTION_TYPE_DEPOSIT) {
            updateAmount = (parseFloat(amount) + parseFloat(accountAndSymbolExists.hits.hits[0]._source.amount)).toFixed(4);
        } else if (type.toString().trim() === EX_ACTION_TYPE_WITHDRAW) {
            if ((parseFloat(amount)) > parseFloat(accountAndSymbolExists.hits.hits[0]._source.amount)) {
                throw new Error("Withdrawal amount cannot exceed balance")
            }
            updateAmount = (parseFloat(accountAndSymbolExists.hits.hits[0]._source.amount) - parseFloat(amount)).toFixed(4);
        } else {
            throw new Error("Unknown updateBalanceRecord Type => " + type);
        }
        console.log("Total Sum => " + updateAmount);
        console.log("Updating account:" + user + " with amount=" + amount + " for symbol=" + symbol + " for previous amount = " + accountAndSymbolExists.hits.hits[0]._source.amount);
        return await client.update({
            index: accounts_indexName,
            type: accounts_indexType,
            id: accountAndSymbolExists.hits.hits[0]._id,
            body: {
                doc: {
                    amount: parseFloat(updateAmount),
                    confirmed: 0,
                    updated: dtFormatted,
                    timestamp: datetime.create().epoch()
                }
            }
        });
    } else
        return await client.index({
            index: accounts_indexName,
            type: accounts_indexType,
            body: {
                user,
                amount,
                symbol,
                confirmed: 0,
                created: dtFormatted,
                updated: dtFormatted,
                timestamp: datetime.create().epoch()
            }
        });
}

async function orderMake(order) {
    order.timestamp = datetime.create().epoch();
    order.created = datetime.create().format('Y-m-d H:M:S');
    order.updated = datetime.create().format('Y-m-d H:M:S');
    return await client.index({
        index: 'orders',
        type: 'order',
        body: order
    });
}

async function orderTake(orderId, order) {
    order.timestamp = datetime.create().epoch();
    order.created = datetime.create().format('Y-m-d H:M:S');
    order.updated = datetime.create().format('Y-m-d H:M:S');

    //check if the order to take exists and is NOT filled
    var orderById = await getOrderById(orderId);
    console.log(orderById);
    console.log(" Order status = > " + JSON.stringify(orderById.filled));
    if (orderById.filled == 1) throw new Error("OrderId " + orderId + " has already been filled!");

    //Supported cases
    //Case 1: Non-partial fills
    if (orderById.amountBuy != order.amountSell && orderById.amountSell != order.amountBuy)
        throw new Error("UberDEX currently does not support partial fills at the moment!");


    //take the order on-chain using 'trade' abi action
    var amountBuy = order.amountBuy * 10000; //precision multiplier for contract?
    var amountSell = order.amountSell * 10000; //precision multiplier for contract?

    //TODO temp fix, need precision math for all symbols
    if (order.assetBuy.indexOf("IQ") > -1)
        amountBuy = Math.floor(amountBuy / 10);

    var makerFee = Math.floor(order.makerFee * amountBuy); //precision mux
    var takerFee = Math.floor(order.takerFee * amountSell); //precision mux

    console.log("MakerFee => " + makerFee + " " + order.assetBuy);
    console.log("TakerFee => " + takerFee + " " + order.assetSell);


    //TODO remove for prod: 
    // for testing purposes only: hardcode maker1 taker1 and registering keys
    var maker = "maker1";
    var taker = "taker1";
    var makerPK = "EOS5zr5ypz1KA7Atj2GVwBL5pWUk8cjpKGhDygFhr2VaZVwvXB6of";
    var takerPK = "EOS5zr5ypz1KA7Atj2GVwBL5pWUk8cjpKGhDygFhr2VaZVwvXB6of";

    var registerMaker = await exchangeapi.exregisteruser(maker, makerPK);
    var registerTaker = await exchangeapi.exregisteruser(taker, takerPK);

    //on-chain trade settlement
    var tradeApiTransaction = await exchangeapi.extrade('admin', amountBuy, amountSell, 1, amountBuy, 1, order.assetBuy, order.assetSell, makerFee, takerFee, maker, taker, "uberdex.fee");

    console.log(tradeApiTransaction);
    //Add the trade entry offchain
    var tradeTrx = await client.index({
        index: 'trades',
        type: 'trade',
        body: order
    });

    console.log("orderById.amountBuy " + orderById.amountBuy);
    console.log("order.amountBuy " + order.amountBuy);
    console.log("orderById.amountSell " + orderById.amountSell);
    console.log("order.amountSell " + order.amountSell);

    //Update the order entry set filled = 1
    var updateOrder = await updateOrderByOrderId(orderId);
    return tradeTrx;
}

async function updateOrderByOrderId(orderId) {
    return await client.update({
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

//TODO Quick Tests - Move to Mocha + Chai when appropriate
//getTradeBook("IQ",100);
//getUserBalances("reddy");
//withdrawal
//updateBalanceRecord("reddy", "0.0003", "EOS", EX_ACTION_TYPE_WITHDRAW);

//deposit
//updateBalanceRecord("reddy", "2.0001", "IQ",EX_ACTION_TYPE_DEPOSIT); // "EOS5zr5ypz1KA7Atj2GVwBL5pWUk8cjpKGhDygFhr2VaZVwvXB6of");
//ping();
//index();
//write();
//read();
//testAuditEvent();
//addApiKey('Byzantine Skinny(Stripe) Web Wallet','FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N','http://local.byzanti.ne:8905/webhook',0,'bf32eb1e0b28d4b75bb1da9eaa4c5b02',0);

module.exports.auditAPIEvent = auditAPIEvent;
module.exports.addApiKey = addApiKey;
module.exports.addApiKey4Keygen = addApiKey4Keygen;
module.exports.getApiKeySet = getApiKeySet;
module.exports.incrementNonce = incrementNonce;
module.exports.readIndex = read;
module.exports.getOrders = getOrders;
module.exports.getOrderBook = getOrderBook;
module.exports.getOrderBookTick = getOrderBookTick;
module.exports.updateBalanceRecord = updateBalanceRecord;
module.exports.getUserBalances = getUserBalances;
module.exports.getTradeBook = getTradeBook;
module.exports.orderMake = orderMake;
module.exports.orderCancel = orderCancel;
module.exports.getOrdersByUser = getOrdersByUser;
module.exports.getOrderById = getOrderById;
module.exports.getExchanges = getExchanges;
module.exports.orderTake = orderTake;