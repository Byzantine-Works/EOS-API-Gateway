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

var config = {
  appRoot: __dirname // required config
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
      console.log('Try this:=> curl ' + process.env.API_GATEWAY_HOST + ':' + process.env.API_GATEWAY_PORT || 8080 + '/info');
    }
  });
});