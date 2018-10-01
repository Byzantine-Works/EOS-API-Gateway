while true; do
    sleep 10
 # Make some ab workbench noise
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -v 2 http://local.byzanti.ne:8901/info
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/tokens
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/tokensByAccount/gi3dcnjshege
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/transaction/ada49d4a344c6eebb0901ccbb20a4ec874a1c792a0e3d19682e72e10e2d2be32
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/getAccount/gi3dcnjshege
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/getActions?account=gi3dcnjshege
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/getProducers
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/getBandwidth/gi3dcnjshege
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N'  -v 2 http://local.byzanti.ne:8901/getRamPrice
 ab -k -n 1 -H 'api_key: FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N' -v 2 http://local.byzanti.ne:8901/isTransactionIrreversible?id=ada49d4a344c6eebb0901ccbb20a4ec874a1c792a0e3d19682e72e10e2d2be32
done
