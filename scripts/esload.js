'use strict';
const request = require('request');
const elasticsearch = require('elasticsearch');
const dexconfig = require('../api/dexconfig');
const client = new elasticsearch.Client({
    host: process.env.ES_HOST_INFO
    //log: 'trace'
});


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


function read(indexName, indexType) {
    client.search({
        index: indexName,
        type: indexType
    }).then(function (resp) {
        var hits = resp.hits.hits;
        console.log(JSON.stringify(hits, null, 4));
        //return hits;
    }, function (err) {
        console.log(err);
    });
}

function readTickers() {
    read('tickers', 'ticker');
}

function loadTickers() {
    for (var i = 0, len = dexconfig.symbols.length; i < len; i++) {
        console.log(dexconfig.symbols[i].symbol);
        // request.get('https://jsonplaceholder.typicode.com/todos/1', function (err, res, body) {
        request.get('https://api.newdex.io/v1/ticker?symbol=' + dexconfig.symbols[i].symbol, function (err, res, body) {
            if (err) //TODO: handle err
            {
                console.log(err);
            } else {
                console.log(body);
                client.index({
                    index: 'tickers',
                    type: 'ticker',
                    body: body
                }, function (err, resp, status) {
                    console.log(resp);
                });
            }
        });
    }
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

module.exports.loadTickers = loadTickers;
module.exports.readTickers = readTickers;
module.exports.read = read;
module.exports.index = index;