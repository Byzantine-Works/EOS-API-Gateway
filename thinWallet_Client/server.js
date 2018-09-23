const io = require('socket.io')();

var db = {};

io.on('connection', (client) => {
    client.on('user', (data) => {
        if(!db[data[0]]) db[data[0]] = 0;
        db[data[0]] ++;
        client.emit(data[1], db[data[0]]);
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);