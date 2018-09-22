'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
const cipher = require('./decipher.js');


module.exports = {
  sellRamBytes: sellRamBytes
};


function sellRamBytes(req, res) {
  var account = req.swagger.params.body.value.account;
  var bytes = req.swagger.params.body.value.bytes;
  var sig = cipher.decryptXStrong(req.swagger.params.body.value.sig);
  console.log("sellRamBytes-req:account:bytes:sig=> " + account + ":" + bytes + ":" + sig);
  eosapi.sellRamBytes(account, bytes, sig).then(function (result) {
    console.log("sellRamBytes-res => " + result);
    res.json((result));
  }, function (err) {
    console.log("Error in sellRamBytes:=>" + err);
    //kluge as 500/40x errors have different json connotatins, one is parsable into JSON the other is not ATM
    try {
      var error = JSON.parse(err);
      res.status(error.code).json(error);
    } catch (e) {
      res.status(400).json(err);
    }
  });
}

function decryptXStrong(enc) {
  var saltKey = 'AAAAB3NzaC1yc2EAAAADAQABAAACAQCwGANOVFW6c1vpRUsLSXTP+7p7ziN5fVMohlJD3kM3qSWpHYYOx4aEGPbMp/SDxyVODRkxLwsb53BEVAotbn5jhbsEb5tCMC8/ZEdKVUjV+4XPauvM5AUH8R//9yhf7mqphOoFRmAm+hEcHdQTt2J9gZZEphyCV6jIhCu1zRUYvzGT8xWvECFzET7OUGtrjN+/ByZpPmYuhcvxqe1IgWHu4JoltEZeSbUd6S2ixaPqvPRPxyVU6c+BVoD8mbbvc5QDB9OmZqel6RJdXbtVGCSE7uVdwhgOHuk2WflhPKU+3qjwG+htH/DO7vvKAiH3Tlqm2DGFewyyqLqhqdRKsCgo1+UyHkBma9Ndcv4u7WjhOZVgxKt+lrQqkdqF9tLnIzq8Hg6ajgBzCtRoIgErVV2TVkBTGVPKIz1QNsGjL4dqcn2TZ/j7ZrKZ0X7KdeeIQ0zrE9JSdad2Xi8+Q/Oq27mDF8RlMJOQl+k630QMNzdiPqs41majij4T3MzWaTAhB5cAjeocV4hBpxUYvr+ocTuoh501oahM2a9aznACC2IU3SeaKzJUm7VcLsKk5Ag+lhZ6PttrAyg/2KIed5f0ChI1sdlVYKZuQS1fXAdPmcHk+DrYruCao+tWL//Q9K72wmUBFBtEl96NqGuadBc1aLDQR6uKGYWz7pU1Id/JWwCjlQ==';
  //var textToDecipher = 'ETk/XFUbB+BVz0bSeLOt9EB3KGhuuGEtVFB3rGFTNtaGnIvB62uF0Zq2XvbvgGIgRzfKsFOBNXQ='; // Text "dataToEncrypt" encrypted using DES using CBC and PKCS5 padding with the key "someprivatekey"
  var iv = Buffer.alloc(8);
  iv.fill(0);

  var decipher = crypto.createDecipheriv('des-cbc', saltKey.substr(0, 8), iv);
  var dec = decipher.update(enc, 'base64', 'utf8');
  dec += decipher.final('utf8');
  console.log('Decrypted strong DES/CBC/PKCS5Padding Key => ' + dec);
  return dec;
}