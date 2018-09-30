const client = require('./clients.js');
var crypto = require('crypto');
var iv = Buffer.from('0000000000000000');

//This function decrypts the nonce and private key using the 
//Common salt exchanged between the customer and api
var decrypt256 = function (apiKey, data) {
    //apiKey is the api security key and must be passed as query param to swagger?
    //TODO: @reddy fix this once we have a securitykey
    // apiKey = "bf32eb1e0b28d4b75bb1da9eaa4c5b02";
    // get the salt key using the apiKey
    var key = client.getSalt4ApiKey(apiKey);
    if (key === null || key === undefined || key.length < 1) throw new Error("Pairing of salt_key & api_key absent!");

    var cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decryptedData = cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
    var cipherTokens = decryptedData.split(" ");
    var token = Number(cipherTokens[0]);
    console.log('Decrypted 256 enc with nonce:key => ' + cipherTokens[0] + ":" + cipherTokens[1]);
    if (token === client.getNonce(key, cipherTokens[0])) {
        console.log("cipher tokens: ", cipherTokens)
        return cipherTokens[1];
    }
    else {
        throw new Error('nonce too low!');
    }
};
module.exports.decryptXStrong = decrypt256;