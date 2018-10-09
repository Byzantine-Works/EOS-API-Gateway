# Synopsis

- Byzantine API gateway enables EOS on-chain integration of DEX's, Centralized Exchanges, Wallets and DAPPs, in a secure, scalable and reliable manner, without the need to run mainnet eos chain locally
- Provides an abstraction from token contracts, replay attacks, validation of tokens with their respective contract hashes and ensures a secure transaction
- The API gateway runs its own mainnet and also load balances across 21 block producers when the local mainnet blocks are delayed by >500ms
- Provides an unified access to history-api and thereby access to transactions made through the API gateway are guaranteed to have an audit trace forever
- Security is enabled through a combination of nonce, private salt, api-security-key and a cipher used by both the client and server for signature. This prevents both the replay attack as well as a secure exchange of keys for signature
- Provides an easy abstraction for getting balances across various EOS derivative airgrabs and airdrops and token specific contract validation with hashcodes
- Prevents the following attacks which were in recent news:

- - [EosBetDice hacked using eosio.token transfer exploit](https://www.zdnet.com/article/blockchain-betting-app-mocks-competitor-for-getting-hacked-gets-hacked-four-days-later/)

- - [EosDex hacked with fake EOS tokens](https://thenextweb.com/hardfork/2018/09/18/eos-hackers-exchange-fake/)

# Build

- Byzantine API Gateway

```sh
git clone https://github.com/Byzantine-Works/EOS-API-Gateway.git
npm install

//install elasticsearch
brew install elasticsearch
brew services start elasticsearch
curl http://local.byzanti.ne:9200

//install kibana (needed for design time es crud operations)
brew install kibana
brew services start kibana
localhost:5601
use the 'dev tools' icon to use the query editor and execute estemplates/keys_template.txt

//setup loopback interface
vi ~/etc/hosts (add loopback interface: 127.0.0.1	local.byzanti.ne)
npm start OR nodemon

//test if the api is running
curl http://local.byzanti.ne/8901/info

//to generate salt+apikey use
node -e 'require("./api/controllers/apiKey").keygen()'
```

- EOS 'Stripe' Wallet

```sh
cd thin-wallet-client
npm start
```

# Validate

- Replace `api` with `local` and `port` with `8901` for local dev validation for the following
- swagger-ui: http://api.byzanti.ne/8902/docs
- API-Analytics: https://analytics.byzanti.ne/goto/5c34272dd2c0a4e76e886d214876706f
- API-stats: http://api.byzanti.ne:8902/swagger-stats/ui#sws_summary
- swagger-apidocs: http://api.byzanti.ne:8902/api-docs
- swagger-editor: https://editor.swagger.io/

# Design

The high-level design shown below provides an unified interface for all on-chain EOS operations.

- The key components are the API itself, which encapsulates the EOS-chain methods and nuances by using eosjs and ecc.
- It uses cryptographic nonce to secure customers from replay attack.
- The design necessitates customers to aquire an API-KEY/SALT which is a one time excercise. The api-key is then used to fetch the nonce for signing write-transactions and transmit the "sig" attribute as shown in curl examples.

![Alt text](/images/byzapi.png?raw=true "Byzantine API Gateway")

# API cheat sheet for mainnet

```sh
// Curl Examples for Byzanti.ne API Gateway - EOS Mainnet
// Base API Operations
// create EOS key sets - owner and active keys
curl -X GET --header 'Accept: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getKeyset' | json_pp

//create account
curl -X POST -H "Content-Type:application/json" -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"creator":"gi3dcnjshege","name":"randomgooppy","owner":"EOS7m36vdT6WbE6JA25z9ePGhyWuqMYSLuCxLicMa1eLZ2YqSQqfh","active":"EOS59eusHMqbvJsPsdBKMNbuVHLz8kiif9NW27HQxiuge5iupvZec","sig":"6EF0AEFBFD50850D70366D5B7A6F04346BC81B2BDE0615CED49D803F1C2F042FAA42FF33723ADCC0E73CA4616603D29C4BF544FA515FB4BC1ECD55C9CE6DCF9E"}' http://local.byzanti.ne:8901/createAccount | json_pp

//get info (for testing)
curl -X GET --header 'Content-Type: application/json'  --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/info' | json_pp

//get all *legit EOS tokens
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/tokens' | json_pp

//get tokens by account
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/tokensByAccount/gi3dcnjshege' | json_pp

//get tokens by account
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/tokensByAccount/randomgooppy' | json_pp

//get account
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getAccount/gi3dcnjshege' | json_pp

//get account
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getAccount/randomgooppy' | json_pp

//get actions
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getActions?account=gi3dcnjshege' | json_pp

//transfer with pki
curl -X POST -H "Content-Type:application/json" -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"from":"gi3dcnjshege","to":"randomgooppy","amount":"0.0001 EOS","memo":"random test","sig":"6EF0AEFBFD50850D70366D5B7A6F04346BC81B2BDE0615CED49D803F1C2F042FAA42FF33723ADCC0E73CA4616603D29C4BF544FA515FB4BC1ECD55C9CE6DCF9E"}' http://local.byzanti.ne:8901/transfer | json_pp

//get transaction
curl -X GET --header 'Content-Type: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/transaction/5a309398bc60d7f2849080d3b88646a22d8e9f682a5d257f1ac7672d5122688d' | json_pp

//get refunds
curl -X GET --header 'Accept: application/json'  --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getRefunds/gi3dcnjshege' | json_pp

//get name bids
curl -X GET --header 'Accept: application/json' --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getNameBids/reddy' | json_pp


//Block - Producer operations
//Get EOS producers
curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json'  --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' 'http://local.byzanti.ne:8901/getProducers' | json_pp

//Vote for a producer libertyblock
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"voter":"gi3dcnjshege","producer":"libertyblock","sig":"XFBEk+="}' http://local.byzanti.ne:8901/voteProducer | json_pp

//Vote for a producer eosfishrocks
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"voter":"gi3dcnjshege","producer":"eosfishrocks","sig":"XFBEk+="}' http://local.byzanti.ne:8901/voteProducer | json_pp

/Delegate CPU/BW
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"from":"gi3dcnjshege","receiver":"gi3dcnjshege","net":"0.0001 EOS","cpu":"0.0001 EOS","sig":"6EF0AEFBFD50850D70366D5B7A6F04346BC81B2BDE0615CED49D803F1C2F042FAA42FF33723ADCC0E73CA4616603D29C4BF544FA515FB4BC1ECD55C9CE6DCF9E"}' http://local.byzanti.ne:8901/delegate | json_pp

//Undelegate CPU/BW
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"from":"gi3dcnjshege","receiver":"gi3dcnjshege","net":"0.9188 EOS","cpu":"0.9188 EOS","sig":"XFBEk+="}' http://local.byzanti.ne:8901/undelegate | json_pp

//get bandwidth
curl -X GET --header 'Content-Type: application/json'  --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  'http://local.byzanti.ne:8901/getBandwidth/gi3dcnjshege' | json_pp

//Buy Ram
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"payer":"gi3dcnjshege","receiver":"radomgoopy","quant":"0.0001 EOS","sig":"XFBEk+="}' http://local.byzanti.ne:8901/undelegate | json_pp

//Buy Ram in bytes
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"payer":"gi3dcnjshege","receiver":"gi3dcnjshege","bytes":240,"sig":"XFBEk+="}' http://local.byzanti.ne:8901/buyRamBytes | json_pp

//Sell RAM in bytes
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"account":"gi3dcnjshege","bytes":84,"sig":"XFBEk+="}' http://local.byzanti.ne:8901/sellRamBytes | json_pp

//Get RAM price
curl -X GET --header 'Content-Type: application/json'  --header 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  'http://local.byzanti.ne:8901/getRamPrice' | json_pp

//Scatter based transfer
curl -X POST -H "Content-Type:application/json"  -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -d '{"from":"gi3dcnjshege","to":"randomgooppy","amount":"0.0001 EOS","memo":"offline test","sig":"c77ac47879b2a8e622f9f301c98959cce5b97a53e4d42f5038d0d2d7cb78a0c3e3a135728fb5f5969a81f92cb0412727a040b143e12f57b533c7e0cc595ce965a6318cab00710549c3bc8984ec22b1c9c38f2db7e7e4cb6ba3bb48a3211db082c5315913977262004a4b8e0c052a8ee2","transactionHeaders":{"expiration": "2018-09-19T00:20:40", "ref_block_num": 19055, "ref_block_prefix": 4239914415}}' http://local.byzanti.ne:8901/transferWithScatter | json_pp
```

### Todos

- Add Synopsis, design aspects esp security, self-service api-key, the inner workings, etc for maintainability & supportability
