# Question

## What do all of these fields on a trade represent?
[0]: amountBuy
[1]: amountSell
[2]: tradeNonce
[3]: amount
[4]: tradeNonce
[5]: tokenBuy
[6]: tokenSell
[7]: makerFee
[8]: takerFee
[9]: feeAccount
[10]: maker
[11]: taker
[12]: makerSig
[13]: takerSig
[14]: admin
[15]: userNonce


# A Sample trade transaction

```
{
   "trx" : {
      "trx" : {
         "delay_sec" : 0,
         "actions" : [
            {
               "name" : "trade",
               "authorization" : [
                  {
                     "permission" : "active",
                     "actor" : "admin"
                  }
               ],
               "data" : {
                  "tokensell" : {
                     "contract" : "everipediaiq",
                     "quantity" : "5.232 IQ"
                  },
                  "tradenonce" : 1,
                  "amount" : 3076391,
                  "admin" : "admin",
                  "takerfee" : 104,
                  "amountsell" : 5232,
                  "makersig" : "001f78ae6874276220346ea694a3af6408c63f6660f7fbc8fe2db2824ee0f8a2d0e757b5a61ad485af10cd233618ebbbe3282e2d7267547ed5ac43bd03f59653b801",
                  "makerfee" : 30763,
                  "nonce" : 1,
                  "taker" : "taker1",
                  "amountbuy" : 3076391,
                  "feeaccount" : "uberdex.fee",
                  "takersig" : "001f59e94a3139768669e8d04e35eea45f5da8b84255777d60252d36e83edc9c97196f1a5a4409878b7346ad544f491a330a1223b780dccef7860f668f554118d5bb",
                  "tokenbuy" : {
                     "contract" : "eosio.token",
                     "quantity" : "307.6391 EOS"
                  },
                  "maker" : "maker1"
               },
               "hex_data" : "0000000080e9643227f12e00000000007014000000000000010000000000000027f12e0000000000010000000000000027f12e000000000004454f530000000000a6823403ea305570140000000000000349510000000000609d71495577d5562b7800000000000068000000000000000000000084aba0910000000084aba0c900945aa0ab74d5d142001f78ae6874276220346ea694a3af6408c63f6660f7fbc8fe2db2824ee0f8a2d0e757b5a61ad485af10cd233618ebbbe3282e2d7267547ed5ac43bd03f59653b80142001f59e94a3139768669e8d04e35eea45f5da8b84255777d60252d36e83edc9c97196f1a5a4409878b7346ad544f491a330a1223b780dccef7860f668f554118d5bb",
               "account" : "exchange"
            }
         ],
         "expiration" : "2018-11-08T05:28:21",
         "transaction_extensions" : [],
         "ref_block_num" : 5307,
         "ref_block_prefix" : 4166983230,
         "max_cpu_usage_ms" : 0,
         "max_net_usage_words" : 0,
         "context_free_data" : [],
         "context_free_actions" : [],
         "signatures" : [
            "SIG_K1_K5taWfAYbkWagWdvvnhwHjUmumFK8tUnBKuFnV8Gww7bcxCZvsFVKBcwCjwbtdG9HX8UiGkXJp2Yms2ssccGBkq4bwFjfs"
         ]
      },
      "receipt" : {
         "cpu_usage_us" : 8910,
         "trx" : [
            1,
            {
               "packed_trx" : "75c9e35bbb143e1e5ff800000000010000008a4dd35057000000000095cccd010000000080e9643200000000a8ed32328e020000000080e9643227f12e00000000007014000000000000010000000000000027f12e0000000000010000000000000027f12e000000000004454f530000000000a6823403ea305570140000000000000349510000000000609d71495577d5562b7800000000000068000000000000000000000084aba0910000000084aba0c900945aa0ab74d5d142001f78ae6874276220346ea694a3af6408c63f6660f7fbc8fe2db2824ee0f8a2d0e757b5a61ad485af10cd233618ebbbe3282e2d7267547ed5ac43bd03f59653b80142001f59e94a3139768669e8d04e35eea45f5da8b84255777d60252d36e83edc9c97196f1a5a4409878b7346ad544f491a330a1223b780dccef7860f668f554118d5bb00",
               "compression" : "none",
               "packed_context_free_data" : "",
               "signatures" : [
                  "SIG_K1_K5taWfAYbkWagWdvvnhwHjUmumFK8tUnBKuFnV8Gww7bcxCZvsFVKBcwCjwbtdG9HX8UiGkXJp2Yms2ssccGBkq4bwFjfs"
               ]
            }
         ],
         "net_usage_words" : 46,
         "status" : "executed"
      }
   },
   "last_irreversible_block" : 964601,
   "block_time" : "2018-11-08T05:27:22.000",
   "traces" : [],
   "block_num" : 857278,
   "id" : "375bbf189209f3107831c745cb2aa60081ccd72637919b635e669ced47eb1f1b"
}
```
MethodID: trade
[0]:  0000000000000000000000000000000000000000000006a2147ceaa14651c4ed
[1]:  00000000000000000000000000000000000000000000000007d322ff9719600a
[2]:  000000000000000000000000000000000000000000000000000000000002e630
[3]:  000000000000000000000000000000000000000000000000000000000000002d
[4]:  0000000000000000000000000000000000000000000006a2147ceaa14651c4ed
[5]:  000000000000000000000000000000000000000000000000000000000000046f
[6]:  00000000000000000000000000000000000000000000000000038d7ea4c68000
[7]:  000000000000000000000000000000000000000000000000001950b996dfce70
[8]:  000000000000000000000000a849eaae994fb86afa73382e9bd88c2b6b18dc71
[9]:  0000000000000000000000000000000000000000000000000000000000000000
[10]: 000000000000000000000000f0ec187925afd056711a95cccecf4af984fe5a4c
[11]: 000000000000000000000000951c7c87537d236bb54c178b091073a36e0a3b8b
[12]: 000000000000000000000000000000000000000000000000000000000000001c
[13]: 000000000000000000000000000000000000000000000000000000000000001c
[14]: 3d3b7b2f84f600ff8e3cd079e73a438211a91d003275c44a3fa7343f9c12cc49
[15]: 2ea0431b220783c91f1637b7de31eb655d932de72a176805d4ed58f2c4c70fd9
[16]: a911812b43c220f2bd8100718ade043b70e5257f8bf47db99fd2625fbc0c79ba
[17]: 6748478f13d9fc78163adfab0d138dba7e3e42dbf381a2b09cd79ba4fd161b1d

# Breakdown

## MethodID: 0xef343588
This is the soliditySha3 hash of the function signature: `trade(uint256[8],address[4],uint8[2],bytes32[4])`

## [0] - amountBuy
This is the amount of the token being bought by the maker if the whole order were to be filled, signed by the maker

Example: Hex --> Int
(31324047749915079722221) of tokenBuy)

## [1] - amountSell
This is the amount of the token being sold by the maker if the whole order were to be filled, signed by the maker

Example: Hex --> Int
(563832859498471434 of tokenSell)

## [2] - expires
This is a currently unused field, always set to 190000, but inactive. In the future it will represent a block number after which the order can no longer be filled, signed by the maker

## [3] - nonce
This is a one time integer between 1 and 2^256 used to make the order unique while preventing replay attacks, signed by the maker

Example: Hex --> Int
45

## [4] - amount
This it the amount (<= amountBuy) that the order is being filled for, signed by the taker

Exmaple: Hex --> Int
31324047749915079722221

## [5] - tradeNonce
This is the nonce that the taker signs

Eample: Hex --> Int
1135

## [6] - feeMake
This is the fee taken from the maker as a proportion of 1 ether, in units of tokenBuy

Example: Hex --> Int
1000000000000000 -> divide by 1000000000000000000 == 0.1% fee

## [7] - feeTake
This is the fee taken from the taker as a proportion of 1 ether, in units of tokenSell

Example: Hex --> Int
7125632448188016 -> divide by 1000000000000000000 approximately = 0.7125632448188016#% fee

## [8] - tokenBuy
Address of the token being bought by the maker, sold by the taker.

Example: Hex --> Address
0xa849eaae994fb86afa73382e9bd88c2b6b18dc71 (MVL)

## [9] - tokenSell
Address of the token being sold by the maker, bought by the taker.

Example: Hex --> Address
0x0000000000000000000000000000000000000000 (this is the null address, which denotes Ether)

## [10] - maker
Address of the maker

Example: Hex --> Address
0xf0ec187925afd056711a95cccecf4af984fe5a4c

## [11] - taker
Address of the taker

Example: Hex --> Address
0x951c7c87537d236bb54c178b091073a36e0a3b8b

## [12] - maker v
The signature "v" value of the maker signature.

Example: Hex --> Int (27 or 28)
28

## [13] taker v
The signature "v" value of the taker signature.

Exmaple: HEx --> Int (27 or 28)
28

## [14] maker r

The signature "r" value of the maker signature.

Exmaple: Hex --> Bytes32
0x3d3b7b2f84f600ff8e3cd079e73a438211a91d003275c44a3fa7343f9c12cc49

## [15] maker s

The signature "s" value of the maker signature.

Exmaple: Hex --> Bytes32
0x2ea0431b220783c91f1637b7de31eb655d932de72a176805d4ed58f2c4c70fd9

## [16] taker r

The signature "r" value of the taker signature.

Example: Hex --> Bytes32
0xa911812b43c220f2bd8100718ade043b70e5257f8bf47db99fd2625fbc0c79ba

## [17] taker s

The signature "s" value of the taker signature.

Exmaple: Hex --> Bytes32
0x6748478f13d9fc78163adfab0d138dba7e3e42dbf381a2b09cd79ba4fd161b1d