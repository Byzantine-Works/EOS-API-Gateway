while true; do
    sleep 10
 # Make some ab workbench noise
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/info
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/tokens
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/tokensByAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/transaction/4a64a982dd01057cf0e2c8ad12deb67114d1cc55241c364dccbe84479d36cc21
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/getAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/getActions?account=gi3dcnjshege
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/getProducers
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/getBandwidth/gi3dcnjshege
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/getRamPrice
 ab -k -n 1 -v 2 http://local.byzanti.ne:8901/isTransactionIrreversible?id=4a64a982dd01057cf0e2c8ad12deb67114d1cc55241c364dccbe84479d36cc21
done
