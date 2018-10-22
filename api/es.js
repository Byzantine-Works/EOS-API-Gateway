'use strict';

var datetime = require('node-datetime');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});

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

//withdrawal
//updateBalanceRecord("reddy", "0.0003", "EOS", EX_ACTION_TYPE_WITHDRAW);

//deposit
//updateBalanceRecord("reddy", "2.0001", "EOS",EX_ACTION_TYPE_DEPOSIT); // "EOS5zr5ypz1KA7Atj2GVwBL5pWUk8cjpKGhDygFhr2VaZVwvXB6of");
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