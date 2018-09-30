import { isNull } from "util";

export default class State {
    constructor() {

        this.tokens = null,

        this.token = null,
        
        this.rateEURUSD = null,

        this.fiatAm = 0,
        
        this.scatter = false;

        this.amRend = null;

        this.fiatAmRend = null;

        this.loading = false;

        this.balance = null;
        
        this.privateKey = null;
        
        this.from = null;
        
        this.to = null;
        
        this.amount = 0;
        
        this.coin = null;

        this.rate = null;
        
        this.memo = null;

        this.usdeur = "USD";
    }
}