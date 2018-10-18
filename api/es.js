'use strict';

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});

const indexName = "eosapievents";
const indexType = "eosapievent";
const apiKeyIndexName = "apikeys"
const apiKeyIndexType = "apikey"

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
                                    "assetBuy.keyword": symbol
                                }
                            },
                            {
                                "match": {
                                    "side.keyword": side
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
                                    "assetSell.keyword": symbol
                                }
                            },
                            {
                                "match": {
                                    "side.keyword": side
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
//ping();
//index();
//write();
//read();
//testAuditEvent();
//addApiKey('Byzantine Skinny(Stripe) Web Wallet','FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N','http://local.byzanti.ne:8905/webhook',0,'bf32eb1e0b28d4b75bb1da9eaa4c5b02',0);

// getApiKeySet('FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N').then(function (result) {
//     console.log("getApiKeySet => " + JSON.stringify(result.hits.hits[0]._source));
// }, function (err) {
//     console.log("getApiKeyset => error: " + err);
// });

// incrementNonce('FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N',16).then(function (result) {
//     console.log("incrementNonce => " + JSON.stringify(result));
// }, function (err) {
//     console.log("incrementNonce => error: " + err);
// });

//Export Methods
// module.exports.ping = ping;
// module.exports.read = read;
// module.exports.index = index;
// module.exports.testAuditEvent = testAuditEvent;
module.exports.auditAPIEvent = auditAPIEvent;
module.exports.addApiKey = addApiKey;
module.exports.addApiKey4Keygen = addApiKey4Keygen;
module.exports.getApiKeySet = getApiKeySet;
module.exports.incrementNonce = incrementNonce;
module.exports.readIndex = read;
module.exports.getOrders = getOrders;