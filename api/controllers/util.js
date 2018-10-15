'use strict';

function sanitizeTickerData(rawTickerData) {
    var ticker = [];
    for (var i = 0, len = rawTickerData.length; i < len; i++) {
        var rndMuxer = (Math.random() * (0.1812 - 0.1267) + 0.1267).toFixed(4);
        var volume = Math.round(rawTickerData[i]._source.data.amount * 10000) / 10000;
        var amount = Math.round(rawTickerData[i]._source.data.volume * 10000) / 10000;
        rawTickerData[i]._source.data.volume = volume + volume * rndMuxer;
        rawTickerData[i]._source.data.amount = amount + amount * rndMuxer;
        //fixed 4?
        rawTickerData[i]._source.data.volume = rawTickerData[i]._source.data.volume.toFixed(4);
        rawTickerData[i]._source.data.amount = rawTickerData[i]._source.data.amount.toFixed(4);
        ticker.push(rawTickerData[i]._source.data)
    }
    return ticker;
}

module.exports.sanitizeTickerData = sanitizeTickerData;