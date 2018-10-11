'use strict';
// Using socket.io to get the nonce
  var app = require('express')();
  var server = require('http').Server(app);
  const io = require('socket.io')(server);

  const es = require('../api/es');
  var checkTransac = require('../api/controllers/isTransactionIrreversible');
  const PORT  = 9000;
  app.listen(PORT, () => console.log('Listening on ', PORT));

  

  io.listen(9090, {timeout: 50000});

  //Listen to clients connections
  io.on('connection', (client) => {
    client.on('user', async (data) => {
      console.log(data[0]);
      let apiKeySet = await es.getApiKeySet(data[0]);
      console.log("nonce: ", apiKeySet.hits.hits[0]._source.nonce);
      let nonce = apiKeySet.hits.hits[0]._source.nonce;
      client.emit(data[1], nonce);
      client.on('irrevers', async (data) => {

        console.log("pack socket: ", data);

        let int = setInterval(reqTrans, 15000);
        
        async function reqTrans() {
          let resp = await checkTransac.isTransactionIrreversible(data);
            await console.log("resp in app.js: ", resp);
            if(resp.is_irreversible){
              clearInterval(int);
              await client.emit('irrevers', [data, resp.is_irreversible]);
            }
        }

      });
    });


  });

