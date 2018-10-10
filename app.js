'use strict';
var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var es = require("./api/es");
var path = require('path');
var checkTransac = require('./api/controllers/isTransactionIrreversible');

//exports for swagger-ui middleware
var swStats = require('swagger-stats');
//var apiSpec = require('./swagger.json');

// Using swagger-parser to validate swagger spec
var swaggerParser = require('swagger-parser');
var specLocation = "./api/swagger/swagger.yaml"
var swaggerSpec = null;
var parser = new swaggerParser();
require('events').EventEmitter.defaultMaxListeners = 50;

var app = require('express')();
module.exports = app; // for testing

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './thin-wallet-client/dist/index.html'));
// });

app.get('/main.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './thin-wallet-client/dist/main.js'));
});

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    // Allow for Query in addition to Headers
    APIKeyQueryParam: function (req, authOrSecDef, scopesOrApiKey, cb) {
      console.log('~~ In APIKeyQueryParam\n')
      config.swaggerSecurityHandlers.APIKeyHeaderParam(req, authOrSecDef, scopesOrApiKey, cb)
    },
    APIKeyHeaderParam: function (req, authOrSecDef, scopesOrApiKey, cb) {
      //console.log("Security key => " + scopesOrApiKey);
      var allKeys = {};
      // Sample allKeys: 
      allKeys = {
        "V03JKDQ-8484DY7-QY8MVWA-ACTB30V": {
          name: 'Basic key for general public', //this one would be free
          isEnabled: true,
          callCount: 0,
        },
        "FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N": {
          "name": "Byzantine Skinny(Stripe) Web Wallet",
          isEnabled: true,
          callCount: 0,
        },
        "44QR9VJ-NEYMAMC-HYRVT7V-HGA01S8": {
          name: 'MBAEX',
          isEnabled: true,
          callCount: 0,
        },
        "YXA8JA1-8N14DKA-GNJJ2V8-VXJR6AF": {
          name: 'COIN.US',
          isEnabled: true,
          callCount: 0,
        },
        "TNHX1PC-3T5460M-JNSCD1F-8KMKQSH": {
          name: 'COIN.US',
          isEnabled: true,
          callCount: 0,
        }
      }

      // if (scopesOrApiKey === 'samplekey1234') { // Singlekey functionality
      if (allKeys.hasOwnProperty(scopesOrApiKey) && allKeys[scopesOrApiKey]['isEnabled'] === true) {
        //console.log('------ headers["api_key"]: ' + (req.headers["api_key"] || 'api_key MISSING'))
        //console.log('------ query["api_key"]: ' + (req.query["api_key"] || 'api_key MISSING') + '\n')
        console.log('\n~~~~~~~~~~~~ API Key Accepted for name: ' + allKeys[scopesOrApiKey]['name'] + ' ~~~~~~~~~~~~~~~~~~~\n');
        req.headers['api_key'] = scopesOrApiKey; //inject api_key as header arg for consistent access in the backend
        //print headers
        // console.log("app.js printing headers => " + JSON.stringify(req.headers));
        // console.log("app.js printing req.method & req.url => " + req.method + req.url);
        cb(null);
      } else {
        cb(new Error('Sorry, Either the api_key is invalid or no key supplied as header, cookie or query param. Contact info@byzanti.ne!'));
      }
    },
  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // Using socket.io to get the nonce
  var server = require('http').Server(app);
  const io = require('socket.io')(server, {
    origins: '*:*'
  });
  io.listen(process.env.WS_SOCKET_SERVER_PORT);

  //Listen to clients connections
  io.on('connection', (client) => {
    client.on('user', async (data) => {
      console.log(data[0]);
      let apiKeySet = await es.getApiKeySet(data[0]);
      console.log("nonce: ", apiKeySet.hits.hits[0]._source.nonce);
      let nonce = apiKeySet.hits.hits[0]._source.nonce;
      client.emit(data[1], nonce);
      client.on('irrevers', async (data) => {
        console.log("pack socket: ", data)
        let resp;
          let timeOut = setTimeout(async function() {
            resp = await checkTransac.isTransactionIrreversible(data);
            await console.log("resp in app.js: ", resp);
            await client.emit('irrevers', resp);
          }, 10000);
         
      });
    });


  });

  // load swagger ui mw
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  //app.use(cors()); ? is it default?
  //install swagger-stats and configure middleware
  parser.validate(specLocation, function (err, api) {
    if (!err) {
      console.log('Validated swagger.yaml!');
      swaggerSpec = api;
    }

    app.use(swStats.getMiddleware({
      name: 'Byzanti.ne API Gateway',
      version: '1.0.0',
      hostname: "local.byzanti.ne",
      ip: "127.0.0.1",
      timelineBucketDuration: 6000,
      swaggerSpec: swaggerSpec,
      uriPath: '/swagger-stats',
      durationBuckets: [50, 100, 200, 500, 1000, 5000],
      requestSizeBuckets: [500, 5000, 15000, 50000],
      responseSizeBuckets: [600, 6000, 6000, 60000],
      // Make sure both 50 and 50*4 are buckets in durationBuckets, 
      // so Apdex could be calculated in Prometheus 
      // apdexThreshold: 100,
      // onResponseFinish: function (req, res, rrr) {
      //   debug('onResponseFinish: %s', JSON.stringify(rrr));
      // },
      // authentication: true,
      // sessionMaxAge: maxAge,
      //default elastic config @ 9200
      //TODO: Load configs from env
      //elasticsearch: process.env.ES_HOST_INFO //'http://127.0.0.1:9200'
      // onAuthenticate: function (req, username, password) {
      //   // simple check for username and password
      //   return ((username === 'swagger-stats') &&
      //     (password === 'swagger-stats'));
    }));

    swaggerExpress.register(app);
    app.listen(process.env.API_GATEWAY_PORT || 8080);
    if (swaggerExpress.runner.swagger.paths['/info']) {
      //console.log('Bound to port: ' + process.env.API_GATEWAY_PORT || 8080);
      console.log('Try this:=> curl ' + process.env.API_GATEWAY_HOST + ':' + process.env.API_GATEWAY_PORT || 8901 + '/info');
    }
  });
});