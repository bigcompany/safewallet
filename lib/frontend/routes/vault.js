var wallet = require('../../resources/wallet'),
    vault = require('../../resources/vault').vault,
    request = require('request'),
    BigNumber = require('bignumber.js');

module['exports'] = function (app) {
  app.get('/vault', function (req, res, next){
    vault.getBalance(function (err, balance){
      app.view['vault'].present({ balance: balance}, function(err, html){
        res.end(html);
      });
    });
  });
};