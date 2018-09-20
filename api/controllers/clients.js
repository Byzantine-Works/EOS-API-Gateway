fs = require("fs");

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

exports.getNonce = function (salt, nonce) {
    console.log("clients.getNonce for salt:nonce=> " + salt + ":" + nonce);
    //console.log('Path of file in parent dir:', require('path').resolve(__dirname, '../c.json'));
    var client = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    var statefulNonce = Number(client.nonce);
    //console.log("statefulNonce => " + statefulNonce);
    if (nonce <= statefulNonce) {
        throw new Error("nonce too low @" + nonce);
    } else {
        client.nonce = statefulNonce + 1;
        fs.writeFileSync(require('path').resolve(__dirname, '../c.swp'), JSON.stringify(client, null, 4));
        //  console.log("client => " + JSON.stringify(client));
        return statefulNonce;
    }
};