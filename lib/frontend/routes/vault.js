var wallet = require('../../resources/wallet'),
    request = require('request'),
    BigNumber = require('bignumber.js');

module['exports'] = function (app) {
  app.get('/vault', function(req, res, next) {
    wallet.all(function (err, _wallets){
      // get all wallets
      var totals = { "bitcoin": { amount: "0", price: "0" }, "peercoin": { amount: "0", price: "0" }, "dogecoin": { amount: "0", price: "0" }},
          prices = {};
      // get all updated prices
      // TODO: refactor nested request blocks using async library
      request.get({ url: 'https://btc-e.com/api/2/btc_usd/trades', method: "GET" }, function (err, resp, body){
        var btcPrice = JSON.parse(body);
        btcPrice = btcPrice[0].price.toString();
        prices['bitcoin'] = btcPrice;
        request.get({ url: 'https://btc-e.com/api/2/ppc_usd/trades', method: "GET" }, function (err, resp, body){
          var ppcPrice = JSON.parse(body);
          ppcPrice = ppcPrice[0].price.toString();
          prices['peercoin'] = ppcPrice;
          for (var currency in totals) {
            _wallets.forEach(function(_wallet){
              if (_wallet.currencies[currency] && _wallet.currencies[currency].amount) {
                var totalAmount = new BigNumber(totals[currency].amount);
                totals[currency].amount = totalAmount.plus(new BigNumber(_wallet.currencies[currency].amount)).toString();
              }
            });
          }
          var balance = {};
          ['bitcoin', 'peercoin'].forEach(function(currency){
            var price = new BigNumber(prices[currency]);
            totals[currency].price  = price.times(new BigNumber(totals[currency].amount)).round(2).toString();
          });
          balance.totals = totals;
          balance.prices = prices;
          app.view['vault'].present({ balance: balance}, function(err, html){
            res.end(html);
          });
        });
      });
    });
  });
};