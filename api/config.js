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
    "hash": "be1a9db84d64cf415d2d1c45e00a72dd18d95658c2d76535549637c28fa89032"
  },
  {
    "name": "AdderalCoin",
    "contract": "eosadddddddd",
    "symbol": "ADD",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "Atidium",
    "contract": "eosatidiumio",
    "symbol": "ATD",
    "precision": 4,
    "hash": "41d5fc755a763622a87566418cd15d2aedaa5d87eb342dad9178d5c68794c45e"
  },
  {
    "name": "eosBlack",
    "contract": "eosblackteam",
    "symbol": "BLACK",
    "precision": 4,
    "hash": "5129ed4d29c1c80fcad2448a8864e0aa5c938b2fa13c51702ac7875ae3868729"
  },
  {
    "name": "eosDAC",
    "contract": "eosdactokens",
    "symbol": "EOSDAC",
    "precision": 4,
    "hash": "cccbcf3a59ccaa265244ae95aadb132a91957cd4c1aabbb1844d4e3442ffc01b"
  },
  {
    "name": "Chaince",
    "contract": "eosiochaince",
    "symbol": "CET",
    "precision": 4,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "name": "Everipedia",
    "contract": "everipediaiq",
    "symbol": "IQ",
    "precision": 3,
    "hash": "42206a89a3873c8b15bda5178ca0e2da6b223597177bc9abe3980c43c860e3fa"
  },
  {
    "name": "CETOS token",
    "contract": "gyztomjugage",
    "symbol": "CETOS",
    "precision": 4,
    "hash": "2a1132c1b764d4a3e68c63f10e51071bdc1556ea5cfc6b18823cc95836c9e9ac"
  },
  {
    "name": "Horus Pay",
    "contract": "horustokenio",
    "symbol": "HORUS",
    "precision": 4,
    "hash": "639276d0d4bcd2b2a53a31e99d7b128c3e3540bfecc64fe29529cf96a608f873"
  },
  {
    "name": "Poorman Token",
    "contract": "poormantoken",
    "symbol": "POOR",
    "precision": 4,
    "hash": "7edb300487167a52cc1abcbb5b76ed7ca4e76ce1945ea7d6f9cb0dec0493e0e2"
  },
  {
    "name": "RIDL",
    "contract": "ridlridlcoin",
    "symbol": "RIDL",
    "precision": 4,
    "hash": "17b3e28ebd0136a8ade193e6000b48185a60ca3500eba05a02f651887ff90c39"
  },
  {
    "name": "KARMA",
    "contract": "therealkarma",
    "symbol": "KARMA",
    "precision": 4,
    "hash": "bfa3971e07927312433f16d76c1589d51b676e628e9cc10a899fdad4116b3c4c"
  },
  {
    "name": "TRYBE",
    "contract": "trybenetwork",
    "symbol": "TRYBE",
    "precision": 4,
    "hash": "f424d6d0ed9d07bf1d750190bf16098f82276e8ba7fba04039868f28d31f4179"
  },
  {
    "name": "EOS BET",
    "symbol": "BET",
    "contract": "betdividends",
    "precision": 4,
    "hash": "2aa894b03a6f4a715e7192a446ce33795fbda810c25f37913f42cc0ba7432896"
  },
  {
    "name": "EETH",
    "symbol": "EETH",
    "contract": "ethsidechain",
    "precision": 4,
    "hash": "19a11720f887abd79dc8d4bd5fbeb286da839875bbb5bd7f180a14a717451a52"
  },
  {
    "name": "EOX Commerce",
    "symbol": "EOX",
    "contract": "eoxeoxeoxeox",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "EOS Sports Bets",
    "symbol": "ESB",
    "contract": "esbcointoken",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "EVR Token",
    "symbol": "EVR",
    "contract": "eosvrtokenss",
    "precision": 4,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "name": "IPOS",
    "symbol": "IPOS",
    "contract": "oo1122334455",
    "precision": 4,
    "hash": "ae3fcad8a9f6b573c622328f763871518569d76e803a7e537d423b60fc9caef0"
  },
  {
    "name": "iRespo",
    "symbol": "IRESPO",
    "contract": "irespotokens",
    "precision": 4,
    "hash": "3c32f9bc1584eae5645a11e004b732771e9ffc378ffa2d0fb621caca83f75164"
  },
  {
    "name": "MEET.ONE",
    "symbol": "MEETONE",
    "contract": "eosiomeetone",
    "precision": 4,
    "hash": "2eea0a558e453055278ba3d07011f89f17808955645ab0089c2fae0c06835861"
  },
  {
    "name": "Oracle Chain",
    "symbol": "OCT",
    "contract": "octtothemoon",
    "precision": 4,
    "hash": "6c5ed3c9e566d39f533a5365f676ed1103181746ee62d41f2872f7d145d5ed7b"
  },
  {
    "name": "Crypto Peso",
    "symbol": "PSO",
    "contract": "cryptopesosc",
    "precision": 4,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "name": "WiZZ",
    "symbol": "WIZZ",
    "contract": "wizznetwork1",
    "precision": 4,
    "hash": "6e8709a9e139cd364e6ad5e610adb4f2a86a69cc89baae1eb2a2a79c67085554"
  },
  {
    "name": "EOS Token",
    "symbol": "EOS",
    "contract": "eosio.token",
    "precision": 4,
    "hash": "01bd013c4f8be142b9cadf511f007c6ac201c068d529f01ed5661803c575befa"
  },
  {
    "name": "EOS Cannon",
    "symbol": "CAN",
    "contract": "eoscancancan",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "Dabble",
    "contract": "eoscafekorea",
    "symbol": "DAB",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "DEOS Games",
    "contract": "thedeosgames",
    "symbol": "DEOS",
    "precision": 4,
    "hash": "b0a983e13a7a6c04172e7edeabddb18ad167a53297bd5bbe3daea83f4ecf9186"
  },
  {
    "name": "EOS90s",
    "contract": "eosninetiess",
    "symbol": "EOSNTS",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "ProChain",
    "contract": "epraofficial",
    "symbol": "EPRA",
    "precision": 4,
    "hash": "a3e42ab572e0167682398e0dc07aca238266d4d05012323f4a5de9b3dbb7a034"
  },
  {
    "name": "First Aid",
    "contract": "eosfaidchain",
    "symbol": "FAID",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "ITE Dice",
    "contract": "itecointoken",
    "symbol": "ITECOIN",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "Luck Chain",
    "contract": "eosluckchain",
    "symbol": "LUCK",
    "precision": 4,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "name": "EOS Win",
    "contract": "eoslucktoken",
    "symbol": "LUCKY",
    "precision": 4,
    "hash": "96446777276b430b8a3ecb5c972f0494f67e3f09232f760ec9b64b590c1466b2"
  },
  {
    "name": "More One",
    "contract": "eosiomoreone",
    "symbol": "MORE",
    "precision": 4,
    "hash": "e4953441c13550c08476a4a987f075d0afea861ddd546be43bd7fe2f0ce213f5"
  },
  {
    "name": "Prospectors",
    "contract": "prospectorsg",
    "symbol": "PGL",
    "precision": 4,
    "hash": "ddea3afd76d3cba364bf58becb13256806fa8c30105b479aa7edb0c81e8ee2c9"
  },
  {
    "name": "Tea",
    "contract": "linzongsheng",
    "symbol": "TEA",
    "precision": 4,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "name": "TokenPocket",
    "contract": "tokendapppub",
    "symbol": "TPT",
    "precision": 4,
    "hash": "efc5c27b0e06c5c76456bd83924284c654f6eb29175e7ca2980dd16f0f5d8edb"
  },
  {
    "name": "WEOS",
    "contract": "weosservices",
    "symbol": "WECASH",
    "precision": 4,
    "hash": "9210637cb6abf6ac8e887cb43c75ca3f86713c9b3b668b0ec63b6e39183b54fd"
  },
  {
    "name": "CryptoWizards",
    "contract": "wizboxairdro",
    "symbol": "WIZBOX",
    "precision": 0,
    "hash": "97dbb012db9aa475912f060be1c9bda2347cd93b9f9acc6c1eae9d10eb2164d2"
  }
];
module.exports = config;