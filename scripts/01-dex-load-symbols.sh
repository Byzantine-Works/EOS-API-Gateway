# Delete current index for symbols
node -e 'require("./esload.js").loadSymbols()'
node -e 'require("./esload.js").readSymbols()'