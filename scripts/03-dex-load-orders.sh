# Delete current index for tickers
# curl -XDELETE http://localhost:9200/orders/
node -e 'require("./esload.js").loadOrders()'
node -e 'require("./esload.js").readOrders()'