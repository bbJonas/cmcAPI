const request = require('request');
const rp = require('request-promise');
const Datastore = require('nedb');

const database = new Datastore('import.db');
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

rp(requestOptions).then(response => {

  database.insert(response, function (err, newDoc) {
  console.log(newDoc);
})
}).catch((err) => {
  console.log('Something went wrong at API Call', err.message);
});
