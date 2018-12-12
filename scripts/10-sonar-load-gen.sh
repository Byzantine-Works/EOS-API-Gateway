node -e 'require("./esload.js").deleteSonar()'
sleep 1
node -e 'require("./esload.js").loadSonar()'
sleep 1
node -e 'require("./esload.js").readSonar()'