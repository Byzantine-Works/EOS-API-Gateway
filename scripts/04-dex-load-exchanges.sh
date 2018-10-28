# Load data for exchanges
node -e 'require("./esload.js").deleteExchanges()'
node -e 'require("./esload.js").loadExchanges()'
node -e 'require("./esload.js").readExchanges()'