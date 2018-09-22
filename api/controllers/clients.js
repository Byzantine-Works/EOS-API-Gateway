fs = require("fs");
lodash = require("lodash");

//Simple file based persistence to ensure nonce is unique
//and always higher than the last nonce used by a specific
//API client
//TODO Simple file based persistence for now, move to elasticsearch or sql/nosql
// client.forEach(function(value, key) {
//     console.log("client => " + key + " : " + value);
// });

// exports.addClient = function (salt, nonce) {
//     // if (!clients[apiKey]) {
//     //     clients[apiKey] = apiKey;
//     // }
//     if (!clients[apisalt]) {
//         clients[apisalt] = salt;
//     }
//     if (!clients[apinonce]) {
//         clients[apinonce] = nonce;
//     }
//     console.log("clients.addClient => " + salt, nonce);
// };

// exports.removeClientList = function (salt) {
//     delete clients[salt];
// };

// exports.getClientList = function () {
//     return clients;
// };

exports.getNonce = function (key, nonce) {
    console.log("clients.getNonce for key:nonce=> " + key + ":" + nonce);
    //console.log('Path of file in parent dir:', require('path').resolve(__dirname, '../c.json'));
    var client = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    //var client = lodash.filter(clients, x => x.salt === key);
    //console.log(JSON.stringify(client));
    var statefulNonce = client.nonce;
    console.log("statefulNonce => " + statefulNonce);
    if (nonce <= statefulNonce) {
        throw new Error("nonce too low @rnonce:@cnonce => " + nonce + ":" + statefulNonce);
    } else {
        client.nonce = statefulNonce + 1;
        fs.writeFileSync(require('path').resolve(__dirname, '../c.swp'), JSON.stringify(client, null, 4));
        //  console.log("client => " + JSON.stringify(client));
        return statefulNonce;
    }
};