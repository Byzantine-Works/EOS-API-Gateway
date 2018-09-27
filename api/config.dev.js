var config = {};
//These need to be fetched dynamically via
//DB based on weightage, and a scheduler can monitor the least
//latency testnets, and queue them in db with weightage for dyn lb *selection
config.eoschain = [{
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
    "name": "EOS Token",
    "symbol": "EOS",
    "contract": "eosio.token",
    "precision": 4,
    "hash": "c3f4238e22eab3ae950f4a837751999593b3af3f8edad6a0bcd6c39714540a42"
  },
  {
    "name": "ABC Token",
    "symbol": "ABC",
    "contract": "eosio.token",
    "precision": 4,
    "hash": "c3f4238e22eab3ae950f4a837751999593b3af3f8edad6a0bcd6c39714540a42"
  },
  {
    "name": "SYS Token",
    "symbol": "SYS",
    "contract": "eosio.token",
    "precision": 4,
    "hash": "c3f4238e22eab3ae950f4a837751999593b3af3f8edad6a0bcd6c39714540a42"
  }
];
module.exports = config;