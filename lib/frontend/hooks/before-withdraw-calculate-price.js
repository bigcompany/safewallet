var wallet = require('../../resources/wallet'),
    prices = require('../../resources/prices').prices;

wallet.before('withdraw', function (data, next){
  prices.calculate({ currency: data.currency, amount: data.amount }, function (err, result){
    data.price = result;
    return next(null, data);
  });
});
