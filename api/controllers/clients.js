fs = require("fs");
lodash = require("lodash");

//Simple file based persistence to ensure nonce is unique
//and always higher than the last nonce used by a specific
//API client
//TODO @reddy Simple file based persistence for now, move to elasticsearch or sql/nosql

exports.getSalt4ApiKey = function (key) {
    console.log("clients.getSalt4ApiKey for key=> " + key);
    var clients = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));

    var client = lodash.find(clients,['apikey', key]);
    if (client === undefined || client === null) throw new Error("api_key pairing not found");
    console.log("client => ", client);
    return client.salt;
};

exports.getNonce = function (key, nonce) {
    nonce = Number(nonce)
    console.log("clients.getNonce for key:nonce=> " + key + ":" + nonce);
    var clients = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    var index = lodash.sortedIndexOf(clients, lodash.filter(clients, x => x.salt === key)[0]);
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

exports.rollbackNonce = function (key, nonce) {
    nonce = Number(nonce)
    console.log("clients.rollbackNonce for key:nonce=> " + key + ":" + nonce);
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

exports.checkNonce = function (key) {
    var clients = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '../c.swp')));
    console.log("clients: ", typeof key);
    var index = clients.indexOf(lodash.filter(clients, x => x.apiKey === key)[0]);
    if (index === -1) throw new Error("The API key has not been registered.");
    else {
        clients[index].nonce;
        var statefulNonce = clients[index].nonce;
        // fs.writeFileSync(require('path').resolve(__dirname, '../c.swp'), JSON.stringify(clients, null, 4));
        return statefulNonce;
    }
}