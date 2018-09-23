var crypto = require('crypto');
// var CryptoJS = require('crypto-js');

function decryptXStrong(enc) {
  var saltKey = 'EOS5EzN7oea3YmT1fNmynY7hfa5C9sb4Xvmpi2xEGchQErnGDzXEi'

  var iv = Buffer.alloc(8);
  iv.fill(0);

  var decipher = crypto.createDecipheriv('des-cbc', saltKey.substr(0, 8), iv);
  var dec = decipher.update(enc, 'base64', 'utf8');
  dec += decipher.final('utf8');
  // console.log('Decrypted strong DES/CBC/PKCS5Padding Key => ' + dec);
  return dec;
}

function encryptXStrong(message) {
    var saltKey = 'EOS5EzN7oea3YmT1fNmynY7hfa5C9sb4Xvmpi2xEGchQErnGDzXEi'

    var iv = Buffer.alloc(8);
    iv.fill(0);

    var cipher = crypto.createCipheriv('des-cbc', saltKey.substr(0, 8), iv);
    cipher.update(message, 'utf8', 'base64');

    return cipher.final('base64');
}
// reference to converting between buffers http://nodejs.org/api/buffer.html#buffer_new_buffer_str_encoding
// reference node crypto api http://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv
// reference to ECB vs CBC cipher methods http://crypto.stackexchange.com/questions/225/should-i-use-ecb-or-cbc-encryption-mode-for-my-block-cipher

var key = "bf32eb1e0b28d4b75bb1da9eaa4c5b02";


var encrypt = function (data) {
  var iv = new Buffer('0000000000000000');
  
  var decodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
    var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

var decrypt = function (data) {
  var iv = new Buffer('0000000000000000');
  
  var encodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest()
  var cipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encodeKey, 'hex'),
      Buffer.from(iv));
  var decryptedData = cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
  return decryptedData;

}

// let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
// console.log(randChannel)
// 4fwp4ejcao9409ba59omcn

console.log(encrypt('125 5KDJZqtbfyJZmrAx97C8WB2b2V92NBm2rVi7WMFVBFuGdb5dWwQ'));