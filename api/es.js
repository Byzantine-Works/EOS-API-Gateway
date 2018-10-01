'use strict';

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});
const indexName = "eosapievents";
const indexType = "eosapievent";


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

function read() {
    client.search({
        index: indexName,
        type: indexType
    }).then(function (resp) {
        var hits = resp.hits.hits;
        console.log(hits);
    }, function (err) {
        console.trace(err.message);
    });
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
    index(body);
}

function index(object) {
    //console.log("es.index => " + JSON.stringify(object));
    if (process.env.ES_EVENT_AUDIT_ENABLED !== 'false') {
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
    } else {
        console.log("*************API EVENT AUDIT**************");
        console.log(JSON.stringify(object));
        console.log("******************************************");
    }
}
//ping();
//index();
//write();
//read();
//testAuditEvent();

module.exports.ping = ping;
module.exports.read = read;
module.exports.index = index;
module.exports.testAuditEvent = testAuditEvent;
module.exports.auditAPIEvent = auditAPIEvent;