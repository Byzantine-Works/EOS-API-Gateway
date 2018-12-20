'use strict';

const BN = require("bignumber.js");
var datetime = require('node-datetime');
const elasticsearch = require('elasticsearch');
const nodeDateTime = require('node-datetime');

const WITHDRAWAL = 'withdrawal';

//TODO @reddy: Move these to appropriate configs
const FEE_ACCOUNT = 'uberdex.fee';

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
        sort: 'price:desc',
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
    console.log("buyOrderBook size for " + symbol + "  => " + buyOrderBook.hits.hits.length);
    console.log("sellOrderBook size for  " + symbol + "  => " + sellOrderBook.hits.hits.length);
    var buyOrderData = [];
    for (var i = 0, len = buyOrderBook.hits.hits.length; i < len; i++) {
        buyOrderBook.hits.hits[i]._source.orderId = buyOrderBook.hits.hits[i]._id;
        //hide the hash for now
        buyOrderBook.hits.hits[i]._source.hash = "******************************";
        buyOrderData.push(buyOrderBook.hits.hits[i]._source)
    }

    var sellOrderData = [];
    for (var i = 0, len = sellOrderBook.hits.hits.length; i < len; i++) {
        sellOrderBook.hits.hits[i]._source.orderId = sellOrderBook.hits.hits[i]._id;
        //hide the hash for now
        sellOrderBook.hits.hits[i]._source.hash = "******************************";
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
    return await client.updateByQuery({
        index: apiKeyIndexName,
        type: apiKeyIndexType,
        body: {
            "query": {
                "match": {
                    "key": apikey
                }
            },
            "script": "ctx._source.nonce += 1"
        }
    });
}

async function incrementUserNonce(user, nonce) {
    if (user == null || nonce == null)
        throw new Error(" Cannot increment nonce for null user!");
    return await client.updateByQuery({
        index: 'accounts',
        type: 'account',
        body: {
            "query": {
                "match": {
                    "account": user
                }
            },
            "script": "ctx._source.nonce += 1"
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

async function getNonce(apikey) {
    var keySet = await client.search({
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
    if (keySet.hits.hits.length > 0)
        return keySet.hits.hits[0]._source.nonce;
    else
        throw new Error("Unknown API key " + apikey);
}

async function getUserNonce(user) {
    var keySet = await client.search({
        index: 'accounts',
        type: 'account',
        body: {
            query: {
                match: {
                    account: user
                }
            }
        }
    });
    if (keySet.hits.hits.length > 0)
        return keySet.hits.hits[0]._source.nonce;
    else
        throw new Error("Unknown user account " + user);
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
    var userBalances = await client.search({
        index: 'balances',
        type: 'balance',
        body: {
            query: {
                match: {
                    account: user
                }
            }
        }
    });
    var balances = [];
    for (var i = 0, len = userBalances.hits.hits.length; i < len; i++) {
        //userBalances.hits.hits[i]._source.balanceId = userBalances.hits.hits[i]._id;
        delete userBalances.hits.hits[i]._source.timestamp;
        delete userBalances.hits.hits[i]._source.created;
        delete userBalances.hits.hits[i]._source.updated;
        balances.push(userBalances.hits.hits[i]._source)
    }
    console.log("getUserBalances :: account:" + user + " has distinct token balances = " + balances.length);
    return balances;
}

async function getPrecisionBySymbol(symbol) {
    var symbol = await client.search({
        index: 'symbols',
        type: 'symbol',
        body: {
            query: {
                match: {
                    currency: symbol
                }
            }
        }
    });
    if (symbol.hits.hits != null && symbol.hits.hits.length > 0)
        return symbol.hits.hits[0]._source.currency_precision;
    else
        return 4;
}

async function orderCancel(orderId, orderHash) {
    console.log("orderCancel:orderId:orderHash => " + orderId + ":" + orderHash);
    var signedOrder = await getOrderById(orderId);

    if (signedOrder.hash != orderHash)
        throw new Error("Order Hash does not match the hash used to create order!");
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


async function getAccount(account) {
    console.log("es:req=>getAccount:" + account);
    var userAccount = await client.search({
        index: 'accounts',
        type: 'account',
        body: {
            "query": {
                "match": {
                    "account": account
                }
            }
        }
    });
    //console.log(userAccount);
    if (userAccount.hits.hits.length == 0)
        throw new Error("Account not registered with exchange!");
    else {
        userAccount.hits.hits[0]._source.accountId = userAccount.hits.hits[0]._id;
        return userAccount.hits.hits[0]._source;
    }
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
        size: 10000,
        sort: 'timestamp:desc',
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
    console.log("getOrdersByUser :: user:" + user + " has ordersize = " + orders.length);
    return orders;
}

async function getTradesByUser(user) {
    var userTrades = await client.search({
        index: 'trades',
        type: 'trade',
        size: 10000,
        sort: 'timestamp:desc',
        body: {
            query: {
                match: {
                    taker: user
                }
            }
        }
    });
    var trades = [];
    for (var i = 0, len = userTrades.hits.hits.length; i < len; i++) {
        userTrades.hits.hits[i]._source.tradeId = userTrades.hits.hits[i]._id;
        trades.push(userTrades.hits.hits[i]._source)
    }
    console.log("getTradesByUser :: user:" + user + " has ordersize = " + trades.length);
    return trades;
}

async function addExchange(exchange) {
    console.log(" Adding a new user exchange.. ");
    exchange.updated = datetime.create().format('Y-m-d H:M:S'),
        exchange.created = datetime.create().format('Y-m-d H:M:S'),
        exchange.timestamp = datetime.create().epoch();
    return await client.index({
        index: 'exchanges',
        type: 'exchange',
        body: exchange
    });
}

async function addAccount(account) {
    var accountExists = await client.search({
        index: 'accounts',
        type: 'account',
        body: {
            query: {
                match: {
                    account: account.account
                }
            }
        }
    });

    if (accountExists.hits.hits.length == 0) {
        //insert a new user record
        console.log("registering new user account on exchange");
        await exchangeapi.exregisteruseraccount(account.account);
        console.log(" Creating new user Account.. ");
        return await index(account, 'accounts', 'account');
    }
}

async function getBalanceIDByAccountAndSymbol(account, symbol) {
    var returnData = await client.search({
        index: 'balances',
        type: 'balance',
        body: {
            "query": {
                "bool": {
                    "must": [{
                            "match": {
                                "account": account
                            }
                        },
                        {
                            "match": {
                                "symbol": symbol
                            }
                        }
                    ]
                }
            }
        }
    });
    if (returnData.hits.hits[0]._id != null || returnData.hits.hits[0]._id != 'undefined')
        return returnData.hits.hits[0]._id;
    else
        return [];
}


async function updateTradeBalances(trade) {
    console.log("updateTradeBalances :: req => " + JSON.stringify(trade));
    console.log("ADDING balances for: " + trade.maker + " with amount=" + trade.amountSell + " for symbol=" + trade.assetSell);
    // [0] Updating balances for: maker1 with amount=0.3307 for symbol=EOS -- addition
    var balanceId = await getBalanceIDByAccountAndSymbol(trade.maker, trade.assetSell);
    if (balanceId != null || balanceId != 'undefined') {
        await updateBalances({
            account: trade.maker,
            symbol: trade.assetSell,
            amount: trade.amountSell
        });
    } else {
        var balance = {};
        balance.account = trade.maker;
        balance.amount = trade.amountSell;
        balance.symbol = trade.assetSell;
        balance.updated = datetime.create().format('Y-m-d H:M:S');
        await updateBalances(balance);
    }

    console.log("SUBTRACTING balances for: " + trade.maker + " with amount=" + trade.amountBuy + " for symbol=" + trade.assetBuy);
    // [0] Updating balances for: maker1 with amount=313.0198 for symbol=IQ -- subtraction
    var balance = {};
    balance.account = trade.maker;
    balance.amount = trade.amountBuy;
    balance.symbol = trade.assetBuy;
    balance.updated = datetime.create().format('Y-m-d H:M:S');
    await updateBalances(balance, WITHDRAWAL);

    console.log("SUBTRACTING balances for: " + trade.taker + " with amount=" + trade.amountSell + " for symbol=" + trade.assetSell);
    // [0] Updating balances for: taker1 with amount=0.3307 for symbol=EOS -- subtraction
    var balance = {};
    balance.account = trade.taker;
    balance.amount = trade.amountSell;
    balance.symbol = trade.assetSell;
    balance.updated = datetime.create().format('Y-m-d H:M:S');
    // console.log(balance);
    await updateBalances(balance, WITHDRAWAL);

    console.log("ADDING balances for: " + trade.taker + " with amount=" + trade.amountBuy + " for symbol=" + trade.assetBuy);
    // [0] Updating balances for: taker1 with amount=313.0198 for symbol=IQ -- addition
    var balanceId = await getBalanceIDByAccountAndSymbol(trade.taker, trade.assetBuy);
    if (balanceId == null || balanceId == 'undefined') {
        await updateBalances({
            account: trade.taker,
            symbol: trade.assetBuy,
            amount: trade.amountBuy
        });
    } else {
        var balance = {};
        balance.account = trade.taker;
        balance.amount = trade.amountBuy;
        balance.symbol = trade.assetBuy;
        balance.updated = datetime.create().format('Y-m-d H:M:S');
        // console.log(balance);
        await updateBalances(balance);
    }
    // Update fee account (takerfee)
    console.log("***************************************************************************");
    console.log("Updating Fee account balances => taker fee = " + trade.takerFee + "@" + trade.assetSell);
    console.log("Updating Fee account balances => maker fee = " + trade.makerFee + "@" + trade.assetBuy);
    console.log("***************************************************************************");

    var balanceId = await getBalanceIDByAccountAndSymbol(FEE_ACCOUNT, trade.assetSell);
    if (balanceId == null || balanceId == 'undefined') {
        await updateBalances({
            account: FEE_ACCOUNT,
            symbol: trade.assetSell,
            amount: parseFloat(trade.takerFee)
        });
    } else {
        var balance = {};
        balance.account = FEE_ACCOUNT;
        balance.amount = parseFloat(trade.takerFee);
        balance.symbol = trade.assetSell;
        balance.updated = datetime.create().format('Y-m-d H:M:S');
        // console.log(balance);
        await updateBalances(balance);
    }

    // Update fee account (makerfee)
    var balanceId = await getBalanceIDByAccountAndSymbol(FEE_ACCOUNT, trade.assetSell);
    if (balanceId == null || balanceId == 'undefined') {
        await updateBalances({
            account: FEE_ACCOUNT,
            symbol: trade.assetBuy,
            amount: parseFloat(trade.makerFee)
        });
    } else {
        var balance = {};
        balance.account = FEE_ACCOUNT;
        balance.amount = parseFloat(trade.makerFee);
        balance.symbol = trade.assetBuy;
        balance.updated = datetime.create().format('Y-m-d H:M:S');
        // console.log(balance);
        await updateBalances(balance);
    }
}

async function updateBalances(balance, type) {
    console.log("updateBalances :: req => " + JSON.stringify(balance));
    var amount = parseFloat(balance.amount);

    //check if balance record exists
    //if account for token+user exists update balance
    //if not add new record with token+user
    var balanceAndSymbolExists = await client.search({
        index: 'balances',
        type: 'balance',
        body: {
            "query": {
                "bool": {
                    "must": [{
                            "match": {
                                "account": balance.account
                            }
                        },
                        {
                            "match": {
                                "symbol": balance.symbol
                            }
                        }
                    ]
                }
            } // query: {
            //     match: {
            //         account: balance.account
            //     },
            //     match: {
            //         symbol: balance.symbol
            //     }
            // }
            // "query": {
            //     "bool": {
            //         "should": [{
            //                 "match_phrase": {
            //                     "account": balance.account
            //                 }
            //             },
            //             {
            //                 "match_phrase": {
            //                     "symbol": balance.symbol
            //                 }
            //             }
            //         ]
            //     }
            // }
        }
    });

    if (balanceAndSymbolExists.hits.hits.length > 0) {
        var updateAmount;
        if (type == WITHDRAWAL) {
            //validate amount
            //case of balance record for symbol exist, perform subtraction on withdrawal
            updateAmount = (parseFloat(balanceAndSymbolExists.hits.hits[0]._source.amount) - parseFloat(amount)).toFixed(4);
            if (updateAmount < 0) throw new Error("Withdraw Balance cannot be greater than exchange balance!");
        } else { //case of balance record for symbol exist, perform addition on deposit
            updateAmount = (parseFloat(balanceAndSymbolExists.hits.hits[0]._source.amount) + parseFloat(amount)).toFixed(4);
        }


        console.log("Amount being updated ... => " + updateAmount);
        console.log("Updating balances for: " + balance.account + " with amount=" + balance.amount + " for symbol=" + balance.symbol + " for previous amount = " + balanceAndSymbolExists.hits.hits[0]._source.amount);
        client.update({
            index: 'balances',
            type: 'balance',
            id: balanceAndSymbolExists.hits.hits[0]._id,
            body: {
                doc: {
                    amount: parseFloat(updateAmount),
                    updated: datetime.create().format('Y-m-d H:M:S'),
                    timestamp: datetime.create().epoch()
                }
            }
        });
    } else
        client.index({
            index: 'balances',
            type: 'balance',
            body: balance
        });
}

async function orderMake(order) {
    var userAccount = await getAccount(order.useraccount);
    if (userAccount == null || userAccount == 'undefined' || userAccount.activekey == null || userAccount.activekey == 'undefined')
        throw new Error("User account not found or the public key is not registered with exchange!");

    //precision mux
    var pAssetBuy = await getPrecisionBySymbol(order.assetBuy);
    var pAssetSell = await getPrecisionBySymbol(order.assetSell);
    var amountBuy = parseFloat(order.amountBuy.toFixed(pAssetBuy));
    var amountSell = parseFloat(order.amountSell.toFixed(pAssetSell));

    var argAmountBuy = BN(amountBuy).multipliedBy(Math.pow(10, pAssetBuy));
    var argAmountSell = BN(amountSell).multipliedBy(Math.pow(10, pAssetSell));

    //Set BNs
    order.amountBuy = argAmountBuy;
    order.amountSell = argAmountSell;

    if (order.useraccount != "taker1" && order.useraccount != "maker1")
        await exchangeapi.validateOrder(order, userAccount.activekey);

    //Reset BN's
    order.amountBuy = amountBuy;
    order.amountSell = amountSell;


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


    //Allow for only IQ/EOS pair trades
    if (order.assetBuy != 'IQ' && order.assetBuy != 'EOS')
        throw new Error("Sorry, only EOS/IQ pair are currently trading on this exchange!");

    if (order.assetSell != 'IQ' && order.assetSell != 'EOS')
        throw new Error("Sorry, only EOS/IQ pair are currently trading on this exchange!");

    //check if the order to take exists and is NOT filled
    var orderById = await getOrderById(orderId);
    order.maker = orderById.useraccount;

    console.log(orderById);
    console.log(" Order status = > " + JSON.stringify(orderById.filled));
    if (orderById.filled == 1) throw new Error("OrderId " + orderId + " has already been filled!");


    // order/trade hashes + maker/taker sigs
    var orderHash = orderById.hash;
    var tradeHash = order.hash;
    var makerSignature = orderById.signature;
    var takerSignature = order.signature;


    //Supported cases
    //Case 1: Non-partial fills
    if (orderById.type == "SELL") {
        if (orderById.amountBuy != order.amountSell && orderById.amountSell != order.amountBuy)
            throw new Error("UberDEX currently does not support partial-fill-buys at the moment!");
    }

    if (orderById.type == "BUY") {
        if (orderById.amountSell != order.amountBuy && orderById.amountBuy != order.amountSell)
            throw new Error("UberDEX currently does not support partial-fill-sells at the moment!");
    }

    //no wash trading with same account?
    if (order.taker == orderById.useraccount)
        throw new Error("Washtrading between the same account is prohibited on this exchange!");

    //take the order on-chain using 'trade' abi action
    //use the right precision
    var pAssetBuy = await getPrecisionBySymbol(order.assetBuy);
    var pAssetSell = await getPrecisionBySymbol(order.assetSell);
    var amountBuy = order.amountBuy.toFixed(pAssetBuy);
    var amountSell = order.amountSell.toFixed(pAssetSell);

    amountBuy = BN(amountBuy).multipliedBy(Math.pow(10, pAssetBuy)); //.toFixed(0);
    amountSell = BN(amountSell).multipliedBy(Math.pow(10, pAssetSell)); //.toFixed(0);

    console.log("***********************************");
    console.log("amountBuy=" + amountBuy + "@" + order.assetBuy);
    console.log("amountSell=" + amountSell + "@" + order.assetSell);
    console.log("***********************************");

    var makerFee = parseFloat(Math.floor(order.makerFee * amountBuy)); //precision mux
    var takerFee = parseFloat(Math.floor(order.takerFee * amountSell)); //precision mux

    console.log("MakerFee => " + makerFee + "@" + order.assetBuy);
    console.log("TakerFee => " + takerFee + "@" + order.assetSell);


    //TODO @reddy remove for prod
    // for testing purposes only: hardcode taker1 and registering keys
    if (order.taker == 'taker1') {
        order.maker = "maker1";
        var makerPK = process.env.USER_PUB_KEY;
        var takerPK = process.env.USER_PUB_KEY;
        //for now brute-force registration of user active pubkeys for hash verification in contract
        //TODO move this to getKeyAccounts on user, and find dynamically active key for registration?
        // var registerMaker = await exchangeapi.exregisteruser(maker, makerPK);
        // var registerTaker = await exchangeapi.exregisteruser(taker, takerPK);
    }

    //on-chain trade settlement
    var tradeApiTransaction = await exchangeapi.extrade('admin', amountBuy, amountSell, 1, amountBuy, 1, order.assetBuy, order.assetSell, makerFee, takerFee, order.maker, order.taker, FEE_ACCOUNT, orderHash, tradeHash, makerSignature, takerSignature);
    console.log(tradeApiTransaction);

    //set order blocknum and transactionId
    order.transactionId = tradeApiTransaction.processed.id;
    order.blockNumber = tradeApiTransaction.processed.block_num;
    order.makerSignature = makerSignature;
    order.takerSignature = takerSignature;
    order.updated = nodeDateTime.create().format('Y-m-d H:M:S');
    order.timestamp = Math.floor(new Date() / 1000);

    //Add the trade entry offchain with the maker/taker fee
    order.makerFee = makerFee / Math.pow(10, pAssetBuy);
    order.takerFee = takerFee / Math.pow(10, pAssetSell);

    console.log("***********************************");
    console.log("Persisting makerFee=" + order.makerFee + "@" + order.assetBuy);
    console.log("Persisting takerFee=" + order.takerFee + "@" + order.assetSell);
    console.log("***********************************");

    var tradeTrx = await client.index({
        index: 'trades',
        type: 'trade',
        body: order
    });

    //add the transaction confirmation id for trade
    tradeTrx.transactionId = tradeApiTransaction.processed.id;
    tradeTrx.blockNumber = tradeApiTransaction.processed.block_num;

    console.log("orderById.amountBuy " + orderById.amountBuy);
    console.log("order.amountBuy " + order.amountBuy);
    console.log("orderById.amountSell " + orderById.amountSell);
    console.log("order.amountSell " + order.amountSell);

    //Update the order entry set filled = 1
    await updateOrderByOrderId(orderId);

    //update trade balances in balances index
    updateTradeBalances(order);

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

async function addWithdrawal(withdrawal) {
    // add a withdrawal record
    await client.index({
        index: 'withdrawals',
        type: 'withdrawal',
        body: withdrawal
    });

    //update balance record
    await updateBalances(withdrawal, WITHDRAWAL);
}

async function getActionSequence(chain) {
    return await client.search({
        index: 'configs',
        type: 'config',
        body: {
            query: {
                match: {
                    chain: chain
                }
            }
        }
    });
}

async function updateActionSequence(chain, sequence) {
    if (sequence == null || sequence < 1)
        throw new Error(" Cannot update sequence for null or <1 !");
    return await client.updateByQuery({
        index: 'configs',
        type: 'config',
        body: {
            "query": {
                "match": {
                    "chain": chain
                }
            },
            "script": "ctx._source.actionsequence = " + sequence
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
module.exports.updateBalances = updateBalances;
module.exports.getUserBalances = getUserBalances;
module.exports.getTradeBook = getTradeBook;
module.exports.orderMake = orderMake;
module.exports.orderCancel = orderCancel;
module.exports.getOrdersByUser = getOrdersByUser;
module.exports.getOrderById = getOrderById;
module.exports.getExchanges = getExchanges;
module.exports.orderTake = orderTake;
module.exports.getNonce = getNonce;
module.exports.getActionSequence = getActionSequence;
module.exports.updateActionSequence = updateActionSequence;
module.exports.index = index;
module.exports.addAccount = addAccount;
module.exports.addWithdrawal = addWithdrawal;
module.exports.getUserNonce = getUserNonce;
module.exports.incrementUserNonce = incrementUserNonce;
module.exports.getTradesByUser = getTradesByUser;
module.exports.addExchange = addExchange;