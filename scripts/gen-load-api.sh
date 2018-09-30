while true; do
    sleep 10
 # Make some ab workbench noise
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/info
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/tokens
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/tokensByAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/transaction/4a64a982dd01057cf0e2c8ad12deb67114d1cc55241c364dccbe84479d36cc21
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getActions?account=gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getProducers
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getBandwidth/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getRamPrice
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/isTransactionIrreversible?id=4a64a982dd01057cf0e2c8ad12deb67114d1cc55241c364dccbe84479d36cc21
done
