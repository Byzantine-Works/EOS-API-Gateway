'use strict';
const eosapi = require('../eosapi.js');
const config = require("../config");
var Request = require("request");

module.exports = {
  getRamPrice: getRamPrice
};

function getRamPrice(req, res) {
  var ram;
  console.log("getRamPrice-req:");
  let getData = new Promise((resolve, reject) => {
    eosapi.getRamData().then(function (result) {
      var base = result.rows[0].base.balance; // in RAM
      var quote = result.rows[0].quote.balance; //in EOS
      var baseNumeric = base.substr(0, base.indexOf(' '));
      var quoteNumeric = quote.substr(0, quote.indexOf(' '));
      var kbyteEOSPrice = ((quoteNumeric / baseNumeric) * 1024); //.toFixed(6);
      ram = {
        supply_base_ram: baseNumeric,
        supply_quote_eos: quoteNumeric,
        price_per_kb_eos: kbyteEOSPrice
      }
      resolve(ram.price_per_kb_eos);
    })
  }).then(function (kbyteEOSPrice) {
    Request.get("https://api.coinmarketcap.com/v2/ticker/1765/", (error, response, body) => {
      if (error) {
        console.log("getRamPrice-err => " + error);
      }
      var EOSTokenPrice = JSON.parse(body).data.quotes.USD.price;
      console.log("ram/kb in eos:" + kbyteEOSPrice + " in USD: " + EOSTokenPrice);
      var ramPriceinUSD = parseInt(EOSTokenPrice) * kbyteEOSPrice;
      ram.price_per_kb_usd = ramPriceinUSD;
      ram.price_per_kb_eos = kbyteEOSPrice;
      console.log("getRamPrice-res => " + JSON.stringify(ram));
      res.json(ram)
    });
  })
}