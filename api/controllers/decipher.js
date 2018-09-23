const client = require('./clients.js');
var crypto = require('crypto');
var iv = Buffer.from('0000000000000000');

//This function decrypts the nonce and private key using the 
//Common salt exchanged between the customer and api
var decrypt256 = function (data, key) {
    //this key is the security key and must be passed as -X args?
    key = "bf32eb1e0b28d4b75bb1da9eaa4c5b02";
    var cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decryptedData = cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
    
    var cipherTokens = decryptedData.split(" ");
    console.log('Decrypted 256 enc with nonce:key => ' + cipherTokens[0] + ":" + cipherTokens[1]);
    if (cipherTokens[0] > client.getNonce(key, cipherTokens[0]))
        return cipherTokens[1];
    else
        throw new Error('nonce too low!');
};
module.exports.decryptXStrong = decrypt256;
