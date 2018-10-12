'use strict';
// Using socket.io to get the nonce
var app = require('express')();
var server = require('http').Server(app);
const io = require('socket.io')(server);

const es = require('../api/es');
var checkTransac = require('../api/controllers/isTransactionIrreversible');
app.listen(process.env.WS_SOCKET_SERVER_PORT, () => console.log('Listening on ', process.env.WS_SOCKET_SERVER_PORT));

  

  io.listen(process.env.WS_SOCKET_SERVER_LISTENER_PORT, {timeout: process.env.WS_SOCKET_TIMEOUT});

  //Listen to clients connections
  io.on(process.env.WS_SOCKET_CHANNEL_ONCONNECT, (client) => {
    client.on(process.env.WS_SOCKET_CHANNEL_MESSAGE, async (data) => {
      console.log(data[0]);
      let apiKeySet = await es.getApiKeySet(data[0]);
      let nonce = apiKeySet.hits.hits[0]._source.nonce;
      client.emit(data[1], nonce);
    });

      //Listen on new transaction id to check it irreversibility every each 15 seconds until true
    client.on(process.env.WS_SOCKET_CHANNEL_TRANSAC_STATUS, async (data) => {

        console.log("pack socket: ", data);

        let int = setInterval(reqTrans, 15000);
        
        async function reqTrans() {
          let resp = await checkTransac.isTransactionIrreversible(data);
            await console.log("resp in server.js: ", resp);
            if(resp.is_irreversible){
              clearInterval(int);
              await client.emit(process.env.WS_SOCKET_CHANNEL_TRANSAC_STATUS, [data, resp.is_irreversible]);
            }
        }

      });
  
  });
