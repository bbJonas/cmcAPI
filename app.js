/* Example in Node.js ES6 using request-promise */
const request = require('request')
const rp = require('request-promise');

const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '50',
    'convert': 'EUR'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '1e6724c7-1939-42eb-aa2c-7c5903a58e8e'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
    //console.log('API call response:', response);
    
    var addMarketCapRank = function(rawData){
        rawData.data.forEach((coin) => {
            console.log(coin.name);
            console.log('Price (USD):');
            console.log(coin.quote.EUR.price);
            console.log('MarketCap:');
            console.log(coin.quote.EUR.volume_24h)
            console.log('   ')
        })
    };
    
addMarketCapRank(response);
    
}).catch((err) => {
  console.log('API call error:', err.message);
});
