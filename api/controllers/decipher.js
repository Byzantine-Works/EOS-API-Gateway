const es = require('../es.js');
var crypto = require('crypto');
var iv = Buffer.from('0000000000000000');

//This function decrypts the nonce and private key using the 
//Common salt exchanged between the customer and api
async function decrypt256(apiKey, data) {
    //apiKey is the api security key and must be passed as header or query param to swagger?
    // get the salt key using the apiKey
    var apiKeySet = await es.getApiKeySet(apiKey);

    var apiKeySetSource = apiKeySet.hits.hits[0]._source;
    var key = apiKeySetSource.salt;
    var nonceFromState = apiKeySetSource.nonce;
    if (key === null || key === undefined || key.length < 1) throw new Error("Pairing of salt_key & api_key absent!");
    var cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decryptedData = cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
    var cipherTokens = decryptedData.split(" ");
    var nonce = Number(cipherTokens[0]);
    console.log('Decrypted 256 enc with nonce:key => ' + cipherTokens[0] + ":" + cipherTokens[1]);
    if (nonce > nonceFromState) {
        return cipherTokens;
    } else {
        throw new Error('Transaction replay detected! nonce too low rnonce/cnonce->' + nonce + "/" + nonceFromState);
    }
};
module.exports.decryptXStrong = decrypt256;