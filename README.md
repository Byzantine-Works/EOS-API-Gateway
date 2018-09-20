# Synopsis
# Build

```sh
git clone https://github.com/Byzantine-Works/EOS-API-Gateway.git
npm install
vi ~/etc/hosts (add loopback interface: 127.0.0.1	local.byzanti.ne)
npm start
curl http://local.byzanti.ne/8901/info
```
swagger-ui: http://local.byzanti.ne/8901/docs
swagger-stats:  http://api.byzanti.ne:8902/swagger-stats/ui#sws_summary
swagger-apidocs:    http://api.byzanti.ne:8901/api-docs
swagger-editor: https://editor.swagger.io/

# Design

# API curl cheat sheet
```sh
// Curl Examples for Byzanti.ne API Gateway - EOS Mainnet
curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/info' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/tokens' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/tokensByAccount/gi3dcnjshege' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/tokensByAccount/randomgooppy' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/getAccount/gi3dcnjshege' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/getAccount/randomgooppy' | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/getActions?account=gi3dcnjshege' | json_pp

curl -X POST -H "Content-Type:application/json" -d '{"from":"reddy","to":"exchange","amount":"0.0001 EOS","memo":"random test","sig":"cipher"}' http://api.byzanti.ne:8902/transfer | json_pp

curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/transaction/0a3c7d2bf7426a19dd3f7e8a641d5954d8f1459036bd5eb212c69373072f74c4' | json_pp

//Block - Producer operations
//Get EOS mainnet producers
curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/getProducers' | json_pp

//Vote for a producer libertyblock
curl -X POST -H "Content-Type:application/json" -d '{"voter":"gi3dcnjshege","producer":"libertyblock","sig":"XFBEk+="}' http://api.byzanti.ne:8901/voteProducer | json_pp

//Vote for a producer eosfishrocks
curl -X POST -H "Content-Type:application/json" -d '{"voter":"gi3dcnjshege","producer":"eosfishrocks","sig":"XFBEk+="}' http://api.byzanti.ne:8901/voteProducer | json_pp

//Undelegate CPU/BW
curl -X POST -H "Content-Type:application/json" -d '{"from":"gi3dcnjshege","receiver":"gi3dcnjshege","net":"0.9188 EOS","cpu":"0.9188 EOS","sig":"XFBEk+="}' http://api.byzanti.ne:8901/undelegate | json_pp

//get bandwidth
curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://local.byzanti.ne:8901/getBandwidth/gi3dcnjshege' | json_pp

//Buy Ram
curl -X POST -H "Content-Type:application/json" -d '{"payer":"gi3dcnjshege","receiver":"radomgoopy","quant":"0.0001 EOS","sig":"XFBEk+="}' http://api.byzanti.ne:8902/undelegate | json_pp

//Buy Ram in bytes
curl -X POST -H "Content-Type:application/json" -d '{"payer":"gi3dcnjshege","receiver":"gi3dcnjshege","bytes":240,"sig":"XFBEk+="}' http://api.byzanti.ne:8902/buyRamBytes | json_pp

//Sell RAM in bytes
curl -X POST -H "Content-Type:application/json" -d '{"account":"gi3dcnjshege","bytes":84,"sig":"XFBEk+="}' http://api.byzanti.ne:8902/sellRamBytes | json_pp

//Get RAM price
curl -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://api.byzanti.ne:8902/getRamPrice' | json_pp
```

### Todos
 - Add Synopsis, design aspects esp security, self-service api-key, the inner workings, etc for maintainability & supportability
