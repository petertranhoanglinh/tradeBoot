
const ccxt = require('ccxt');
require('dotenv').config();
const moment = require('moment');
const binnace = new ccxt.binance({
    apiKey: process.env.APIKEY,
    secret: process.env.SECRETKEY,
});

async function printgetBinance(btcPrice){
    // goi thong tin tai khoan
    const balance = await binnace.fetchBalance();
    const total = balance.total ; 
    console.log( `USDT của bạn là : ${total.USDT}`);
    console.log( `BNB của bạn là : ${total.BNB}`);
}
// lấy thông tin sàn giao dịch
const SAN =  new ccxt.gateio();
async function checkGiaSan(){
    var day = 12;
    var sys = 'KONO/USDT'
    const priceUSDT = await SAN.fetchOHLCV( sys, '1M', undefined,day);
    const priceOBJECT = priceUSDT.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1], 
            high:price[2], 
            low: price[3],
            close: price[4],
            volume:price[5]      }
    })
  
    const GIATTB = priceOBJECT.reduce((acc, price) => acc + price.close,0)/day;
    const lastPrice = priceOBJECT[priceOBJECT.length-1].close
    //console.log(priceOBJECT);
    console.log(`GIÁ TRUNG BÌNH  CỦA ${sys} LÀ : ${GIATTB}`);
    console.log(`GIÁ HIỆN TẠI CỦA ${sys} LÀ ${lastPrice}`)
}
//printgetBinance();
//checkGia();
checkGiaSan();