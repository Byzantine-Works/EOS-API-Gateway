'use strict';

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});


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
        index: 'B-EOS-API',
        type: 'methods'
    }).then(function (resp) {
        var hits = resp.hits.hits;
        console.log(hits);
    }, function (err) {
        console.trace(err.message);
    });
}

function write() {
    client.index({
        index: 'B-EOS-API',
        type: 'methods',
        body: {
            "methodname": "Get Current Balance",
            "methodstatus": true,
            "responsetime": 1.2,
            "apikey": "saas-n-brkr01",
            "ts": 12312332
        }
    }, function (err, resp, status) {
        console.log(resp);
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
//write();
//read();

module.exports.ping = ping;
module.exports.read = read;
module.exports.index = index;