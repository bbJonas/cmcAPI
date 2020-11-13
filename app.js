/* Example in Node.js ES6 using request-promise */
const request = require('request');
const rp = require('request-promise');
const Datastore = require('nedb');

const database = new Datastore('database.db');
database.loadDatabase();

const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '5',
    'convert': 'EUR'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '1e6724c7-1939-42eb-aa2c-7c5903a58e8e'
  },
  json: true,
  gzip: true
};


rp(requestOptions).then(response => {
  var cleanedData = {
  status:
  { timestamp: response.status.timestamp,
       error_code: response.status.error_code,
       error_message: response.status.error_message},
  data: []
};

response.data.forEach((coin) => {
  var cleanedCoin = {id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    cmc_rank: coin.cmc_rank,
    last_updated: coin.last_updated,
    EUR: {price: coin.quote.EUR.price,
          volume_24h: coin.quote.EUR.volume_24h,
          market_cap: coin.quote.EUR.market_cap
          }
    }
    cleanedData.data.push(cleanedCoin);
})
return cleanedData;
}).then(result => {
  database.insert(result, function (err, newDoc) {
  console.log(newDoc);
})
}).catch((err) => {
  console.log('API call error:', err.message);
});
