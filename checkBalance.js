
const ccxt = require('ccxt');
require('dotenv').config();
const delay =  require('delay');
const moment = require('moment');

const binnace = new ccxt.binance({
    apiKey: process.env.APIKEY,
    secret: process.env.SECRETKEY,
});
binnace.setSandboxMode(true);
var count = 0;

async function printgetBinance(btcPrice){
    // goi thong tin tai khoan
    const balance = await binnace.fetchBalance();
    const total = balance.total ; 
    console.log( `USDT của bạn là : ${total.USDT}`);
    console.log( `BNB của bạn là : ${total.BNB}`);
}

// lấy thông tin sàn giao dịch
const SAN =  new ccxt.huobi();
async function checkGiaSan(){
    var heso = 12;
    var sys = 'HT/USDT'
    const priceUSDT = await SAN.fetchOHLCV( sys, '1M', undefined,heso);
    const priceOBJECT = priceUSDT.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1], 
            high:price[2], 
            low: price[3],
            close: price[4],
            volume:price[5]      }
    })

   
    const GIATTB = priceOBJECT.reduce((acc, price) => acc + price.close,0)/heso;
    const lastPrice = priceOBJECT[priceOBJECT.length-1].close
    const lastOld = priceOBJECT[priceOBJECT.length-3].close
    console.log(priceOBJECT);
    console.log(`GIÁ TRUNG BÌNH  CỦA ${sys} LÀ : ${GIATTB}`);
    console.log(`GIÁ HIỆN TẠI CỦA ${sys} LÀ ${lastPrice}`)
    
    if(lastPrice<lastOld){
        var giam = lastOld - lastPrice;
        console.log(`gia ${sys} đang giảm ${giam}`)
        count = count - 1;
    }else{
        var tang = lastPrice - lastOld;
        console.log(`gia ${sys} đang tăng ${tang}`)
        count = count + 1;
    }
    if(count == 5 && lastPrice <= GIATTB * 0.85){
      console.log(`nên mua ${sys}`)
    }
    else if(count == -5 && lastPrice >= GIATTB * 1.15){
        console.log(`nên bán ${sys}`)
    }
    if(count<=0){
        console.log(`giá giảm ${count}`)
    }else{
        console.log(`giá tăng ${count}`)
    }


}
async function main(){
    while (true){
        checkGiaSan();
        await delay(60  * 1000);
    }
}
//printgetBinance();
//checkGia();
main();
