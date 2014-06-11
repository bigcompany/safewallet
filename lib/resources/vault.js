var resource = require('resource'),
    request = require('request'),
    BigNumber = require('bignumber.js'),
    wallet = require('./wallet'),
    prices = require('./prices').prices,
    vault = resource.define('vault');

vault.method('getBalance', function (callback){
  var totals = { 
    "bitcoin": { amount: "0", price: "0" },
    "peercoin": { amount: "0", price: "0" },
    "litecoin": { amount: "0", price: "0" },
    "dogecoin": { amount: "0", price: "0" }
  },
  total = new BigNumber(0);
  prices.latest(function (err, price){
    var _prices = price.prices;
    wallet.all(function (err, _wallets){
      _wallets.forEach(function(_wallet){
        for (var currency in totals) {
          if (_wallet.currencies[currency] && _wallet.currencies[currency].amount) {
            var totalAmount = new BigNumber(totals[currency].amount);
            totals[currency].amount = totalAmount.plus(new BigNumber(_wallet.currencies[currency].amount));
            totals[currency].amount = totals[currency].amount.toString();
          }
        }
      });
      var balance = {};
      Object.keys(_prices).forEach(function(currency){
        var price = new BigNumber(_prices[currency]);
        totals[currency].price  = price.times(new BigNumber(totals[currency].amount)).round(2);
        total = total.plus(totals[currency].price);
      });
      balance.totals = totals;
      balance.total = total;
      balance.prices = _prices;
      return callback(null, balance);
    });
  });
});

exports.vault = vault;