# Delete current index for orders
# curl -XDELETE http://localhost:9200/orders/

node -e 'require("./esload.js").deleteOrders()'
sleep 5
node -e 'require("./esload.js").loadOrders()'
sleep 5
node -e 'require("./esload.js").readOrders()'