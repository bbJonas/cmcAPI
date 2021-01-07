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
    'limit': '20',
    'convert': 'EUR'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '1e6724c7-1939-42eb-aa2c-7c5903a58e8e'
  },
  json: true,
  gzip: true
};

var basketSize = 5;

var blacklist = ["XRP", "USDT"];
var notOnBlacklist = ((coin) => !blacklist.includes(coin));     // var found = blacklist.includes("XRP");

rp(requestOptions).then(response => {
  var cleanedData = {
  status:
  { timestamp: response.status.timestamp,
       error_code: response.status.error_code,
       error_message: response.status.error_message},
  data: []
};

var marketCap_rank = 1;

response.data.forEach((coin) => {
  if (notOnBlacklist(coin.symbol)) {

    var cleanedCoin = {id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      marketCap_rank: marketCap_rank,
      last_updated: coin.last_updated,
      price: coin.quote.EUR.price,
      volume_24h: coin.quote.EUR.volume_24h,
      market_cap: coin.quote.EUR.market_cap
      }
      marketCap_rank ++;
      cleanedData.data.push(cleanedCoin);
  }

})
return cleanedData;
}).then(result => {

  var data = result;

  function compare(a, b) {

  const volumeA = a.volume_24h;
  const volumeB = b.volume_24h;

  let comparison = 0;
  if (volumeA > volumeB) {
    comparison = 1;
  } else if (volumeA < volumeB) {
    comparison = -1;
  }
  return comparison * -1;
}

var volumeData = [];

result.data.forEach((coin) => {
  volumeData.push({symbol: coin.symbol, volume_24h: coin.volume_24h})
});

volumeData.sort(compare);


volumeData.forEach((coin) => {
  indexOfCoin = volumeData.indexOf(coin)+1;
  var picked = data.data.find(o => o.symbol === coin.symbol);  // Super zum Objekte manipulieren!
  picked.volume_rank = indexOfCoin;
});

data.data.forEach((coin) => {
  var picked = data.data.find(o => o.symbol === coin.symbol);
  var i = 0;
  if (coin.marketCap_rank <= 5) {
    i++
  }
  if (coin.volume_rank <= 5) {
    i++
  }
  picked.current_rating = i;
});

return data
}).then(result => {
  database.insert(result, function (err, newDoc) {
  console.log(newDoc);
})
}).catch((err) => {
  console.log('API call error:', err.message);
});
