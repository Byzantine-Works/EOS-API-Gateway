var config = {};
//These need to be fetched dynamically via
//DB based on weightage, and a scheduler can monitor the least
//latency bps, and queue them in db with weightage for dyn lb *selection
config.eoschain = [{
    //   eosVersion: 'f2cb2722',
    //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    //   httpEndpoint: 'https://mainnet.libertyblock.io:7777',
    //   debug: false,
    //   verbose: false,
    //   latency: 160
    // }, {
    eosVersion: 'e87d245d',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    httpEndpoint: 'http://54.153.65.87:8888',
    debug: false,
    verbose: false
  }
  // ,
  // {
  //   eosVersion: 'b8c1b2c2',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'http://mainnet.genereos.io',
  //   debug: false,
  //   verbose: false
  // },
  // {
  //   eosVersion: '817b1d01',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'https://api-mainnet.eosgravity.com',
  //   debug: false,
  //   verbose: false
  // },
  // {
  //   eosVersion: 'b8c1b2c2',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'http://api-mainnet1.starteos.io',
  //   debug: false,
  //   verbose: false
  // },
  // // {
  // //   eosVersion: 'a228b1dc',
  // //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  // //   httpEndpoint: 'http://api.eoslaomao.com',
  // //   debug: false,
  // //   verbose: false
  // // },
  // {
  //   eosVersion: 'a228b1dc',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'http://api.bp.fish',
  //   debug: false,
  //   verbose: false
  // },
];

config.eostestnets = [{
  eosVersion: 'e87d245d',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  httpEndpoint: 'http://54.153.65.87:8888',
  debug: false,
  verbose: false
}];

config.contracts = {
  eosTokenContract: 'eosio.token',
};

config.tokens = [
// {
//     "name": "BitEye",
//     "contract": "biteyebiteye",
//     "symbol": "BITI"
//   },
//   {
//     "name": "BOID",
//     "contract": "boidcomtoken",
//     "symbol": "BOID"
//   },
//   {
//     "name": "Challenge DAC",
//     "contract": "challengedac",
//     "symbol": "CHL"
//   },
//   {
//     "name": "EDNA",
//     "contract": "ednazztokens",
//     "symbol": "EDNA"
//   },
//   {
//     "name": "AdderalCoin",
//     "contract": "eosadddddddd",
//     "symbol": "ADD"
//   },
//   {
//     "name": "Atidium",
//     "contract": "eosatidiumio",
//     "symbol": "ATD"
//   },
//   {
//     "name": "eosBlack",
//     "contract": "eosblackteam",
//     "symbol": "BLACK"
//   },
//   {
//     "name": "eosDAC",
//     "contract": "eosdactokens",
//     "symbol": "EOSDAC"
//   },
//   {
//     "name": "Chaince",
//     "contract": "eosiochaince",
//     "symbol": "CET"
//   },
//   {
//     "name": "Everipedia",
//     "contract": "everipediaiq",
//     "symbol": "IQ"
//   },
//   {
//     "name": "CETOS token",
//     "contract": "gyztomjugage",
//     "symbol": "CETOS"
//   },
//   {
//     "name": "Horus Pay",
//     "contract": "horustokenio",
//     "symbol": "HORUS"
//   },
//   {
//     "name": "Poorman Token",
//     "contract": "poormantoken",
//     "symbol": "POOR"
//   },
//   {
//     "name": "RIDL",
//     "contract": "ridlridlcoin",
//     "symbol": "RIDL"
//   },
//   {
//     "name": "KARMA",
//     "contract": "therealkarma",
//     "symbol": "KARMA"
//   },
//   {
//     "name": "TRYBE",
//     "contract": "trybenetwork",
//     "symbol": "TRYBE"
//   },
//   {
//     "name": "EOS BET",
//     "symbol": "BET",
//     "contract": "betdividends"
//   },
//   {
//     "name": "EETH",
//     "symbol": "EETH",
//     "contract": "ethsidechain"
//   },
//   {
//     "name": "EOX Commerce",
//     "symbol": "EOX",
//     "contract": "eoxeoxeoxeox"
//   },
//   {
//     "name": "EOS Sports Bets",
//     "symbol": "ESB",
//     "contract": "esbcointoken"
//   },
//   {
//     "name": "EVR Token",
//     "symbol": "EVR",
//     "contract": "eosvrtokenss"
//   },
//   {
//     "name": "IPOS",
//     "symbol": "IPOS",
//     "contract": "oo1122334455"
//   },
//   {
//     "name": "iRespo",
//     "symbol": "IRESPO",
//     "contract": "irespotokens"
//   },
//   {
//     "name": "MEET.ONE",
//     "symbol": "MEETONE",
//     "contract": "eosiomeetone"
//   },
//   {
//     "name": "Oracle Chain",
//     "symbol": "OCT",
//     "contract": "octtothemoon"
//   },
//   {
//     "name": "Crypto Peso",
//     "symbol": "PSO",
//     "contract": "cryptopesosc"
//   },
//   {
//     "name": "WiZZ",
//     "symbol": "WIZZ",
//     "contract": "wizznetwork1"
//   },
  {
    "name": "EOS Token",
    "symbol": "EOS",
    "contract": "eosio.token"
  },
  {
    "name": "ABC Token",
    "symbol": "ABC",
    "contract": "eosio.token"
  },
  {
    "name": "SYS Token",
    "symbol": "SYS",
    "contract": "eosio.token"
  }
];

config.tokensA = [
  // {
  //     "name": "BitEye",
  //     "contract": "biteyebiteye",
  //     "symbol": "BITI"
  //   },
  //   {
  //     "name": "BOID",
  //     "contract": "boidcomtoken",
  //     "symbol": "BOID"
  //   },
  //   {
  //     "name": "Challenge DAC",
  //     "contract": "challengedac",
  //     "symbol": "CHL"
  //   },
  //   {
  //     "name": "EDNA",
  //     "contract": "ednazztokens",
  //     "symbol": "EDNA"
  //   },
  //   {
  //     "name": "AdderalCoin",
  //     "contract": "eosadddddddd",
  //     "symbol": "ADD"
  //   },
  //   {
  //     "name": "Atidium",
  //     "contract": "eosatidiumio",
  //     "symbol": "ATD"
  //   },
  //   {
  //     "name": "eosBlack",
  //     "contract": "eosblackteam",
  //     "symbol": "BLACK"
  //   },
  //   {
  //     "name": "eosDAC",
  //     "contract": "eosdactokens",
  //     "symbol": "EOSDAC"
  //   },
  //   {
  //     "name": "Chaince",
  //     "contract": "eosiochaince",
  //     "symbol": "CET"
  //   },
  //   {
  //     "name": "Everipedia",
  //     "contract": "everipediaiq",
  //     "symbol": "IQ"
  //   },
  //   {
  //     "name": "CETOS token",
  //     "contract": "gyztomjugage",
  //     "symbol": "CETOS"
  //   },
  //   {
  //     "name": "Horus Pay",
  //     "contract": "horustokenio",
  //     "symbol": "HORUS"
  //   },
  //   {
  //     "name": "Poorman Token",
  //     "contract": "poormantoken",
  //     "symbol": "POOR"
  //   },
  //   {
  //     "name": "RIDL",
  //     "contract": "ridlridlcoin",
  //     "symbol": "RIDL"
  //   },
  //   {
  //     "name": "KARMA",
  //     "contract": "therealkarma",
  //     "symbol": "KARMA"
  //   },
  //   {
  //     "name": "TRYBE",
  //     "contract": "trybenetwork",
  //     "symbol": "TRYBE"
  //   },
  //   {
  //     "name": "EOS BET",
  //     "symbol": "BET",
  //     "contract": "betdividends"
  //   },
  //   {
  //     "name": "EETH",
  //     "symbol": "EETH",
  //     "contract": "ethsidechain"
  //   },
  //   {
  //     "name": "EOX Commerce",
  //     "symbol": "EOX",
  //     "contract": "eoxeoxeoxeox"
  //   },
  //   {
  //     "name": "EOS Sports Bets",
  //     "symbol": "ESB",
  //     "contract": "esbcointoken"
  //   },
  //   {
  //     "name": "EVR Token",
  //     "symbol": "EVR",
  //     "contract": "eosvrtokenss"
  //   },
  //   {
  //     "name": "IPOS",
  //     "symbol": "IPOS",
  //     "contract": "oo1122334455"
  //   },
  //   {
  //     "name": "iRespo",
  //     "symbol": "IRESPO",
  //     "contract": "irespotokens"
  //   },
  //   {
  //     "name": "MEET.ONE",
  //     "symbol": "MEETONE",
  //     "contract": "eosiomeetone"
  //   },
  //   {
  //     "name": "Oracle Chain",
  //     "symbol": "OCT",
  //     "contract": "octtothemoon"
  //   },
  //   {
  //     "name": "Crypto Peso",
  //     "symbol": "PSO",
  //     "contract": "cryptopesosc"
  //   },
  //   {
  //     "name": "WiZZ",
  //     "symbol": "WIZZ",
  //     "contract": "wizznetwork1"
  //   },
    {
      "name": "EOS Token",
      "symbol": "EOS",
      "contract": "eosio.token"
    },
    {
      "name": "ABC Token",
      "symbol": "ABC",
      "contract": "eosio.token"
    },
    {
      "name": "SYS Token",
      "symbol": "SYS",
      "contract": "eosio.token"
    }
  ];
module.exports = config;