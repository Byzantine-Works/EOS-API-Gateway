
export default class State {
    constructor() {

        this.tokens = ["IQ", "HORUS","EOS"],

        this.token = "EOS",

        this.fiatAm = 0,
        
        this.scatter = false;
        
        this.privateKey = null;
        
        this.from = null;
        
        this.to = null;
        
        this.amount = 0;
        
        this.coin = "EOS";

        this.rate = null;
        
        this.memo = null;

        this.usdeur = "USD";
    }
}