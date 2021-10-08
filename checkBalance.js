
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
async function checkGia(){
    var sys = 'ADA/USDT'
    const priceUSDT = await binnace.fetchOHLCV(sys, '1d', undefined, 30);
    const priceOJECT = priceUSDT.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1], 
            high:price[2], 
            low: price[3],
            close: price[4],
            volume:price[5]      }
    })

    const GIATB30NGAYGANNHAT = priceOJECT.reduce((acc, price) => acc + price.close,0)/30;
    // giá hiện tại
    const lastPrice = priceOJECT[priceOJECT.length-1].close
   // console.log(priceOJECT);
    console.log(`GIÁ TRUNG BÌNH 30 NGÀY CỦA ${sys} Ở BINANCE LÀ ${GIATB30NGAYGANNHAT}`);
    console.log(`GIÁ  HIỆN TẠI CỦA  ${sys} Ở BINANCE LÀ  ${lastPrice}`);
}
const SAN =  new ccxt.huobi();
async function checkGiaSan(){
    var sys = 'HT/USDT'
    const priceUSDT = await SAN.fetchOHLCV( sys, '1d', undefined, 30);
    const priceOBJECT = priceUSDT.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1], 
            high:price[2], 
            low: price[3],
            close: price[4],
            volume:price[5]      }
    })

    const GIATTB = priceOBJECT.reduce((acc, price) => acc + price.close,0)/30;
    const lastPrice = priceOBJECT[priceOBJECT.length-1].close
    //console.log(priceOBJECT);
    console.log(`GIÁ TRUNG BÌNH 30 NGÀY CỦA ${sys} LÀ : ${GIATTB}`);
    console.log(`GIÁ HIỆN TẠI CỦA ${sys} LÀ ${lastPrice}`)
}
//printgetBinance();
//checkGia();
checkGiaSan();