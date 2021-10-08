// gọi thư viện 
const ccxt = require('ccxt');
const delay =  require('delay');
const moment = require('moment');
const binnace = new ccxt.binance({
    apiKey: process.env.APIKEY,
    secret: process.env.SECRETKEY,
});
// check tk giả
binnace.setSandboxMode(true);
async function printgetBinance(btcPrice){
    // goi thong tin tai khoan
    const balance = await binnace.fetchBalance();
    const total = balance.total;
    console.log(`Balance: BTC ${total.BTC}, USDT ${total.USDT}`);
    const totalUSD = (total.BTC - 1) * btcPrice+ total.USDT ;
    console.log(`total usd: ${totalUSD}.\n`)
}
async function main(){
    while (true){
        await tick();
        await delay(60  * 1000);
    }
}
async function tick(){
    const price = await binnace.fetchOHLCV('BTC/USDT', '1m', undefined, 20);
    const bPrice = price.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1], 
            high:price[2], 
            low: price[3],
            close: price[4],
            volume:price[5]      }
    })
    // trung bình 20 giá gần nhất.
    const averagePrice = bPrice.reduce((acc, price) => acc + price.close,0)/20;
    // giá sau cùng 
    const lastPrice = bPrice[bPrice.length-1].close
    // thuật toán 
    const direction = lastPrice > averagePrice ? 'sell' : 'buy'
    const TRADE_SIDE = 100; 
    const quantity = 100 / lastPrice 
    const order  = await binnace.createMarketOrder('BTC/USDT',direction,quantity)
    console.log(`averagePrice : ${averagePrice}. lastPrice : ${lastPrice}`)
    console.log(`${moment().format()}: ${direction}${quantity} BTC at ${lastPrice}`)
    printgetBinance(lastPrice);
    
}
main();