'use strict';
// Using socket.io to get the nonce
var app = require('express')();
var server = require('http').Server(app);
const io = require('socket.io')(server);

const es = require('../api/es');
var checkTransac = require('../api/controllers/isTransactionIrreversible');
const PORT = 9000;
app.listen(PORT, () => console.log('Listening on ', PORT));

//   app.all((req, res, next) => {
//   req.header('Access-Control-Allow-Origin', '*');
//   req.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


io.listen(9090);



//Listen to clients connections
io.on('connection', (client) => {
  client.on('user', async (data) => {
    console.log(data[0]);
    let apiKeySet = await es.getApiKeySet(data[0]);
    console.log("nonce: ", apiKeySet.hits.hits[0]._source.nonce);
    let nonce = apiKeySet.hits.hits[0]._source.nonce;
    client.emit(data[1], nonce);
  });
  client.on('irrevers', async (data) => {
    console.log("pack socket: ", data)
    let resp;
    let timeOut = setTimeout(async function () {
      resp = await checkTransac.isTransactionIrreversible(data);
      await console.log("resp in app.js: ", resp);
      await client.emit('irrevers', resp);
    }, 10000);
  });
});