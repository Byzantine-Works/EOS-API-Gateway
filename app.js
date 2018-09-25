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

var app = require('express')();
module.exports = app; // for testing

// var config = {
//   appRoot: __dirname // required config
// };
var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    APIKeyHeader: function (req, authOrSecDef, scopesOrApiKey, cb) {
      // your security code
      
      var allKeys = {};    
     // Sample allKeys: 
      allKeys = { 
        "samplekey1234": {
          isEnabled: true,
          callCount: 0,
        },
        "disabledkey1234": {
          isEnabled: false,
          callCount: 0,
        },
        "exchange1-ApiKey": {
          isEnabled: true,
          callCount: 0,
          getInfo: 0,
          tokens: 0,
          tokensByAccount: 0,
        },
      }
      
      // if (scopesOrApiKey === 'samplekey1234') { // Singlekey functionality
      if (allKeys.hasOwnProperty(scopesOrApiKey) === true) { // Multikey functionality
      // if (allKeys[scopesOrApiKey]["isEnabled"] === true) { // Multikey functionality
        console.log('~ API Key Accepted ~');
        cb(null);
      } else {
        cb(new Error('access denied!'));
      }
    }
  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

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
      // elasticsearch: 'http://127.0.0.1:9200'
      // onAuthenticate: function (req, username, password) {
      //   // simple check for username and password
      //   return ((username === 'swagger-stats') &&
      //     (password === 'swagger-stats'));
    }));

    swaggerExpress.register(app);
    app.listen(process.env.API_GATEWAY_PORT || 8080);
    if (swaggerExpress.runner.swagger.paths['/info']) {
      //console.log('Bound to port: ' + process.env.API_GATEWAY_PORT || 8080);
      console.log('Try this:=> curl ' + process.env.API_GATEWAY_HOST + ':' + process.env.API_GATEWAY_PORT || 8080 + '/info');
    }
  });
});