# Unlock wallet
cleos wallet unlock -n f42 --password PW5JwC1d2ycHWFrbPsNHQNkAgVJoNdDwjEqf43XK5WvibFcnfqEKZ

# Reset exchange
cleos push action exchange resetex '{"owner":"exchange"}' -p exchange

# Create accounts [maker1,taker1,admin,exchange,uberdex.fee, etc]
# set admin account
cleos push action exchange setadmin '{"account":"admin","isadmin": 1}' -p exchange

# issue maker taker tokens
cleos push action eosio.token issue '{"to":"maker1","quantity":"100000.0000 EOS","memo":"init stake from uberdex"}' -p eosio.token
cleos push action eosio.token issue '{"to":"taker1","quantity":"100000.0000 EOS","memo":"init stake from uberdex"}' -p eosio.token
cleos push action everipediaiq issue '{"to":"taker1","quantity":"100000.000 IQ","memo":"init stake from uberdex"}' -p everipediaiq
cleos push action everipediaiq issue '{"to":"maker1","quantity":"100000.000 IQ","memo":"init stake from uberdex"}' -p everipediaiq
cleos push action everipediaiq issue '{"to":"exchange","quantity":"100.000 IQ","memo":"deposit"}' -p everipediaiq

cleos transfer taker1 exchange "99000.0000 EOS" deposit -p taker1
cleos push action everipediaiq transfer '[ "maker1", "exchange", "50000.000 IQ", "deposit" ]' -p maker1@active

cleos transfer maker1 exchange "99000.0000 EOS" deposit -p maker1
cleos push action everipediaiq transfer '[ "taker1", "exchange", "50000.000 IQ", "deposit" ]' -p taker1@active

# get exchange balances
cleos push action exchange getbalances '{"owner":"maker1"}' -p maker1 --json
cleos push action exchange getbalances '{"owner":"taker1"}' -p taker1 --json
cleos push action exchange getbalances '{"owner":"uberdex.fee"}' -p uberdex.fee --json
