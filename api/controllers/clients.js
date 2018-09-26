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
    nonce = Number(nonce)
    console.log("clients.getNonce for key:nonce=> " + key + ":" + nonce);
    //console.log('Path of file in parent dir:', require('path').resolve(__dirname, '../c.json'));
    var clients = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    var index = lodash.sortedIndexOf(clients, lodash.filter(clients, x => x.salt === key)[0]);
    //var client = lodash.filter(clients, x => x.salt === key);
    //console.log(JSON.stringify(client));
    var statefulNonce = clients[index].nonce;
    console.log("statefulNonce => ", statefulNonce);
    if (nonce <= statefulNonce) {
        throw new Error("nonce too low @rnonce:@cnonce => " + nonce + ":" + statefulNonce);
    } else {
        clients[index].nonce = nonce;
        fs.writeFileSync(require('path').resolve(__dirname, '../c.swp'), JSON.stringify(clients, null, 4));
        return nonce;
    }
};

exports.checkNonce = function(key) {
    
    var clients = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    var index = lodash.sortedIndexOf(clients, lodash.filter(clients, x => x.salt === key)[0]);
    if(index === -1) throw new Error("The API key has not been registered.");
    else{
        clients[index].nonce;
        var statefulNonce = clients[index].nonce;
        // fs.writeFileSync(require('path').resolve(__dirname, '../c.swp'), JSON.stringify(clients, null, 4));
        return statefulNonce;
    }

}