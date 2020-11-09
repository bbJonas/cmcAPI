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
  console.log(response);
  database.insert({response});
}).catch((err) => {
  console.log('API call error:', err.message);
});
