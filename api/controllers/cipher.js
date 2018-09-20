const client = require('./clients.js');
var crypto = require('crypto');
var javaEncBufferDES_CBS_PKCS5_Padding = "[B@445b84c0";

//This function decrypts the nonce and private key using the 
//Common salt exchanged between the customer and api
//This salt could be api-security-key + someuniquekey such as
//rsa-pub-key
function decryptXStrong(enc) {
    var saltKey = 'Some key exchanged between byzantine and api customer that is quaranteed to be unique';
    //var textToDecipher = 'ETk/XFUbB+BVz0bSeLOt9EB3KGhuuGEtVFB3rGFTNtaGnIvB62uF0Zq2XvbvgGIgRzfKsFOBNXQ='; // Text "dataToEncrypt" encrypted using DES using CBC and PKCS5 padding with the key "someprivatekey"
    var iv = Buffer.alloc(8);
    iv.fill(0);
    var decipher = crypto.createDecipheriv('des-cbc', saltKey.substr(0, 8), iv);
    var dec = decipher.update(enc, 'base64', 'utf8');
    dec += decipher.final('utf8');
    var cipherTokens = dec.split(" ");
    console.log('Decrypted strong DES/CBC/PKCS5Padding nonce:key => ' + cipherTokens[0] + ":" + cipherTokens[1]);
    if (cipherTokens[0] > client.getNonce(saltKey, cipherTokens[0]))
        return cipherTokens[1];
    else
        throw new Error('nonce too low!');
}
module.exports.decryptXStrong = decryptXStrong;