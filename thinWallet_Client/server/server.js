const io = require('socket.io')();
const db = require('./nonce.json')
const fs = require('fs');

let nonce = db.nonce;

io.on('connection', (client) => {
    client.on('user', (data) => {
        // if(!db[data[0]]) db[data[0]] = 0;
        nonce ++;
        client.emit(data[1], nonce);
        fs.writeFileSync('./nonce.json', db);

    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);