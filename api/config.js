var config = {};
//These need to be fetched dynamically via
//DB based on weightage, and a scheduler can monitor the least
//latency bps, and queue them in db with weightage for dyn lb *selection
config.eoschain = [{
    eosVersion: 'a228b1dc',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    httpEndpoint: 'http://api.eoslaomao.com',
    debug: false,
    verbose: false
  }
  // {
  //   eosVersion: 'f2cb2722',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'https://mainnet.libertyblock.io:7777',
  //   debug: false,
  //   verbose: false,
  //   latency: 160
  // },
  // {
  //   eosVersion: 'b8c1b2c2',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   httpEndpoint: 'http://mainnet.genereos.io',
  //   debug: false,
  //   verbose: false
  // }
  //,
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
    "symbol": "BITI",
    "contract": "biteyebiteye",
    "precision": 4,
    "name": "BitEye",
    "24HrTransferVolume": 185.03928,
    "hash": "f210f606e0f1f35779428dc2167f45b6f5105fc4e47c60eaa9039f6a81cbd926"
  },
  {
    "symbol": "BOID",
    "contract": "boidcomtoken",
    "precision": 4,
    "name": "BOID",
    "24HrTransferVolume": 415.13535,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "CHL",
    "contract": "challengedac",
    "precision": 4,
    "name": "Challenge DAC",
    "24HrTransferVolume": 330.27737,
    "hash": "2038a34c8bede2a99f7d4a18d5a81b6f3b4626f4b46e522eca28de0f6fe259b1"
  },
  {
    "symbol": "EDNA",
    "contract": "ednazztokens",
    "precision": 4,
    "name": "EDNA",
    "24HrTransferVolume": 967.6964,
    "hash": "be1a9db84d64cf415d2d1c45e00a72dd18d95658c2d76535549637c28fa89032"
  },
  {
    "symbol": "ADD",
    "contract": "eosadddddddd",
    "precision": 4,
    "name": "AdderalCoin",
    "24HrTransferVolume": 921.4044,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "ATD",
    "contract": "eosatidiumio",
    "precision": 4,
    "name": "Atidium",
    "24HrTransferVolume": 634.8829,
    "hash": "41d5fc755a763622a87566418cd15d2aedaa5d87eb342dad9178d5c68794c45e"
  },
  {
    "symbol": "BLACK",
    "contract": "eosblackteam",
    "precision": 4,
    "name": "eosBlack",
    "24HrTransferVolume": 2414.7366,
    "hash": "5129ed4d29c1c80fcad2448a8864e0aa5c938b2fa13c51702ac7875ae3868729"
  },
  {
    "symbol": "EOSDAC",
    "contract": "eosdactokens",
    "precision": 4,
    "name": "eosDAC",
    "24HrTransferVolume": 2376.4207,
    "hash": "cccbcf3a59ccaa265244ae95aadb132a91957cd4c1aabbb1844d4e3442ffc01b"
  },
  {
    "symbol": "CET",
    "contract": "eosiochaince",
    "precision": 4,
    "name": "Chaince",
    "24HrTransferVolume": 131.9568,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "symbol": "IQ",
    "contract": "everipediaiq",
    "precision": 3,
    "name": "Everipedia",
    "24HrTransferVolume": 3060.3027,
    "hash": "42206a89a3873c8b15bda5178ca0e2da6b223597177bc9abe3980c43c860e3fa"
  },
  {
    "symbol": "CETOS",
    "contract": "gyztomjugage",
    "precision": 4,
    "name": "CETOS token",
    "24HrTransferVolume": 151.75279,
    "hash": "2a1132c1b764d4a3e68c63f10e51071bdc1556ea5cfc6b18823cc95836c9e9ac"
  },
  {
    "symbol": "HORUS",
    "contract": "horustokenio",
    "precision": 4,
    "name": "Horus Pay",
    "24HrTransferVolume": 2630.8098,
    "hash": "639276d0d4bcd2b2a53a31e99d7b128c3e3540bfecc64fe29529cf96a608f873"
  },
  {
    "symbol": "POOR",
    "contract": "poormantoken",
    "precision": 4,
    "name": "Poorman Token",
    "24HrTransferVolume": 300.5319,
    "hash": "7edb300487167a52cc1abcbb5b76ed7ca4e76ce1945ea7d6f9cb0dec0493e0e2"
  },
  {
    "symbol": "RIDL",
    "contract": "ridlridlcoin",
    "precision": 4,
    "name": "RIDL",
    "24HrTransferVolume": 146.23671,
    "hash": "17b3e28ebd0136a8ade193e6000b48185a60ca3500eba05a02f651887ff90c39"
  },
  {
    "symbol": "KARMA",
    "contract": "therealkarma",
    "precision": 4,
    "name": "KARMA",
    "24HrTransferVolume": 2893.9585,
    "hash": "bfa3971e07927312433f16d76c1589d51b676e628e9cc10a899fdad4116b3c4c"
  },
  {
    "symbol": "TRYBE",
    "contract": "trybenetwork",
    "precision": 4,
    "name": "TRYBE",
    "24HrTransferVolume": 540.2843,
    "hash": "f424d6d0ed9d07bf1d750190bf16098f82276e8ba7fba04039868f28d31f4179"
  },
  {
    "symbol": "BET",
    "contract": "betdividends",
    "precision": 4,
    "name": "EOS BET",
    "24HrTransferVolume": 190518.19,
    "hash": "2aa894b03a6f4a715e7192a446ce33795fbda810c25f37913f42cc0ba7432896"
  },
  {
    "symbol": "EETH",
    "contract": "ethsidechain",
    "precision": 4,
    "name": "EETH",
    "24HrTransferVolume": 1382.1589,
    "hash": "19a11720f887abd79dc8d4bd5fbeb286da839875bbb5bd7f180a14a717451a52"
  },
  {
    "symbol": "EOX",
    "contract": "eoxeoxeoxeox",
    "precision": 4,
    "name": "EOX Commerce",
    "24HrTransferVolume": 141.91483,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "ESB",
    "contract": "esbcointoken",
    "precision": 4,
    "name": "EOS Sports Bets",
    "24HrTransferVolume": 106.44575,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "EVR",
    "contract": "eosvrtokenss",
    "precision": 4,
    "name": "EVR Token",
    "24HrTransferVolume": 0,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "symbol": "IPOS",
    "contract": "oo1122334455",
    "precision": 4,
    "name": "IPOS",
    "24HrTransferVolume": 275.78952,
    "hash": "ae3fcad8a9f6b573c622328f763871518569d76e803a7e537d423b60fc9caef0"
  },
  {
    "symbol": "IRESPO",
    "contract": "irespotokens",
    "precision": 4,
    "name": "iRespo",
    "24HrTransferVolume": 0,
    "hash": "3c32f9bc1584eae5645a11e004b732771e9ffc378ffa2d0fb621caca83f75164"
  },
  {
    "symbol": "MEETONE",
    "contract": "eosiomeetone",
    "precision": 4,
    "name": "MEET.ONE",
    "24HrTransferVolume": 1066.8168,
    "hash": "2eea0a558e453055278ba3d07011f89f17808955645ab0089c2fae0c06835861"
  },
  {
    "symbol": "OCT",
    "contract": "octtothemoon",
    "precision": 4,
    "name": "Oracle Chain",
    "24HrTransferVolume": 1950.0569,
    "hash": "6c5ed3c9e566d39f533a5365f676ed1103181746ee62d41f2872f7d145d5ed7b"
  },
  {
    "symbol": "PSO",
    "contract": "cryptopesosc",
    "precision": 4,
    "name": "Crypto Peso",
    "24HrTransferVolume": 0,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "symbol": "WIZZ",
    "contract": "wizznetwork1",
    "precision": 4,
    "name": "WiZZ",
    "24HrTransferVolume": 1205.9763,
    "hash": "6e8709a9e139cd364e6ad5e610adb4f2a86a69cc89baae1eb2a2a79c67085554"
  },
  {
    "symbol": "EOS",
    "contract": "eosio.token",
    "precision": 4,
    "name": "EOS Token",
    "24HrTransferVolume": 895336.8,
    "hash": "01bd013c4f8be142b9cadf511f007c6ac201c068d529f01ed5661803c575befa"
  },
  {
    "symbol": "CAN",
    "contract": "eoscancancan",
    "precision": 4,
    "name": "EOS Cannon",
    "24HrTransferVolume": 0,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "DAB",
    "contract": "eoscafekorea",
    "precision": 4,
    "name": "Dabble",
    "24HrTransferVolume": 27864.676,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "DEOS",
    "contract": "thedeosgames",
    "precision": 4,
    "name": "DEOS Games",
    "24HrTransferVolume": 30618.754,
    "hash": "b0a983e13a7a6c04172e7edeabddb18ad167a53297bd5bbe3daea83f4ecf9186"
  },
  {
    "symbol": "EOSNTS",
    "contract": "eosninetiess",
    "precision": 4,
    "name": "EOS90s",
    "24HrTransferVolume": 0,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "EPRA",
    "contract": "epraofficial",
    "precision": 4,
    "name": "ProChain",
    "24HrTransferVolume": 8200.845,
    "hash": "a3e42ab572e0167682398e0dc07aca238266d4d05012323f4a5de9b3dbb7a034"
  },
  {
    "symbol": "FAID",
    "contract": "eosfaidchain",
    "precision": 4,
    "name": "First Aid",
    "24HrTransferVolume": 691.14026,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "ITECOIN",
    "contract": "itecointoken",
    "precision": 4,
    "name": "ITE Dice",
    "24HrTransferVolume": 2154.3987,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "LUCK",
    "contract": "eosluckchain",
    "precision": 4,
    "name": "Luck Chain",
    "24HrTransferVolume": 733.64703,
    "hash": "641f336aa1d08526201599c3c0ddb7a646e5ac8f9fd2493f56414d0422a0f957"
  },
  {
    "symbol": "LUCKY",
    "contract": "eoslucktoken",
    "precision": 4,
    "name": "EOS Win",
    "24HrTransferVolume": 86382.73,
    "hash": "96446777276b430b8a3ecb5c972f0494f67e3f09232f760ec9b64b590c1466b2"
  },
  {
    "symbol": "MORE",
    "contract": "eosiomoreone",
    "precision": 4,
    "name": "More One",
    "24HrTransferVolume": 0,
    "hash": "e4953441c13550c08476a4a987f075d0afea861ddd546be43bd7fe2f0ce213f5"
  },
  {
    "symbol": "PGL",
    "contract": "prospectorsg",
    "precision": 4,
    "name": "Prospectors",
    "24HrTransferVolume": 0,
    "hash": "ddea3afd76d3cba364bf58becb13256806fa8c30105b479aa7edb0c81e8ee2c9"
  },
  {
    "symbol": "TEA",
    "contract": "linzongsheng",
    "precision": 4,
    "name": "Tea",
    "24HrTransferVolume": 0,
    "hash": "3e0cf4172ab025f9fff5f1db11ee8a34d44779492e1d668ae1dc2d129e865348"
  },
  {
    "symbol": "TPT",
    "contract": "tokendapppub",
    "precision": 4,
    "name": "TokenPocket",
    "24HrTransferVolume": 2155.1724,
    "hash": "efc5c27b0e06c5c76456bd83924284c654f6eb29175e7ca2980dd16f0f5d8edb"
  },
  {
    "symbol": "WECASH",
    "contract": "weosservices",
    "precision": 4,
    "name": "WEOS",
    "24HrTransferVolume": 590.7042,
    "hash": "9210637cb6abf6ac8e887cb43c75ca3f86713c9b3b668b0ec63b6e39183b54fd"
  },
  {
    "symbol": "WIZBOX",
    "contract": "wizboxairdro",
    "precision": 0,
    "name": "CryptoWizards",
    "24HrTransferVolume": 308.20828,
    "hash": "97dbb012db9aa475912f060be1c9bda2347cd93b9f9acc6c1eae9d10eb2164d2"
  }
];
module.exports = config;