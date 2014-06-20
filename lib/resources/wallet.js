var wallet = require('resource-wallet'),
    BigNumber = require('bignumber.js'),
    prices = require('./prices').prices;

wallet.method('getBalance', function (options, callback) {

  wallet.find({ owner: options.owner }, function (err, wallets){
    var w = wallets[0],
        callbacks = Object.keys(w.currencies).length,
        balance = new BigNumber(0);
    if(callbacks === 0) {
      return callback(null, "0.00");
    }
    for (var currency in w.currencies) {
      prices.calculate({ currency: currency, amount: w.currencies[currency].amount }, function(err, _prices){
        callbacks--;
        balance = balance.plus(new BigNumber(_prices.total));
        if(callbacks === 0) {
          callback(null, balance.toFixed());
        }
      });
    }
    
  })


});

module['exports'] = wallet;
