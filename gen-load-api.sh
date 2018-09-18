while true; do
    sleep 10
 # Make some ab workbench noise
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/info
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/tokens
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/tokensByAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/transaction/ada49d4a344c6eebb0901ccbb20a4ec874a1c792a0e3d19682e72e10e2d2be32
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getAccount/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getActions?account=gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getProducers
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getBandwidth/gi3dcnjshege
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/getRamPrice
 ab -k -n 1 -v 2 http://api.byzanti.ne:8902/isTransactionIrreversible?id=ada49d4a344c6eebb0901ccbb20a4ec874a1c792a0e3d19682e72e10e2d2be32
done
