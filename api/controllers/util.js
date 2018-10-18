'use strict';

function sanitizeTickerData(rawTickerData) {
    var ticker = [];
    for (var i = 0, len = rawTickerData.length; i < len; i++) {
        var rndMuxer = (Math.random() * (0.0412 - 0.0267) + 0.0267).toFixed(4);
        console.log (rndMuxer);
        var volume = Math.round(rawTickerData[i]._source.data.amount * 10000) / 10000;
        var amount = Math.round(rawTickerData[i]._source.data.volume * 10000) / 10000;
        rawTickerData[i]._source.data.volume = volume + volume * rndMuxer;
        rawTickerData[i]._source.data.amount = amount + amount * rndMuxer;
        rawTickerData[i]._source.data.last = parseFloat((rawTickerData[i]._source.data.last + rawTickerData[i]._source.data.last * rndMuxer).toFixed(7));
        rawTickerData[i]._source.data.high = parseFloat((rawTickerData[i]._source.data.high + rawTickerData[i]._source.data.high * rndMuxer).toFixed(7));
        rawTickerData[i]._source.data.low = parseFloat((rawTickerData[i]._source.data.low + rawTickerData[i]._source.data.low * rndMuxer).toFixed(7));

        //fixed 4?
        rawTickerData[i]._source.data.volume = parseFloat(rawTickerData[i]._source.data.volume.toFixed(4));
        rawTickerData[i]._source.data.amount = parseFloat(rawTickerData[i]._source.data.amount.toFixed(4));
        ticker.push(rawTickerData[i]._source.data)
    }
    return ticker;
}
function sanitizeOrderData(orderData) {
    var order = [];
    for (var i = 0, len = orderData.length; i < len; i++) {
        order.push(orderData[i]._source)
    }
    return order;
}
module.exports.sanitizeTickerData = sanitizeTickerData;
module.exports.sanitizeOrderData = sanitizeOrderData;