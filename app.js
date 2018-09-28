'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

//exports for swagger-ui middleware
var swStats = require('swagger-stats');
//var apiSpec = require('./swagger.json');

// Using swagger-parser to validate swagger spec
var swaggerParser = require('swagger-parser');
var specLocation = "./api/swagger/swagger.yaml"
var swaggerSpec = null;
var parser = new swaggerParser();
var clients = require('./api/controllers/clients')
require('events').EventEmitter.defaultMaxListeners = 50;

var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    APIKeyHeader: function (req, authOrSecDef, scopesOrApiKey, cb) {
      //console.log("Security key => " + scopesOrApiKey);
      var allKeys = {};
      // Sample allKeys: 
      allKeys = {
        "YKP6DKM-DQA43G8-HMJVXEP-11KQQ4H": {
          name: 'defaultKeyForPublic', //this one would be free
          isEnabled: true,
          callCount: 0,
        },
        "FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N": {
          name: 'defaultThinWalletKeyForPublic',
          isEnabled: true,
          callCount: 0,
        },
        "VYRCBG6-DAHMPFR-NVTPZRR-MS1S80M": {
          name: 'meteredKeyForMBAEX',
          isEnabled: true,
          callCount: 0,
        },
        "0EF5EHA-8TD41XD-GSYH8K5-R3DTSDV": {
          name: 'meteredKeyForCoin.us',
          isEnabled: true,
          callCount: 0,
        }
      }
      
      if (allKeys.hasOwnProperty(scopesOrApiKey) && allKeys[scopesOrApiKey]['isEnabled'] === true) {
        // if (scopesOrApiKey === 'samplekey1234') { // Singlekey functionality
        // if (allKeys.hasOwnProperty(scopesOrApiKey) === true) { // Multikey functionality
<<<<<<< HEAD
        console.log('################# API Key Accepted  ##################');
=======
>>>>>>> 6d9aa48d3370a31673f70738f8edee6e5078187c
        cb(null);
      } else {
        cb(new Error('Sorry, Either the api_key is invalid or there was no key supplied. Contact the info@byzanti.ne!'));
      }
    },
    // APIKeyQueryParam: swaggerSecurityHandlers.APIKeyHeader
    APIKeyQueryParam: function(req, authOrSecDef, scopesOrApiKey, cb) {
      console.log('In APIKeyQueryParam ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      config.swaggerSecurityHandlers.APIKeyHeader(req, authOrSecDef, scopesOrApiKey, cb)
    }
    // APIKeyQueryParam: this.APIKeyHeader

  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // Using socket.io to get the nonce
  var server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.listen(8900);

  //Listen to clients connections
  io.on('connection', (client) => {
    client.on('user', async (data) => {
      let nonce = await clients.checkNonce(data[0]);
      client.emit(data[1], nonce);
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
      //elasticsearch: 'http://127.0.0.1:9200'
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