# Delete current index for tickers
# curl -XDELETE http://localhost:9200/tickers/ticker
node -e 'require("./esload.js").loadTickers()'
node -e 'require("./esload.js").readTickers()'