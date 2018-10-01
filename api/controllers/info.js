'use strict';
const eosapi = require('../eosapi.js');
const {performance} = require('perf_hooks');
var es = require("../es");

/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  info: info
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function info(req, res) {
  var apiKey = req.headers.api_key;
  var t0 = performance.now();
  eosapi.getNodeInfo().then(function (result) {
    // console.log("Headers => "+ JSON.stringify(req.headers));
    // console.log("Req Params => "+ JSON.stringify(req.body));
    console.log((result));
    //res.status(200).send(result /*JSON.stringify(data,null,2)*/ );
    //res.end();
    //res.json(util.format(result));
    var t1 = performance.now();
    es.auditAPIEvent(req, t1 - t0, true);
    res.json((result));
  }, function (err) {
    console.log(err);
    var t2 = performance.now();
    auditAPIEvent(req, t2 - t0, false);
    //res.status(400).send(err);
  });
}