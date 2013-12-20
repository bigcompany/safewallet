var ledger = require('../../resources/ledger').ledger,
    wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/wallet', function (req, res, next) {

    if (typeof req.session.sessionID === 'undefined') {
      return res.redirect(301, '/login');
    }

    wallet.find({ owner: req.session.name }, function (err, _wallet) {
      if (err) {
        throw err;
      }
      ledger.find({ owner: req.session.name }, function(err, _ledger){
        if (err) {
          throw err;
        }
        app.view['wallet'].present({ wallet: _wallet[0], ledger: _ledger }, function(err, html){
          res.end(html);
        });
      });
    });

  });

};