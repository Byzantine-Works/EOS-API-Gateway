node -e 'require("./esload.js").deleteTrades()'
sleep 1
node -e 'require("./esload.js").loadTrades()'
# sleep 30
# node -e 'require("./esload.js").readTrades()'