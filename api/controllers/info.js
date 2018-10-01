'use strict';
const eosapi = require('../eosapi.js');
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
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  // var name = req.swagger.params.name.value || 'stranger';
  //var info = util.format('Ola Reddy!');
  
      
  // console.log('\n@@@@@@@@@@@@@@@@@@@ req.headers is: ')
  // console.log(req.headers)  
  // console.log('@@@@@@@@@@@@@@@@@@@ \n')

  // console.log('\n################### req.query is: ')
  // console.log(req.query)  
  // console.log('################### \n')
  
  // console.log('------ req.headers["header-api-key"]: ' + (req.headers["header-api-key"] || 'header-api-key MISSING'))
  // console.log('------ req.query["api_key"]: ' + (req.query["api_key"] || 'api_key MISSING') +'\n')

  eosapi.getNodeInfo().then(function (result) {
    console.log((result));
    //res.status(200).send(result /*JSON.stringify(data,null,2)*/ );
    //res.end();
    //res.json(util.format(result));
    res.json((result));
  }, function (err) {
    console.log(err);
    //res.status(400).send(err);
  });
}