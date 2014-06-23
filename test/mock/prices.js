var prices = require("../../lib/resources/prices").prices,
    colors = require('colors');

prices.method('latest', function(data, callback){
  var mockPrices = { _rev: '1-6fbe3035d44d25ce7a0f95ef07729b62',
    prices: 
     { bitcoin: '594.95',
       peercoin: '1.62',
       litecoin: '9.63856',
       dogecoin: '0.000333172' },
    ctime: 1403482538541,
    mtime: 1403482538541,
    id: 'cb3b8ddc469d79375a065d946c754386' };
  console.log("===============================================");
  console.log("PRICES MOCK DETECTED prices.latest call".yellow);
  console.log("===============================================");
  callback(null, mockPrices);
});
