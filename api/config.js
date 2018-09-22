var config = {};
//These need to be fetched dynamically via
//DB based on weightage, and a scheduler can monitor the least
//latency bps, and queue them in db with weightage for dyn lb *selection
config.eoschain = [{
    eosVersion: 'f2cb2722',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    httpEndpoint: 'https://mainnet.libertyblock.io:7777',
    debug: false,
    verbose: false,
    latency: 160
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
  // {
  //   eosVersion: 'a228b1dc',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'http://api.eoslaomao.com',
  //   debug: false,
  //   verbose: false
  // },
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

config.tokens = [{
    "name": "BitEye",
    "contract": "biteyebiteye",
    "symbol": "BITI",
    "precision": 4,
    "hash": "f210f606e0f1f35779428dc2167f45b6f5105fc4e47c60eaa9039f6a81cbd926"
  },
  {
    "name": "BOID",
    "contract": "boidcomtoken",
    "symbol": "BOID",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "Challenge DAC",
    "contract": "challengedac",
    "symbol": "CHL",
    "precision": 4,
    "hash": "2038a34c8bede2a99f7d4a18d5a81b6f3b4626f4b46e522eca28de0f6fe259b1"
  },
  {
    "name": "EDNA",
    "contract": "ednazztokens",
    "symbol": "EDNA",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "AdderalCoin",
    "contract": "eosadddddddd",
    "symbol": "ADD",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Atidium",
    "contract": "eosatidiumio",
    "symbol": "ATD",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "eosBlack",
    "contract": "eosblackteam",
    "symbol": "BLACK",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "eosDAC",
    "contract": "eosdactokens",
    "symbol": "EOSDAC",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Chaince",
    "contract": "eosiochaince",
    "symbol": "CET",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Everipedia",
    "contract": "everipediaiq",
    "symbol": "IQ",
    "precision": 3,
    "hash": ""
  },
  {
    "name": "CETOS token",
    "contract": "gyztomjugage",
    "symbol": "CETOS",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Horus Pay",
    "contract": "horustokenio",
    "symbol": "HORUS",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Poorman Token",
    "contract": "poormantoken",
    "symbol": "POOR",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "RIDL",
    "contract": "ridlridlcoin",
    "symbol": "RIDL",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "KARMA",
    "contract": "therealkarma",
    "symbol": "KARMA",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "TRYBE",
    "contract": "trybenetwork",
    "symbol": "TRYBE",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS BET",
    "symbol": "BET",
    "contract": "betdividends",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EETH",
    "symbol": "EETH",
    "contract": "ethsidechain",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOX Commerce",
    "symbol": "EOX",
    "contract": "eoxeoxeoxeox",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS Sports Bets",
    "symbol": "ESB",
    "contract": "esbcointoken",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EVR Token",
    "symbol": "EVR",
    "contract": "eosvrtokenss",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "IPOS",
    "symbol": "IPOS",
    "contract": "oo1122334455",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "iRespo",
    "symbol": "IRESPO",
    "contract": "irespotokens",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "MEET.ONE",
    "symbol": "MEETONE",
    "contract": "eosiomeetone",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Oracle Chain",
    "symbol": "OCT",
    "contract": "octtothemoon",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Crypto Peso",
    "symbol": "PSO",
    "contract": "cryptopesosc",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "WiZZ",
    "symbol": "WIZZ",
    "contract": "wizznetwork1",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS Token",
    "symbol": "EOS",
    "contract": "eosio.token",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS Cannon",
    "symbol": "CAN",
    "contract": "eoscancancan",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Dabble",
    "contract": "eoscafekorea",
    "symbol": "DAB",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "DEOS Games",
    "contract": "thedeosgames",
    "symbol": "DEOS",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS90s",
    "contract": "eosninetiess",
    "symbol": "EOSNTS",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "ProChain",
    "contract": "epraofficial",
    "symbol": "EPRA",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "First Aid",
    "contract": "eosfaidchain",
    "symbol": "FAID",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "ITE Dice",
    "contract": "itecointoken",
    "symbol": "ITECOIN",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Luck Chain",
    "contract": "eosluckchain",
    "symbol": "LUCK",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "EOS Win",
    "contract": "eoslucktoken",
    "symbol": "LUCKY",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "More One",
    "contract": "eosiomoreone",
    "symbol": "MORE",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Prospectors",
    "contract": "prospectorsg",
    "symbol": "PGL",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "Tea",
    "contract": "linzongsheng",
    "symbol": "TEA",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "TokenPocket",
    "contract": "tokendapppub",
    "symbol": "TPT",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "WEOS",
    "contract": "weosservices",
    "symbol": "WECASH",
    "precision": 4,
    "hash": ""
  },
  {
    "name": "CryptoWizards",
    "contract": "wizboxairdro",
    "symbol": "WIZBOX",
    "precision": 0,
    "hash": ""
  }
];
module.exports = config;